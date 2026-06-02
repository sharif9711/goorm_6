import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, message, Segmented, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Calendar, dateFnsLocalizer, Views, type View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { PageHeader } from '@/components/common/PageHeader'
import {
  EventFormModal,
  type EventFormValues,
} from '@/components/calendar/EventFormModal'
import { useAuthUserId } from '@/store/authStore'
import * as eventApi from '@/api/eventApi'
import type { Event } from '@/types'
import dayjs from 'dayjs'

const locales = { ko }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: Event
}

const messages = {
  today: '오늘',
  previous: '이전',
  next: '다음',
  month: '월',
  week: '주',
  day: '일',
  agenda: '일정',
  date: '날짜',
  time: '시간',
  event: '일정',
  noEventsInRange: '이 기간에 일정이 없습니다.',
}

export default function CalendarPage() {
  const userId = useAuthUserId()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>(Views.MONTH)
  const [date, setDate] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editEvent, setEditEvent] = useState<Event | null>(null)
  const [slotRange, setSlotRange] = useState<{ start: Date; end: Date } | null>(null)

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      setEvents(await eventApi.fetchEvents(userId))
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    void load()
  }, [load])

  const calendarEvents: CalendarEvent[] = useMemo(
    () =>
      events.map((e) => ({
        id: e.id,
        title: e.title,
        start: new Date(e.start_time),
        end: new Date(e.end_time),
        resource: e,
      })),
    [events],
  )

  const handleCreate = async (values: EventFormValues) => {
    if (!userId) return
    try {
      await eventApi.createEvent(userId, {
        title: values.title,
        description: values.description ?? null,
        start_time: values.start_time.toISOString(),
        end_time: values.end_time.toISOString(),
      })
      message.success('일정이 추가되었습니다')
      setModalOpen(false)
      setSlotRange(null)
      await load()
    } catch {
      message.error('일정 추가에 실패했습니다')
    }
  }

  const handleUpdate = async (values: EventFormValues) => {
    if (!editEvent) return
    try {
      await eventApi.updateEvent(editEvent.id, {
        title: values.title,
        description: values.description ?? null,
        start_time: values.start_time.toISOString(),
        end_time: values.end_time.toISOString(),
      })
      message.success('일정이 수정되었습니다')
      setEditEvent(null)
      await load()
    } catch {
      message.error('일정 수정에 실패했습니다')
    }
  }

  const handleDelete = async (event: Event) => {
    try {
      await eventApi.deleteEvent(event.id)
      message.success('일정이 삭제되었습니다')
      setEditEvent(null)
      await load()
    } catch {
      message.error('일정 삭제에 실패했습니다')
    }
  }

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSlotRange({ start, end })
    setEditEvent(null)
    setModalOpen(true)
  }

  const handleSelectEvent = (calEvent: CalendarEvent) => {
    setEditEvent(calEvent.resource)
    setSlotRange(null)
    setModalOpen(true)
  }

  const modalInitial = editEvent
    ? {
        title: editEvent.title,
        description: editEvent.description ?? undefined,
        start_time: dayjs(editEvent.start_time),
        end_time: dayjs(editEvent.end_time),
      }
    : slotRange
      ? {
          start_time: dayjs(slotRange.start),
          end_time: dayjs(slotRange.end),
        }
      : undefined

  return (
    <div>
      <PageHeader
        title="캘린더"
        subtitle="Notion Calendar 스타일 일정 관리"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditEvent(null)
              setSlotRange(null)
              setModalOpen(true)
            }}
          >
            새 일정
          </Button>
        }
      />

      <Card style={{ marginBottom: 16 }}>
        <Segmented
          value={view}
          onChange={(v) => setView(v as View)}
          options={[
            { label: '월간', value: Views.MONTH },
            { label: '주간', value: Views.WEEK },
            { label: '일간', value: Views.DAY },
            { label: 'Agenda', value: Views.AGENDA },
          ]}
        />
      </Card>

      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin size="large" />
          </div>
        ) : (
          <div style={{ height: 560 }}>
            <Calendar
              localizer={localizer}
              culture="ko"
              messages={messages}
              events={calendarEvents}
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              style={{ height: '100%' }}
              popup
            />
          </div>
        )}
      </Card>

      <EventFormModal
        open={modalOpen}
        title={editEvent ? '일정 수정' : '새 일정'}
        initialValues={modalInitial}
        onCancel={() => {
          setModalOpen(false)
          setEditEvent(null)
          setSlotRange(null)
        }}
        onSubmit={editEvent ? handleUpdate : handleCreate}
      />

      {editEvent && modalOpen && (
        <div style={{ marginTop: 8, textAlign: 'right' }}>
          <Button danger onClick={() => void handleDelete(editEvent)}>
            이 일정 삭제
          </Button>
        </div>
      )}
    </div>
  )
}
