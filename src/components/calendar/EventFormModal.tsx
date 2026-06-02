import { Modal, Form, Input, DatePicker } from 'antd'
import dayjs from 'dayjs'

export interface EventFormValues {
  title: string
  description?: string
  start_time: dayjs.Dayjs
  end_time: dayjs.Dayjs
}

interface EventFormModalProps {
  open: boolean
  title: string
  initialValues?: Partial<EventFormValues>
  confirmLoading?: boolean
  onCancel: () => void
  onSubmit: (values: EventFormValues) => Promise<void>
}

export function EventFormModal({
  open,
  title,
  initialValues,
  confirmLoading,
  onCancel,
  onSubmit,
}: EventFormModalProps) {
  const [form] = Form.useForm<EventFormValues>()

  const handleOk = async () => {
    const values = await form.validateFields()
    if (values.end_time.isBefore(values.start_time)) {
      form.setFields([{ name: 'end_time', errors: ['종료 시간은 시작 이후여야 합니다'] }])
      return
    }
    await onSubmit(values)
    form.resetFields()
  }

  return (
    <Modal
      title={title}
      open={open}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={() => void handleOk()}
      confirmLoading={confirmLoading}
      destroyOnHidden
      afterOpenChange={(visible) => {
        if (visible) {
          const start = initialValues?.start_time ?? dayjs().hour(9).minute(0)
          const end = initialValues?.end_time ?? start.add(1, 'hour')
          form.setFieldsValue({
            title: initialValues?.title ?? '',
            description: initialValues?.description ?? '',
            start_time: start,
            end_time: end,
          })
        }
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="제목"
          rules={[{ required: true, message: '제목을 입력하세요' }]}
        >
          <Input placeholder="일정 제목" />
        </Form.Item>
        <Form.Item name="description" label="설명">
          <Input.TextArea rows={2} placeholder="설명 (선택)" />
        </Form.Item>
        <Form.Item
          name="start_time"
          label="시작"
          rules={[{ required: true, message: '시작 시간을 선택하세요' }]}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="end_time"
          label="종료"
          rules={[{ required: true, message: '종료 시간을 선택하세요' }]}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
