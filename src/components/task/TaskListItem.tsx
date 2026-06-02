import { Checkbox, List, Space, Typography, Button, Dropdown, Select } from 'antd'
import {
  HolderOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons'
import type { Task, TaskPriority } from '@/types'
import { PriorityTag } from '@/components/task/PriorityTag'
import { formatDueDate } from '@/utils/date'
import { PRIORITY_OPTIONS } from '@/utils/priority'

interface TaskListItemProps {
  task: Task
  draggable?: boolean
  onDragStart?: (e: React.DragEvent, taskId: string) => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent, taskId: string) => void
  onToggle: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onPriorityChange?: (task: Task, priority: TaskPriority) => void
}

export function TaskListItem({
  task,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  onToggle,
  onEdit,
  onDelete,
  onPriorityChange,
}: TaskListItemProps) {
  const completed = task.status === 'completed'

  const menuItems = [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '수정',
      onClick: () => onEdit(task),
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '삭제',
      danger: true,
      onClick: () => onDelete(task),
    },
  ]

  return (
    <List.Item
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, task.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, task.id)}
      style={{
        opacity: completed ? 0.6 : 1,
        cursor: draggable ? 'grab' : 'default',
        padding: '12px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', gap: 12 }}>
        {draggable && (
          <HolderOutlined style={{ color: '#999', marginTop: 4, flexShrink: 0 }} />
        )}
        <Checkbox checked={completed} onChange={() => onToggle(task)} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Typography.Text
            delete={completed}
            strong
            style={{ display: 'block' }}
          >
            {task.title}
          </Typography.Text>
          {task.description && (
            <Typography.Text type="secondary" ellipsis style={{ display: 'block' }}>
              {task.description}
            </Typography.Text>
          )}
          <Space size={8} wrap style={{ marginTop: 8 }}>
            <PriorityTag priority={task.priority} />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {formatDueDate(task.due_date)}
            </Typography.Text>
            {onPriorityChange && (
              <Select
                size="small"
                value={task.priority}
                options={PRIORITY_OPTIONS}
                onChange={(priority) => onPriorityChange(task, priority)}
                style={{ width: 140 }}
              />
            )}
          </Space>
        </div>
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      </div>
    </List.Item>
  )
}
