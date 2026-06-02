import { Modal, Form, Input, InputNumber } from 'antd'

export interface HabitFormValues {
  title: string
  target_days: number
}

interface HabitFormModalProps {
  open: boolean
  onCancel: () => void
  onSubmit: (values: HabitFormValues) => Promise<void>
}

export function HabitFormModal({ open, onCancel, onSubmit }: HabitFormModalProps) {
  const [form] = Form.useForm<HabitFormValues>()

  return (
    <Modal
      title="새 습관"
      open={open}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={() => void form.validateFields().then(onSubmit)}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" initialValues={{ target_days: 7 }}>
        <Form.Item name="title" label="습관" rules={[{ required: true }]}>
          <Input placeholder="예: 물 2L 마시기" />
        </Form.Item>
        <Form.Item name="target_days" label="주간 목표 일수" rules={[{ required: true }]}>
          <InputNumber min={1} max={7} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
