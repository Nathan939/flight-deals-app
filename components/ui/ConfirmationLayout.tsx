'use client'

import { ReactNode } from 'react'
import Link from 'next/link'

interface ConfirmationLayoutProps {
  icon: ReactNode
  title: string
  message: string
  details?: ReactNode
  primaryAction: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
}

export default function ConfirmationLayout({
  icon,
  title,
  message,
  details,
  primaryAction,
  secondaryAction
}: ConfirmationLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="glass-card max-w-lg w-full p-8 text-center animate-fade-in-up">
        {/* Success Icon with Animation */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 border-2 border-green-500/50 flex items-center justify-center animate-scale-in">
            <span className="text-5xl">{icon}</span>
          </div>
        </div>

        {/* Success Checkmark Animation */}
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-green-500"
            viewBox="0 0 52 52"
          >
            <circle
              className="stroke-current fill-none"
              cx="26"
              cy="26"
              r="25"
              strokeWidth="2"
              style={{
                strokeDasharray: 166,
                strokeDashoffset: 0,
                animation: 'circle-draw 0.6s ease-in-out'
              }}
            />
            <path
              className="stroke-current fill-none"
              strokeWidth="3"
              strokeLinecap="round"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
              style={{
                strokeDasharray: 48,
                strokeDashoffset: 0,
                animation: 'checkmark-draw 0.3s ease-in-out 0.6s forwards'
              }}
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">
          {title}
        </h1>

        {/* Message */}
        <p className="text-gray-300 text-lg mb-6">
          {message}
        </p>

        {/* Details Section */}
        {details && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-left">
            {details}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          <Link href={primaryAction.href}>
            <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-primary/30">
              {primaryAction.label}
            </button>
          </Link>

          {secondaryAction && (
            <Link href={secondaryAction.href}>
              <button className="w-full py-3 text-gray-400 hover:text-white transition-colors duration-200">
                {secondaryAction.label}
              </button>
            </Link>
          )}
        </div>

        {/* Confetti Effect (CSS Only) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-float"
              style={{
                backgroundColor: ['#DC2626', '#FBB028', '#0EA5E9', '#10B981'][i % 4],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 3}s`,
                opacity: 0.6
              }}
            />
          ))}
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes circle-draw {
          0% {
            stroke-dashoffset: 166;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes checkmark-draw {
          0% {
            stroke-dashoffset: 48;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  )
}
