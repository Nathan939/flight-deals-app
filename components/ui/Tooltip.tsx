'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'

interface TooltipProps {
  content: string | ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

export default function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className = ''
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [actualPosition, setActualPosition] = useState(position)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      adjustPosition()
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  const adjustPosition = () => {
    if (!tooltipRef.current || !triggerRef.current) return

    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const triggerRect = triggerRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let newPosition = position

    // Check if tooltip goes off screen and adjust
    if (position === 'top' && triggerRect.top - tooltipRect.height < 0) {
      newPosition = 'bottom'
    } else if (position === 'bottom' && triggerRect.bottom + tooltipRect.height > viewportHeight) {
      newPosition = 'top'
    } else if (position === 'left' && triggerRect.left - tooltipRect.width < 0) {
      newPosition = 'right'
    } else if (position === 'right' && triggerRect.right + tooltipRect.width > viewportWidth) {
      newPosition = 'left'
    }

    setActualPosition(newPosition)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const getPositionClasses = () => {
    const positions = {
      top: 'bottom-full left-1/2 -translate-x-1/2 -translate-y-2 mb-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 translate-y-2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 -translate-x-2 mr-2',
      right: 'left-full top-1/2 -translate-y-1/2 translate-x-2 ml-2'
    }
    return positions[actualPosition]
  }

  const getArrowClasses = () => {
    const arrows = {
      top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800',
      bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800',
      left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800',
      right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800'
    }
    return arrows[actualPosition]
  }

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg
            animate-fade-in-up whitespace-nowrap max-w-xs
            ${getPositionClasses()}
            ${className}
          `}
          role="tooltip"
        >
          {content}

          {/* Arrow */}
          <div
            className={`
              absolute w-0 h-0 border-4
              ${getArrowClasses()}
            `}
          />
        </div>
      )}
    </div>
  )
}
