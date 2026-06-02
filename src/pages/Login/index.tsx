import { Form, Input, Button, Typography, message, Divider } from 'antd'
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
    <>
      <Typography.Title level={3} style={{ marginBottom: 8, fontWeight: 700 }}>
        로그인
      </Typography.Title>
      <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 28 }}>
        계정에 로그인하고 생산성을 높여보세요
      </Typography.Text>

      <Form form={form} layout="vertical" onFinish={(v) => void onFinish(v)} size="large">
        <Form.Item
          name="email"
          label="이메일"
          rules={[
            { required: true, message: '이메일을 입력하세요' },
            { type: 'email', message: '올바른 이메일 형식이 아닙니다' },
          ]}
        >
          <Input placeholder="you@example.com" />
        </Form.Item>
        <Form.Item
          name="password"
          label="비밀번호"
          rules={[{ required: true, message: '비밀번호를 입력하세요' }]}
        >
          <Input.Password placeholder="비밀번호" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 12 }}>
          <Button type="primary" htmlType="submit" block loading={loading}>
            로그인
          </Button>
        </Form.Item>
      </Form>

      <Button block size="large" onClick={() => void handleDemoLogin()} loading={loading}>
        데모 계정으로 시작
      </Button>
      <Typography.Text type="secondary" style={{ display: 'block', marginTop: 10, fontSize: 12 }}>
        데모: {DEMO_EMAIL} / {DEMO_PASSWORD}
      </Typography.Text>

      <Divider />
      <Typography.Text>
        계정이 없으신가요? <Link to="/signup">회원가입</Link>
      </Typography.Text>
    </>
  )
}
