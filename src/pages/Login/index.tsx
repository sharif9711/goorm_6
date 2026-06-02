import { Card, Form, Input, Button, Typography, message, Divider, Alert } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const DEMO_EMAIL = 'demo@goorm.com'
const DEMO_PASSWORD = 'demo1234'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const loading = useAuthStore((s) => s.loading)
  const [form] = Form.useForm()

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await login(values.email, values.password)
      message.success('로그인되었습니다')
      navigate('/app')
    } catch {
      message.error('로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.')
    }
  }

  const handleDemoLogin = async () => {
    try {
      await login(DEMO_EMAIL, DEMO_PASSWORD)
      message.success('데모 계정으로 로그인되었습니다')
      navigate('/app')
    } catch {
      message.error('데모 로그인에 실패했습니다')
    }
  }

  return (
    <Card style={{ width: '100%', maxWidth: 420 }}>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        로그인
      </Typography.Title>

      <Alert
        type="info"
        showIcon
        message="로컬 MVP"
        description="데이터는 브라우저 localStorage에 저장됩니다. .env · Supabase 설정이 필요 없습니다."
        style={{ marginBottom: 16 }}
      />

      <Form form={form} layout="vertical" onFinish={(v) => void onFinish(v)}>
        <Form.Item
          name="email"
          label="이메일"
          rules={[
            { required: true, message: '이메일을 입력하세요' },
            { type: 'email', message: '올바른 이메일 형식이 아닙니다' },
          ]}
        >
          <Input placeholder="you@example.com" size="large" />
        </Form.Item>
        <Form.Item
          name="password"
          label="비밀번호"
          rules={[{ required: true, message: '비밀번호를 입력하세요' }]}
        >
          <Input.Password placeholder="비밀번호" size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            로그인
          </Button>
        </Form.Item>
      </Form>

      <Button block size="large" onClick={() => void handleDemoLogin()} loading={loading}>
        데모 계정으로 시작
      </Button>
      <Typography.Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
        데모: {DEMO_EMAIL} / {DEMO_PASSWORD}
      </Typography.Text>

      <Divider />
      <Typography.Text>
        계정이 없으신가요? <Link to="/signup">회원가입</Link>
      </Typography.Text>
    </Card>
  )
}
