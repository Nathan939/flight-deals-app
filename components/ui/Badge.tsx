import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  pulse?: boolean
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  pulse = false
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full font-bold'

  const variantClasses = {
    default: 'bg-gray-700 text-gray-300',
    primary: 'bg-primary text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-black',
    error: 'bg-red-500 text-white'
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        pulse && 'animate-pulse-slow',
        className
      )}
    >
      {children}
    </span>
  )
}
