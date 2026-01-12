import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass'
  size?: 'small' | 'medium' | 'large'
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'medium',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'font-bold rounded-lg transition-all duration-200 inline-flex items-center justify-center'

  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white transform hover:scale-105',
    secondary: 'bg-white hover:bg-gray-100 text-black',
    outline: 'border-2 border-white hover:bg-white hover:text-black text-white',
    ghost: 'bg-transparent hover:bg-white/10 text-white',
    glass: 'glass hover:bg-white/15 text-white border border-white/20',
  }

  const sizes = {
    small: 'py-2 px-4 text-sm',
    medium: 'py-3 px-6 text-base',
    large: 'py-4 px-8 text-lg',
  }

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
