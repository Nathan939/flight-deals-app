import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  variant?: 'default' | 'glass'
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, variant = 'default', className, children, ...props }, ref) => {
    const baseClasses = 'w-full px-4 py-3 rounded-lg transition-all duration-200 text-white cursor-pointer'

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

        <select
          ref={ref}
          className={cn(
            baseClasses,
            variantClasses[variant],
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          {...props}
        >
          {children}
        </select>

        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
