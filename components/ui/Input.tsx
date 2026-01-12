import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  variant?: 'default' | 'glass'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, variant = 'default', className, ...props }, ref) => {
    const baseClasses = 'w-full px-4 py-3 rounded-lg transition-all duration-200 text-white placeholder-gray-400'

    const variantClasses = {
      default: 'bg-gray-900 border border-gray-700 focus:outline-none focus:border-primary focus:bg-gray-800',
      glass: 'input-glass'
    }

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold mb-2 text-gray-300">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              baseClasses,
              variantClasses[variant],
              icon && 'pl-12',
              error && 'border-red-500 focus:border-red-500',
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
