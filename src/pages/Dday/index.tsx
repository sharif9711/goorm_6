import { ComingSoon } from '@/components/common/ComingSoon'
import { PageHeader } from '@/components/common/PageHeader'

export default function DdayPage() {
  return (
    <div>
      <PageHeader title="D-Day" subtitle="중요한 날짜를 카운트다운하세요" />
      <ComingSoon
        title="D-Day 준비 중"
        description="D-120, D+3 형식 카운트다운이 Phase 3에서 제공됩니다."
        phase="Phase 3"
      />
    </div>
  )
}
