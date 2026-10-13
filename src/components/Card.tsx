import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

interface CardProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'section'
  interactive?: boolean
  scrollReveal?: boolean
}

export function Card({ children, className, as: Tag = 'div', interactive, scrollReveal = false }: CardProps) {
  return (
    <Tag
      data-scroll-reveal={scrollReveal ? '' : undefined}
      className={cn(
        'rounded-2xl bg-surface border border-border shadow-soft',
        interactive &&
          'transition-all duration-200 hover:shadow-card hover:-translate-y-0.5',
        className
      )}
    >
      {children}
    </Tag>
  )
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-5 pb-0', className)}>{children}</div>
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-5', className)}>{children}</div>
}
