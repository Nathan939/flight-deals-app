'use client'

interface FlightTicketCardProps {
  from: string
  to: string
  fromCity?: string
  toCity?: string
  price: number
  originalPrice?: number
  discount?: number
  currency?: string
  dates?: string
  airline?: string
  bookingUrl?: string
  flightNumber?: string
  departureTime?: string
  arrivalTime?: string
  duration?: string
  className?: string
}

export default function FlightTicketCard({
  from,
  to,
  fromCity,
  toCity,
  price,
  originalPrice,
  discount,
  currency = 'EUR',
  dates,
  airline,
  bookingUrl,
  flightNumber,
  departureTime,
  arrivalTime,
  duration,
  className = '',
}: FlightTicketCardProps) {
  const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency

  return (
    <div className={`relative group ${className}`}>
      {/* Discount Badge */}
      {discount && discount > 0 && (
        <div className="absolute -top-3 -right-3 z-10 bg-primary text-white font-bold px-4 py-1.5 rounded-full text-sm shadow-lg animate-scale-in">
          -{discount}%
        </div>
      )}

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-md border border-white/10 hover:border-primary/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20">
        {/* Perforation Effet */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px">
          <div className="h-full flex flex-col justify-around items-center">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-black/30" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-dashed divide-white/10">
          {/* Left Section - Flight Info */}
          <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-gray-400 font-mono mb-1">VOL / FLIGHT</div>
                {airline && (
                  <div className="text-sm font-bold text-white">{airline}</div>
                )}
                {flightNumber && (
                  <div className="text-xs text-gray-400 font-mono">{flightNumber}</div>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400 font-mono">CLASSE</div>
                <div className="text-sm font-bold text-white">ECO</div>
              </div>
            </div>

            {/* Route */}
            <div className="space-y-3">
              {/* Departure */}
              <div>
                <div className="text-xs text-gray-400 font-mono mb-1">DÉPART / FROM</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white font-mono">{from}</span>
                  {fromCity && (
                    <span className="text-sm text-gray-300">{fromCity}</span>
                  )}
                </div>
                {departureTime && (
                  <div className="text-sm text-gray-400 font-mono mt-1">{departureTime}</div>
                )}
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-secondary/50 to-secondary" />
                <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <div className="h-px flex-1 bg-gradient-to-r from-secondary to-secondary/50" />
              </div>

              {/* Arrival */}
              <div>
                <div className="text-xs text-gray-400 font-mono mb-1">ARRIVÉE / TO</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white font-mono">{to}</span>
                  {toCity && (
                    <span className="text-sm text-gray-300">{toCity}</span>
                  )}
                </div>
                {arrivalTime && (
                  <div className="text-sm text-gray-400 font-mono mt-1">{arrivalTime}</div>
                )}
              </div>
            </div>

            {/* Duration */}
            {duration && (
              <div>
                <div className="text-xs text-gray-400 font-mono">DURÉE / DURATION</div>
                <div className="text-sm font-bold text-white font-mono">{duration}</div>
              </div>
            )}

            {/* Dates */}
            {dates && (
              <div>
                <div className="text-xs text-gray-400 font-mono">DATE</div>
                <div className="text-sm text-white font-mono">{dates}</div>
              </div>
            )}
          </div>

          {/* Right Section - Price & CTA */}
          <div className="p-6 flex flex-col justify-between items-center text-center">
            {/* Barcode Decorative */}
            <div className="w-full mb-4">
              <div className="flex justify-center gap-px h-12">
                {[3, 2, 4, 1, 3, 2, 5, 3, 2, 4, 2, 3, 1, 4].map((height, i) => (
                  <div
                    key={i}
                    className="w-1 bg-white/20"
                    style={{ height: `${height * 20}%` }}
                  />
                ))}
              </div>
              <div className="text-[10px] text-gray-500 font-mono mt-1 tracking-widest">
                FLIGHT-{from}{to}-{Date.now().toString().slice(-6)}
              </div>
            </div>

            {/* Price Section */}
            <div className="flex-1 flex flex-col justify-center items-center space-y-3">
              <div>
                <div className="text-xs text-gray-400 font-mono mb-2">PRIX / PRICE</div>
                <div className="space-y-1">
                  <div className="text-4xl font-bold text-primary font-mono">
                    {price}{currencySymbol}
                  </div>
                  {originalPrice && originalPrice > price && (
                    <div className="text-lg text-gray-400 line-through font-mono">
                      {originalPrice}{currencySymbol}
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              {bookingUrl && (
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-primary/20 text-sm uppercase tracking-wide"
                >
                  Reserver
                </a>
              )}
            </div>

            {/* QR Code Placeholder */}
            <div className="mt-4">
              <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                <div className="grid grid-cols-3 gap-px">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-[8px] text-gray-500 font-mono mt-1">SCAN ME</div>
            </div>
          </div>
        </div>

        {/* Bottom Tear Line */}
        <div className="absolute bottom-4 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </div>
  )
}
