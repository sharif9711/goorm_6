import { ComingSoon } from '@/components/common/ComingSoon'
import { PageHeader } from '@/components/common/PageHeader'

export default function StatsPage() {
  return (
    <div>
      <PageHeader title="통계" subtitle="생산성 점수와 차트를 확인하세요" />
      <ComingSoon
        title="통계 대시보드 준비 중"
        description="recharts 기반 주간/월간 생산성 차트가 Phase 4에서 제공됩니다."
        phase="Phase 4"
      />
    </div>
  )
}
