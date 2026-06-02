import { useCallback, useEffect, useState } from 'react'
import {
  Button,
  Card,
  Col,
  InputNumber,
  Progress,
  Row,
  Spin,
  Typography,
  message,
  Popconfirm,
} from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { PageHeader } from '@/components/common/PageHeader'
import { GoalFormModal, type GoalFormValues } from '@/components/goal/GoalFormModal'
import { useAuthUserId } from '@/store/authStore'
import * as goalApi from '@/api/goalApi'
import type { Goal } from '@/types'

export default function GoalsPage() {
  const userId = useAuthUserId()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editGoal, setEditGoal] = useState<Goal | null>(null)

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      setGoals(await goalApi.fetchGoals(userId))
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    void load()
  }, [load])

  const handleCreate = async (values: GoalFormValues) => {
    if (!userId) return
    try {
      await goalApi.createGoal(userId, values)
      message.success('목표가 추가되었습니다')
      setModalOpen(false)
      await load()
    } catch {
      message.error('추가에 실패했습니다')
    }
  }

  const handleEdit = async (values: GoalFormValues) => {
    if (!editGoal) return
    try {
      await goalApi.updateGoal(editGoal.id, values)
      message.success('목표가 수정되었습니다')
      setEditGoal(null)
      await load()
    } catch {
      message.error('수정에 실패했습니다')
    }
  }

  const handleProgressChange = async (goal: Goal, current: number | null) => {
    if (current === null) return
    try {
      await goalApi.updateGoal(goal.id, { current_value: current })
      await load()
    } catch {
      message.error('진행률 업데이트에 실패했습니다')
    }
  }

  const handleDelete = async (goalId: string) => {
    try {
      await goalApi.deleteGoal(goalId)
      message.success('목표가 삭제되었습니다')
      await load()
    } catch {
      message.error('삭제에 실패했습니다')
    }
  }

  return (
    <div>
      <PageHeader
        title="목표"
        subtitle="목표 진행률을 추적하세요"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            새 목표
          </Button>
        }
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Spin size="large" />
        </div>
      ) : goals.length === 0 ? (
        <Card>
          <Typography.Text type="secondary">등록된 목표가 없습니다.</Typography.Text>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {goals.map((goal) => {
            const percent = Math.min(
              100,
              Math.round((goal.current_value / goal.target_value) * 100) || 0,
            )
            return (
              <Col xs={24} sm={12} lg={8} key={goal.id}>
                <Card
                  title={goal.title}
                  extra={
                    <>
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => setEditGoal(goal)}
                      />
                      <Popconfirm
                        title="목표를 삭제할까요?"
                        onConfirm={() => void handleDelete(goal.id)}
                      >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </>
                  }
                >
                  <Progress percent={percent} status={percent >= 100 ? 'success' : 'active'} />
                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Typography.Text>현재</Typography.Text>
                    <InputNumber
                      min={0}
                      max={goal.target_value}
                      value={goal.current_value}
                      onChange={(v) => void handleProgressChange(goal, v)}
                    />
                    <Typography.Text type="secondary">/ {goal.target_value}</Typography.Text>
                  </div>
                </Card>
              </Col>
            )
          })}
        </Row>
      )}

      <GoalFormModal
        open={modalOpen}
        title="새 목표"
        onCancel={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />

      <GoalFormModal
        open={!!editGoal}
        title="목표 수정"
        initialValues={
          editGoal
            ? {
                title: editGoal.title,
                target_value: editGoal.target_value,
                current_value: editGoal.current_value,
              }
            : undefined
        }
        onCancel={() => setEditGoal(null)}
        onSubmit={handleEdit}
      />
    </div>
  )
}
