'use client';

import { DealData } from '@/lib/types'
import DecryptedNumber from '@/components/ui/DecryptedNumber'
import { useInViewport } from '@/hooks/useInViewport'

interface DealCardProps {
  deal: DealData
}

export default function DealCard({ deal }: DealCardProps) {
  const { elementRef, isInViewport } = useInViewport({ threshold: 0.2, triggerOnce: true });

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className="glass-card hover-lift hover-glow flex flex-col md:flex-row md:items-center md:justify-between gap-6 group"
    >
      {/* Left side: Destination */}
      <div className="flex-shrink-0 md:w-1/3 text-center md:text-left">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
          {deal.from} →{' '}
          <DecryptedNumber
            value={deal.to}
            className="text-xl md:text-2xl font-bold text-white"
            duration={700}
            isInViewport={isInViewport}
          />
        </h3>
        <p className="text-gray-400 text-xs md:text-sm flex items-center justify-center md:justify-start gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Vol aller-retour
        </p>
        <p className="text-gray-500 text-xs mt-1">{deal.dates}</p>
      </div>

      {/* Center: Price section */}
      <div className="flex-grow bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Main price with PRESERVED DecryptedNumber animation */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl md:text-5xl font-bold text-primary font-mono">
              <DecryptedNumber
                value={deal.price}
                className="text-4xl md:text-5xl font-bold text-primary font-mono"
                duration={800}
                isInViewport={isInViewport}
              />
              {deal.currency === 'EUR' ? '€' : deal.currency}
            </span>
            <span className="text-lg md:text-xl text-gray-400 line-through">
              {deal.originalPrice}€
            </span>
          </div>

          {/* Savings info */}
          <div className="flex flex-col items-start sm:items-end text-xs md:text-sm">
            <p className="text-gray-400">Économisez</p>
            <p className="text-green-400 font-bold text-lg">
              {deal.originalPrice - deal.price}€
            </p>
          </div>
        </div>
      </div>

      {/* Right side: CTA button */}
      <div className="flex-shrink-0 md:w-auto">
        <button className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 whitespace-nowrap shadow-lg shadow-primary/20 group-hover:shadow-primary/40">
          Voir les dates
        </button>
      </div>
    </div>
  )
}
