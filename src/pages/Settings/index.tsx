import { Switch, Typography, Space, Button, message, Alert, Tag } from 'antd'
import { PageHeader } from '@/components/common/PageHeader'
import { PageCard } from '@/components/common/PageCard'
import { useSettingStore } from '@/store/settingStore'
import { useAuthStore } from '@/store/authStore'
import { getDataMode } from '@/lib/config'
import { resetDemoData } from '@/lib/localDb'

export default function SettingsPage() {
  const theme = useSettingStore((s) => s.theme)
  const toggleTheme = useSettingStore((s) => s.toggleTheme)
  const profile = useAuthStore((s) => s.profile)
  const initialize = useAuthStore((s) => s.initialize)
  const dataMode = getDataMode()

  const handleResetDemo = async () => {
    resetDemoData()
    await initialize()
    message.success('데모 데이터로 초기화되었습니다')
    window.location.href = '/app'
  }

  return (
    <div>
      <PageHeader title="설정" subtitle="앱 환경을 설정하세요" />

      <PageCard title="데이터 저장소" style={{ marginBottom: 16 }}>
        <Space direction="vertical">
          <div>
            현재 모드:{' '}
            <Tag color={dataMode === 'supabase' ? 'green' : 'blue'}>
              {dataMode === 'supabase' ? 'Supabase (클라우드)' : '로컬 (localStorage)'}
            </Tag>
          </div>
          {dataMode === 'supabase' ? (
            <Typography.Text type="secondary">
              PostgreSQL + Supabase Auth에 데이터가 저장됩니다. AI 기능(Phase 5)은 OpenAI
              API 키 없이 구현하지 않았습니다.
            </Typography.Text>
          ) : (
            <Typography.Text type="secondary">
              `.env.example`을 `.env`로 복사한 뒤 Supabase URL·anon key를 입력하고 서버를
              재시작하면 클라우드 모드로 전환됩니다.
            </Typography.Text>
          )}
        </Space>
      </PageCard>

      <PageCard title="계정">
        <Space direction="vertical">
          <Typography.Text>이메일: {profile?.email}</Typography.Text>
          <Typography.Text>닉네임: {profile?.nickname ?? '-'}</Typography.Text>
        </Space>
      </PageCard>

      <PageCard title="화면" style={{ marginTop: 16 }}>
        <Space>
          <Typography.Text>다크 모드</Typography.Text>
          <Switch checked={theme === 'dark'} onChange={toggleTheme} />
        </Space>
      </PageCard>

      {dataMode === 'local' && (
        <PageCard title="로컬 데이터" style={{ marginTop: 16 }}>
          <Alert
            type="info"
            showIcon
            message="데모 데이터 초기화"
            description="샘플 할 일, 일정, D-Day로 되돌립니다."
            style={{ marginBottom: 12 }}
          />
          <Button onClick={() => void handleResetDemo()}>데모 데이터 초기화</Button>
        </PageCard>
      )}

      {dataMode === 'supabase' && (
        <PageCard title="Supabase 설정 확인" style={{ marginTop: 16 }}>
          <Typography.Paragraph>
            SQL Editor에서 <Typography.Text code>supabase/schema.sql</Typography.Text> 실행
            여부를 확인하세요. 테이블·RLS가 없으면 할 일 저장이 실패할 수 있습니다.
          </Typography.Paragraph>
        </PageCard>
      )}
    </div>
  )
}
