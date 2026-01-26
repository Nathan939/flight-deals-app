'use client'

import { ReactNode } from 'react'

interface HelpSectionProps {
  title: string
  steps: {
    icon: ReactNode
    title: string
    description: string
  }[]
  className?: string
}

export default function HelpSection({ title, steps, className = '' }: HelpSectionProps) {
  return (
    <div className={`glass-card p-6 rounded-2xl ${className}`}>
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center space-y-3 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Step Number Badge */}
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>

              {/* Icon Container */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center text-4xl">
                {step.icon}
              </div>
            </div>

            {/* Step Title */}
            <h3 className="text-lg font-semibold text-white">
              {step.title}
            </h3>

            {/* Step Description */}
            <p className="text-sm text-gray-400 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Connecting Lines (Desktop only) */}
      <div className="hidden md:block relative -mt-32 mb-24">
        <div className="flex items-center justify-around px-12">
          {steps.map((_, index) => (
            index < steps.length - 1 && (
              <div
                key={index}
                className="flex-1 mx-8 h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent"
              />
            )
          ))}
        </div>
      </div>
    </div>
  )
}
