-- 구름-TODO-LIST Supabase Schema
-- Supabase SQL Editor에서 실행하세요.

-- users (auth.users 연동 프로필)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  nickname text,
  avatar_url text,
  created_at timestamptz default now()
);

-- categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  color text not null default '#1677ff'
);

-- tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  priority text not null default 'P3' check (priority in ('P1', 'P2', 'P3', 'P4')),
  status text not null default 'pending' check (status in ('pending', 'completed', 'cancelled')),
  due_date timestamptz,
  repeat_type text not null default 'none' check (repeat_type in ('none', 'daily', 'weekly', 'monthly')),
  category_id uuid references public.categories(id) on delete set null,
  sort_order bigint not null default 0,
  created_at timestamptz default now()
);

-- events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  category_id uuid references public.categories(id) on delete set null
);

-- habits
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  target_days int not null default 7,
  created_at timestamptz default now()
);

-- habit_logs
create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  completed_date date not null,
  unique (habit_id, completed_date)
);

-- goals
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  target_value numeric not null default 100,
  current_value numeric not null default 0,
  created_at timestamptz default now()
);

-- ddays
create table if not exists public.ddays (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  target_date date not null,
  created_at timestamptz default now()
);

-- RLS
alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.tasks enable row level security;
alter table public.events enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.goals enable row level security;
alter table public.ddays enable row level security;

-- users policies
create policy "users_select_own" on public.users for select using (auth.uid() = id);
create policy "users_insert_own" on public.users for insert with check (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id);

-- generic user-owned tables
create policy "categories_all_own" on public.categories for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tasks_all_own" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "events_all_own" on public.events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "habits_all_own" on public.habits for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "goals_all_own" on public.goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ddays_all_own" on public.ddays for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- habit_logs via habit ownership
create policy "habit_logs_select" on public.habit_logs for select using (
  exists (select 1 from public.habits h where h.id = habit_id and h.user_id = auth.uid())
);
create policy "habit_logs_insert" on public.habit_logs for insert with check (
  exists (select 1 from public.habits h where h.id = habit_id and h.user_id = auth.uid())
);
create policy "habit_logs_delete" on public.habit_logs for delete using (
  exists (select 1 from public.habits h where h.id = habit_id and h.user_id = auth.uid())
);

-- 신규 가입 시 프로필 자동 생성 (선택)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, nickname)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nickname', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
