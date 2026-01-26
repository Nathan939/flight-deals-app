'use client';

import { DealData } from '@/lib/types'
import DecryptedNumber from '@/components/ui/DecryptedNumber'
import { useInViewport } from '@/hooks/useInViewport'
import { useRouter } from 'next/navigation'

interface DealCardProps {
  deal: DealData
  publishedAgo?: string
}

export default function DealCard({ deal, publishedAgo }: DealCardProps) {
  const { elementRef, isInViewport } = useInViewport({ threshold: 0.2, triggerOnce: true });
  const router = useRouter();

  const handleClick = () => {
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/historique');
    } else {
      router.push('/signup');
    }
  };

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className="glass-card flex flex-col md:flex-row md:items-center gap-4 md:gap-6 group transition-all duration-300 hover:translate-y-[-3px] hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40"
    >
      {/* LEFT: PRIX - Élément dominant */}
      <div className="flex-shrink-0 md:min-w-[180px]">
        <div className="flex items-baseline gap-3">
          {/* Prix principal - glow effect on hover */}
          <div className="text-5xl md:text-6xl font-black text-primary font-mono tracking-tight group-hover:drop-shadow-[0_0_15px_rgba(255,107,53,0.4)] transition-all duration-300">
            <DecryptedNumber
              value={deal.price}
              className="text-5xl md:text-6xl font-black text-primary font-mono"
              duration={1200}
              isInViewport={isInViewport}
            />
            <span className="text-4xl md:text-5xl">€</span>
          </div>
          {/* Ancien prix aligné en bas */}
          <span className="text-base text-gray-500/60 line-through font-mono">
            {deal.originalPrice}€
          </span>
        </div>
      </div>

      {/* Séparateur vertical */}
      <div className="hidden md:block w-px h-16 bg-white/10" />

      {/* CENTER: DESTINATION + Détails */}
      <div className="flex-grow">
        {/* Destination - mise en avant */}
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight">
          <DecryptedNumber
            value={deal.to}
            className="text-2xl md:text-3xl font-bold text-white"
            duration={1000}
            isInViewport={isInViewport}
          />
        </h3>
        {/* Détails compacts */}
        <p className="text-gray-400 text-sm">
          Depuis {deal.from} • A/R • {deal.dates}
        </p>
      </div>

      {/* RIGHT: CTA */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <button
          onClick={handleClick}
          className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary/30 uppercase tracking-wide text-sm cursor-pointer"
        >
          Voir le deal
        </button>
        {publishedAgo && (
          <p className="text-[10px] text-gray-600 mt-1.5">Publié {publishedAgo}</p>
        )}
      </div>
    </div>
  )
}
