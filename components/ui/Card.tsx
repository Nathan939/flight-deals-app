import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  variant?: 'solid' | 'glass' | 'gradient'
  className?: string
  hover?: boolean
}

export default function Card({
  children,
  variant = 'solid',
  className = '',
  hover = false
}: CardProps) {
  const baseClasses = 'rounded-2xl p-6 transition-all duration-300'

  const variantClasses = {
    solid: 'bg-gray-900 border border-gray-800',
    glass: 'glass-card',
    gradient: 'bg-gradient-to-br from-gray-900 to-black border border-primary/30'
  }

  const hoverClasses = hover ? 'hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20' : ''

  return (
    <div className={cn(baseClasses, variantClasses[variant], hoverClasses, className)}>
      {children}
    </div>
  )
}
