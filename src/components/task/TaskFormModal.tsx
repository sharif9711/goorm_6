import { Modal, Form, Input, Select, DatePicker } from 'antd'
import dayjs from 'dayjs'
import type { Task } from '@/types'
import { PRIORITY_OPTIONS } from '@/utils/priority'

export interface TaskFormValues {
  title: string
  description?: string
  priority: Task['priority']
  due_date?: dayjs.Dayjs | null
}

interface TaskFormModalProps {
  open: boolean
  title: string
  initialValues?: Partial<TaskFormValues>
  confirmLoading?: boolean
  onCancel: () => void
  onSubmit: (values: TaskFormValues) => Promise<void>
}

export function TaskFormModal({
  open,
  title,
  initialValues,
  confirmLoading,
  onCancel,
  onSubmit,
}: TaskFormModalProps) {
  const [form] = Form.useForm<TaskFormValues>()

  const handleOk = async () => {
    const values = await form.validateFields()
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
          form.setFieldsValue({
            title: initialValues?.title ?? '',
            description: initialValues?.description ?? '',
            priority: initialValues?.priority ?? 'P3',
            due_date: initialValues?.due_date ?? null,
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
          <Input placeholder="할 일 제목" />
        </Form.Item>
        <Form.Item name="description" label="설명">
          <Input.TextArea rows={3} placeholder="설명 (선택)" />
        </Form.Item>
        <Form.Item name="priority" label="우선순위" rules={[{ required: true }]}>
          <Select options={PRIORITY_OPTIONS} />
        </Form.Item>
        <Form.Item name="due_date" label="마감일">
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export function taskToFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description ?? undefined,
    priority: task.priority,
    due_date: task.due_date ? dayjs(task.due_date) : null,
  }
}
