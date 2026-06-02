import { ComingSoon } from '@/components/common/ComingSoon'
import { PageHeader } from '@/components/common/PageHeader'

export default function HabitsPage() {
  return (
    <div>
      <PageHeader title="습관" subtitle="매일 습관을 체크하고 연속 달성일을 기록하세요" />
      <ComingSoon
        title="습관 트래커 준비 중"
        description="GitHub Contribution 스타일 습관 체크가 Phase 3에서 제공됩니다."
        phase="Phase 3"
      />
    </div>
  )
}
