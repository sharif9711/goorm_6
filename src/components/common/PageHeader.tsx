import { Typography, Space } from 'antd'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  extra?: ReactNode
}

export function PageHeader({ title, subtitle, extra }: PageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 12,
      }}
    >
      <Space direction="vertical" size={0}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
        {subtitle && <Typography.Text type="secondary">{subtitle}</Typography.Text>}
      </Space>
      {extra}
    </div>
  )
}
