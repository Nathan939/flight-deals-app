'use client'

interface DealCardCompactProps {
  from: string
  to: string
  price: number
  originalPrice: number
  discount: number
  currency?: string
  tripType?: 'oneway' | 'return'
  onClick: () => void
  className?: string
}

export default function DealCardCompact({
  from,
  to,
  price,
  originalPrice,
  discount,
  currency = 'EUR',
  tripType = 'oneway',
  onClick,
  className = ''
}: DealCardCompactProps) {
  const getCurrencySymbol = (curr: string) => {
    const symbols: { [key: string]: string } = {
      EUR: '€',
      USD: '$',
      GBP: '£'
    }
    return symbols[curr] || curr
  }

  const getTripTypeLabel = (type: string) => {
    return type === 'return' ? 'A/R' : 'Aller simple'
  }

  const getTripTypeIcon = (type: string) => {
    return type === 'return' ? '⇄' : '→'
  }

  return (
    <div
      onClick={onClick}
      className={`
        relative group cursor-pointer
        bg-gradient-to-br from-gray-900 via-gray-800 to-black
        border border-primary/30
        hover:border-primary hover:scale-[1.02]
        rounded-xl p-6
        transition-all duration-300
        shadow-lg hover:shadow-2xl hover:shadow-primary/20
        ${className}
      `}
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute -top-3 -right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-scale-in">
          -{discount}%
        </div>
      )}

      <div className="grid grid-cols-[1fr_auto_1fr_auto] gap-4 items-center">
        {/* Departure */}
        <div className="text-left">
          <div className="text-2xl font-bold text-white mb-1">
            {from}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">
            Départ
          </div>
        </div>

        {/* Arrow with Trip Type */}
        <div className="flex flex-col items-center space-y-2 px-4">
          <div className="text-xs text-primary font-medium px-2 py-1 rounded-full bg-primary/10 border border-primary/30 whitespace-nowrap">
            {getTripTypeLabel(tripType)}
          </div>
          <div className="text-3xl text-primary group-hover:scale-110 transition-transform duration-300">
            {getTripTypeIcon(tripType)}
          </div>
        </div>

        {/* Arrival */}
        <div className="text-left">
          <div className="text-2xl font-bold text-white mb-1">
            {to}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">
            Arrivée
          </div>
        </div>

        {/* Price Section */}
        <div className="text-right border-l border-white/10 pl-6">
          {/* Original Price */}
          {originalPrice > price && (
            <div className="text-sm text-gray-500 line-through mb-1">
              {originalPrice}{getCurrencySymbol(currency)}
            </div>
          )}

          {/* Current Price */}
          <div className="text-3xl font-bold text-primary mb-1">
            {price}
            <span className="text-xl">{getCurrencySymbol(currency)}</span>
          </div>

          {/* CTA Hint */}
          <div className="text-xs text-gray-400 group-hover:text-primary transition-colors duration-200">
            Voir détails ↓
          </div>
        </div>
      </div>

      {/* Hover Gradient Border Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  )
}
