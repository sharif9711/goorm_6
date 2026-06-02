# 구름-TODO-LIST

Planet + Notion Calendar + TickTick 스타일 통합 생산성 SaaS MVP

## 데이터 모드 (자동 전환)

| 조건 | 모드 | 저장 위치 |
|------|------|-----------|
| `.env`에 Supabase 키 **있음** | Supabase | PostgreSQL (클라우드) |
| `.env` **없음** | 로컬 MVP | 브라우저 localStorage |

OpenAI API 키는 **필요 없습니다**. AI 기능(Phase 5)은 미구현 상태입니다.

---

## Supabase 사용 (권장)

### 1. Supabase 프로젝트 준비

1. [supabase.com](https://supabase.com) 대시보드 → 프로젝트 선택(또는 생성)
2. **SQL Editor** → `supabase/schema.sql` 전체 실행
3. **Authentication → Providers** → Email 활성화

### 2. `.env` 설정

```bash
cp .env.example .env
```

`.env`에 아래 2값 입력 (대시보드 **Project Settings → API**):

```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

### 3. 실행

```bash
npm install
npm run dev
```

회원가입 → 로그인 → 할 일이 Supabase DB에 저장됩니다.

---

## 로컬 MVP (`.env` 없이)

```bash
npm install
npm run dev
```

- 데모 계정 자동 생성: `demo@goorm.com` / `demo1234`
- 설정 → 데모 데이터 초기화 가능

---

## MVP 진행 현황

### Phase 1 (완료)

- 로그인 / 회원가입 (Supabase 또는 로컬)
- Task CRUD, Today, 대시보드

### Phase 2~4 (플레이스홀더)

- 캘린더, 목표, 습관, D-Day, 공유, 통계

### Phase 5 (미구현 — OpenAI 키 불필요)

- AI 일정 생성, AI 생산성 분석

---

## 빌드

```bash
npm run build
```

## GitHub + Vercel 배포

구조: **GitHub(코드) → Vercel(호스팅) → Supabase(DB·로그인)**

### 1. GitHub에 올리기

```bash
cd goorm-todo-list
git init
git add .
git commit -m "chore: initial deploy setup"
gh repo create goorm-todo-list --public --source=. --push
```

`gh`가 없으면 GitHub에서 저장소를 만든 뒤:

```bash
git remote add origin https://github.com/USERNAME/goorm-todo-list.git
git branch -M main
git push -u origin main
```

### 2. Vercel 연결

1. [vercel.com](https://vercel.com) → **Add New Project** → GitHub 저장소 Import
2. **Root Directory**: 저장소 루트가 `goorm-todo-list`면 `.` / 상위 `goorm_6`면 `goorm-todo-list`
3. **Environment Variables** (Production + Preview):

| Name | Value |
|------|--------|
| `VITE_SUPABASE_URL` | `https://{project-ref}.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Publishable key (`sb_publishable_...`) |

4. **Deploy**

`vercel.json`이 SPA 라우팅(`/app`, `/login` 등) 404를 방지합니다.

### 3. Supabase Auth URL (배포 후 필수)

**Authentication → URL Configuration**

- **Site URL**: `https://your-app.vercel.app`
- **Redirect URLs**: `https://your-app.vercel.app/**`

### 4. 배포 확인

- 로그인 화면에 Supabase 연결 안내 표시
- 회원가입 → 할 일 생성 → Table Editor `tasks`에 행 추가 확인

---

## 보안

- `.env`는 Git에 커밋하지 마세요 (`.gitignore`에 포함됨)
- Publishable(anon) key만 프론트·Vercel에 사용. **Secret / service_role** key는 절대 노출 금지
