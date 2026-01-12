'use client'

import { cn } from '@/lib/utils'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  className?: string
}

export default function Switch({ checked, onChange, label, className }: SwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black',
        checked ? 'bg-primary' : 'bg-gray-700',
        className
      )}
    >
      {label && <span className="sr-only">{label}</span>}
      <span
        className={cn(
          'inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200',
          checked ? 'translate-x-7' : 'translate-x-1'
        )}
      />
    </button>
  )
}
