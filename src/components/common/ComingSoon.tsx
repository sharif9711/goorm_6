import { Card, Empty, Typography } from 'antd'

interface ComingSoonProps {
  title: string
  description: string
  phase?: string
}

export function ComingSoon({ title, description, phase }: ComingSoonProps) {
  return (
    <Card>
      <Empty
        description={
          <div>
            <Typography.Title level={4}>{title}</Typography.Title>
            <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
            {phase && (
              <Typography.Text type="secondary" italic>
                {phase}
              </Typography.Text>
            )}
          </div>
        }
      />
    </Card>
  )
}
