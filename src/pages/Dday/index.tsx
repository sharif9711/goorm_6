import { useCallback, useEffect, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Row,
  Spin,
  Typography,
  message,
  Popconfirm,
} from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { PageHeader } from '@/components/common/PageHeader'
import { DdayFormModal, type DdayFormValues } from '@/components/dday/DdayFormModal'
import { useAuthUserId } from '@/store/authStore'
import * as ddayApi from '@/api/ddayApi'
import { getDdayLabel } from '@/utils/date'
import type { Dday } from '@/types'
import dayjs from 'dayjs'

export default function DdayPage() {
  const userId = useAuthUserId()
  const [ddays, setDdays] = useState<Dday[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editDday, setEditDday] = useState<Dday | null>(null)

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      setDdays(await ddayApi.fetchDdays(userId))
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    void load()
  }, [load])

  const handleCreate = async (values: DdayFormValues) => {
    if (!userId) return
    try {
      await ddayApi.createDday(userId, {
        title: values.title,
        target_date: values.target_date.format('YYYY-MM-DD'),
      })
      message.success('D-Day가 추가되었습니다')
      setModalOpen(false)
      await load()
    } catch {
      message.error('추가에 실패했습니다')
    }
  }

  const handleEdit = async (values: DdayFormValues) => {
    if (!editDday) return
    try {
      await ddayApi.updateDday(editDday.id, {
        title: values.title,
        target_date: values.target_date.format('YYYY-MM-DD'),
      })
      message.success('D-Day가 수정되었습니다')
      setEditDday(null)
      await load()
    } catch {
      message.error('수정에 실패했습니다')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await ddayApi.deleteDday(id)
      message.success('D-Day가 삭제되었습니다')
      await load()
    } catch {
      message.error('삭제에 실패했습니다')
    }
  }

  return (
    <div>
      <PageHeader
        title="D-Day"
        subtitle="중요한 날짜를 카운트다운하세요"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            새 D-Day
          </Button>
        }
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Spin size="large" />
        </div>
      ) : ddays.length === 0 ? (
        <Card>
          <Typography.Text type="secondary">등록된 D-Day가 없습니다.</Typography.Text>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {ddays.map((dday) => (
            <Col xs={24} sm={12} md={8} key={dday.id}>
              <Card
                extra={
                  <>
                    <Button type="text" icon={<EditOutlined />} onClick={() => setEditDday(dday)} />
                    <Popconfirm
                      title="삭제할까요?"
                      onConfirm={() => void handleDelete(dday.id)}
                    >
                      <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </>
                }
              >
                <Typography.Title level={4} style={{ margin: 0 }}>
                  {dday.title}
                </Typography.Title>
                <Typography.Title level={2} style={{ margin: '8px 0', color: '#1677ff' }}>
                  {getDdayLabel(dday.target_date)}
                </Typography.Title>
                <Typography.Text type="secondary">{dday.target_date}</Typography.Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <DdayFormModal
        open={modalOpen}
        title="새 D-Day"
        onCancel={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />

      <DdayFormModal
        open={!!editDday}
        title="D-Day 수정"
        initialValues={
          editDday
            ? { title: editDday.title, target_date: dayjs(editDday.target_date) }
            : undefined
        }
        onCancel={() => setEditDday(null)}
        onSubmit={handleEdit}
      />
    </div>
  )
}
