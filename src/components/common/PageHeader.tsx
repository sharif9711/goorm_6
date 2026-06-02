import { Typography } from 'antd'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  extra?: ReactNode
}

export function PageHeader({ title, subtitle, extra }: PageHeaderProps) {
  return (
    <div className="goorm-page-header">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <Typography.Title level={2} className="goorm-page-title">
            {title}
          </Typography.Title>
          {subtitle && (
            <Typography.Text type="secondary" className="goorm-page-subtitle">
              {subtitle}
            </Typography.Text>
          )}
        </div>
        {extra}
      </div>
    </div>
  )
}
