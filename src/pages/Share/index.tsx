import { useCallback, useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  List,
  Select,
  Space,
  Table,
  Typography,
  message,
  Popconfirm,
  Tag,
} from 'antd'
import {
  PlusOutlined,
  CopyOutlined,
  MailOutlined,
  LinkOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { PageCard } from '@/components/common/PageCard'
import { useAuthUserId } from '@/store/authStore'
import * as shareApi from '@/api/shareApi'
import type { ShareRole } from '@/types'

const ROLE_OPTIONS = [
  { value: 'read', label: '읽기' },
  { value: 'edit', label: '편집' },
  { value: 'admin', label: '관리자' },
]

export default function SharePage() {
  const userId = useAuthUserId()
  const [searchParams, setSearchParams] = useSearchParams()
  const [calendars, setCalendars] = useState<shareApi.SharedCalendarWithMembers[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [inviteForm] = Form.useForm<{ email: string; role: ShareRole }>()
  const [joinToken, setJoinToken] = useState('')

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const list = await shareApi.fetchSharedCalendars(userId)
      setCalendars(list)
      setSelectedId((prev) => {
        if (prev && list.some((c) => c.id === prev)) return prev
        return list[0]?.id ?? null
      })
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const token = searchParams.get('join')
    if (token) setJoinToken(token)
  }, [searchParams])

  const selected = calendars.find((c) => c.id === selectedId) ?? null

  const handleCreate = async (values: { name: string }) => {
    if (!userId) return
    try {
      const cal = await shareApi.createSharedCalendar(userId, values.name)
      message.success('공유 캘린더가 생성되었습니다')
      setCreateOpen(false)
      setSelectedId(cal.id)
      await load()
    } catch {
      message.error('생성에 실패했습니다')
    }
  }

  const handleInvite = async (values: { email: string; role: ShareRole }) => {
    if (!selected) return
    try {
      await shareApi.inviteMember(selected.id, values.email, values.role)
      message.success('초대가 완료되었습니다')
      inviteForm.resetFields()
      await load()
    } catch (e) {
      message.error(e instanceof Error ? e.message : '초대에 실패했습니다')
    }
  }

  const handleCopyLink = () => {
    if (!selected) return
    const link = shareApi.buildInviteLink(selected.invite_token)
    void navigator.clipboard.writeText(link)
    message.success('초대 링크가 복사되었습니다')
  }

  const handleJoin = async () => {
    if (!userId || !joinToken.trim()) return
    try {
      await shareApi.joinByInviteToken(userId, joinToken.trim())
      message.success('캘린더에 참여했습니다')
      setJoinToken('')
      setSearchParams({})
      await load()
    } catch (e) {
      message.error(e instanceof Error ? e.message : '참여에 실패했습니다')
    }
  }

  const memberColumns = [
    { title: '이메일', dataIndex: 'email', key: 'email' },
    {
      title: '권한',
      dataIndex: 'role',
      key: 'role',
      render: (role: ShareRole, record: { id: string }) =>
        selected?.isOwner ? (
          <Select
            size="small"
            value={role}
            options={ROLE_OPTIONS}
            onChange={(v) => void shareApi.updateMemberRole(record.id, v).then(load)}
            style={{ width: 100 }}
          />
        ) : (
          <Tag>{shareApi.getRoleLabel(role)}</Tag>
        ),
    },
    ...(selected?.isOwner
      ? [
          {
            title: '',
            key: 'action',
            render: (_: unknown, record: { id: string }) => (
              <Popconfirm
                title="멤버를 제거할까요?"
                onConfirm={() =>
                  void shareApi.removeMember(record.id).then(() => {
                    message.success('제거되었습니다')
                    void load()
                  })
                }
              >
                <Button type="text" danger size="small" icon={<DeleteOutlined />} />
              </Popconfirm>
            ),
          },
        ]
      : []),
  ]

  return (
    <div>
      <PageHeader
        title="공유"
        subtitle="캘린더를 팀과 공유하세요"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            공유 캘린더 만들기
          </Button>
        }
      />

      <PageCard title="초대 링크로 참여" style={{ marginBottom: 16 }}>
        <Space.Compact style={{ width: '100%', maxWidth: 480 }}>
          <Input
            placeholder="초대 토큰 또는 링크의 join= 값"
            value={joinToken}
            onChange={(e) => setJoinToken(e.target.value)}
          />
          <Button type="primary" onClick={() => void handleJoin()}>
            참여
          </Button>
        </Space.Compact>
      </PageCard>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <PageCard title="내 캘린더" style={{ flex: '1 1 240px', minWidth: 240 }}>
          <List
            loading={loading}
            dataSource={calendars}
            locale={{ emptyText: '공유 캘린더가 없습니다' }}
            renderItem={(item) => (
              <List.Item
                onClick={() => setSelectedId(item.id)}
                style={{
                  cursor: 'pointer',
                  background: selectedId === item.id ? '#e6f4ff' : undefined,
                  borderRadius: 8,
                  padding: '8px 12px',
                }}
              >
                <div>
                  <Typography.Text strong>{item.name}</Typography.Text>
                  <br />
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {item.isOwner ? '소유자' : '멤버'} · {item.members.length}명
                  </Typography.Text>
                </div>
              </List.Item>
            )}
          />
        </PageCard>

        {selected && (
          <PageCard
            title={selected.name}
            style={{ flex: '2 1 400px' }}
            extra={
              selected.isOwner && (
                <Space>
                  <Button icon={<LinkOutlined />} onClick={handleCopyLink}>
                    링크 복사
                  </Button>
                  <Popconfirm
                    title="캘린더를 삭제할까요?"
                    onConfirm={() =>
                      void shareApi.deleteSharedCalendar(selected.id, userId!).then(() => {
                        message.success('삭제되었습니다')
                        setSelectedId(null)
                        void load()
                      })
                    }
                  >
                    <Button danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              )
            }
          >
            {selected.isOwner && (
              <Form
                form={inviteForm}
                layout="inline"
                onFinish={(v) => void handleInvite(v)}
                style={{ marginBottom: 16 }}
                initialValues={{ role: 'read' }}
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: '이메일 입력' },
                    { type: 'email', message: '올바른 이메일' },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="이메일 초대" style={{ width: 220 }} />
                </Form.Item>
                <Form.Item name="role">
                  <Select options={ROLE_OPTIONS} style={{ width: 100 }} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    초대
                  </Button>
                </Form.Item>
              </Form>
            )}

            <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
              초대 링크: {shareApi.buildInviteLink(selected.invite_token)}
              <Button
                type="link"
                size="small"
                icon={<CopyOutlined />}
                onClick={handleCopyLink}
              />
            </Typography.Paragraph>

            <Table
              size="small"
              rowKey="id"
              columns={memberColumns}
              dataSource={selected.members}
              pagination={false}
            />
          </PageCard>
        )}
      </div>

      {createOpen && (
        <PageCard title="새 공유 캘린더" style={{ marginTop: 16, maxWidth: 400 }}>
          <Form onFinish={(v) => void handleCreate(v)}>
            <Form.Item name="name" rules={[{ required: true, message: '이름 입력' }]}>
              <Input placeholder="예: 팀 일정" />
            </Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                생성
              </Button>
              <Button onClick={() => setCreateOpen(false)}>취소</Button>
            </Space>
          </Form>
        </PageCard>
      )}
    </div>
  )
}
