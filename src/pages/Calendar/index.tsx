import { ComingSoon } from '@/components/common/ComingSoon'
import { PageHeader } from '@/components/common/PageHeader'

export default function CalendarPage() {
  return (
    <div>
      <PageHeader title="캘린더" subtitle="Notion Calendar 스타일 일정 관리" />
      <ComingSoon
        title="캘린더 준비 중"
        description="react-big-calendar 기반 월간/주간/일간 뷰가 Phase 2에서 제공됩니다."
        phase="Phase 2"
      />
    </div>
  )
}
