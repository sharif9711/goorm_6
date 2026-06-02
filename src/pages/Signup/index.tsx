import { Card, Form, Input, Button, Typography, message } from 'antd'
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
    <Card style={{ width: '100%', maxWidth: 420 }}>
      <Typography.Title level={4} style={{ marginBottom: 24 }}>
        회원가입
      </Typography.Title>
      <Form form={form} layout="vertical" onFinish={(v) => void onFinish(v)}>
        <Form.Item
          name="nickname"
          label="닉네임"
          rules={[{ required: true, message: '닉네임을 입력하세요' }]}
        >
          <Input placeholder="닉네임" size="large" />
        </Form.Item>
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
          rules={[
            { required: true, message: '비밀번호를 입력하세요' },
            { min: 6, message: '비밀번호는 6자 이상이어야 합니다' },
          ]}
        >
          <Input.Password placeholder="비밀번호" size="large" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="비밀번호 확인"
          dependencies={['password']}
          rules={[
            { required: true, message: '비밀번호를 다시 입력하세요' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('비밀번호가 일치하지 않습니다'))
              },
            }),
          ]}
        >
          <Input.Password placeholder="비밀번호 확인" size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            회원가입
          </Button>
        </Form.Item>
      </Form>
      <Typography.Text>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </Typography.Text>
    </Card>
  )
}
