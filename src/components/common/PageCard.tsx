import { Card } from 'antd'
import type { CardProps } from 'antd'

export function PageCard({ className, ...props }: CardProps) {
  return <Card className={`goorm-card ${className ?? ''}`.trim()} {...props} />
}
