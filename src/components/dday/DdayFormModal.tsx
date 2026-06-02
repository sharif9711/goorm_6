import { Modal, Form, Input, DatePicker } from 'antd'
import dayjs from 'dayjs'

export interface DdayFormValues {
  title: string
  target_date: dayjs.Dayjs
}

interface DdayFormModalProps {
  open: boolean
  title: string
  initialValues?: Partial<DdayFormValues>
  onCancel: () => void
  onSubmit: (values: DdayFormValues) => Promise<void>
}

export function DdayFormModal({
  open,
  title,
  initialValues,
  onCancel,
  onSubmit,
}: DdayFormModalProps) {
  const [form] = Form.useForm<DdayFormValues>()

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
            target_date: initialValues?.target_date ?? dayjs().add(30, 'day'),
          })
        }
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="이름" rules={[{ required: true }]}>
          <Input placeholder="예: 수능" />
        </Form.Item>
        <Form.Item name="target_date" label="날짜" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
