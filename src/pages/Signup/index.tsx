import { Form, Input, Button, Typography, message, Divider } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function SignupPage() {
  const navigate = useNavigate()
  const register = useAuthStore((s) => s.register)
  const loading = useAuthStore((s) => s.loading)
  const [form] = Form.useForm()

  const onFinish = async (values: {
    email: string
    password: string
    nickname: string
    confirmPassword: string
  }) => {
    try {
      await register(values.email, values.password, values.nickname)
      message.success('회원가입이 완료되었습니다')
      navigate('/app')
    } catch {
      message.error('회원가입에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <>
      <Typography.Title level={3} style={{ marginBottom: 8, fontWeight: 700 }}>
        회원가입
      </Typography.Title>
      <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 28 }}>
        새 워크스페이스를 시작하세요
      </Typography.Text>
      <Form form={form} layout="vertical" onFinish={(v) => void onFinish(v)} size="large">
        <Form.Item name="nickname" label="닉네임" rules={[{ required: true }]}>
          <Input placeholder="닉네임" />
        </Form.Item>
        <Form.Item
          name="email"
          label="이메일"
          rules={[{ required: true }, { type: 'email' }]}
        >
          <Input placeholder="you@example.com" />
        </Form.Item>
        <Form.Item
          name="password"
          label="비밀번호"
          rules={[{ required: true }, { min: 6, message: '6자 이상' }]}
        >
          <Input.Password placeholder="비밀번호" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="비밀번호 확인"
          dependencies={['password']}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) return Promise.resolve()
                return Promise.reject(new Error('비밀번호가 일치하지 않습니다'))
              },
            }),
          ]}
        >
          <Input.Password placeholder="비밀번호 확인" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            회원가입
          </Button>
        </Form.Item>
      </Form>
      <Divider />
      <Typography.Text>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </Typography.Text>
    </>
  )
}
