import { ComingSoon } from '@/components/common/ComingSoon'
import { PageHeader } from '@/components/common/PageHeader'

export default function SharePage() {
  return (
    <div>
      <PageHeader title="공유" subtitle="캘린더를 팀과 공유하세요" />
      <ComingSoon
        title="공유 캘린더 준비 중"
        description="이메일 초대 및 권한 관리가 Phase 4에서 제공됩니다."
        phase="Phase 4"
      />
    </div>
  )
}
