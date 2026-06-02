import { ComingSoon } from '@/components/common/ComingSoon'
import { PageHeader } from '@/components/common/PageHeader'

export default function GoalsPage() {
  return (
    <div>
      <PageHeader title="목표" subtitle="목표 진행률을 추적하세요" />
      <ComingSoon
        title="목표 관리 준비 중"
        description="목표 생성 및 Progress 진행률 표시가 Phase 3에서 제공됩니다."
        phase="Phase 3"
      />
    </div>
  )
}
