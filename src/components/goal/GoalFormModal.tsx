import { Modal, Form, Input, InputNumber } from 'antd'

export interface GoalFormValues {
  title: string
  target_value: number
  current_value: number
}

interface GoalFormModalProps {
  open: boolean
  title: string
  initialValues?: Partial<GoalFormValues>
  onCancel: () => void
  onSubmit: (values: GoalFormValues) => Promise<void>
}

export function GoalFormModal({
  open,
  title,
  initialValues,
  onCancel,
  onSubmit,
}: GoalFormModalProps) {
  const [form] = Form.useForm<GoalFormValues>()

  return (
    <Modal
      title={title}
      open={open}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={() => void form.validateFields().then(onSubmit)}
      destroyOnHidden
      afterOpenChange={(visible) => {
        if (visible) {
          form.setFieldsValue({
            title: initialValues?.title ?? '',
            target_value: initialValues?.target_value ?? 100,
            current_value: initialValues?.current_value ?? 0,
          })
        }
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="목표" rules={[{ required: true }]}>
          <Input placeholder="예: 독서 50권" />
        </Form.Item>
        <Form.Item name="target_value" label="목표 수치" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="current_value" label="현재 수치" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
