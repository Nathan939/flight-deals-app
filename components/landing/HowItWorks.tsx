'use client';

import { useInViewport } from '@/hooks/useInViewport';

export default function HowItWorks() {
  const { elementRef, isInViewport } = useInViewport({ threshold: 0.2, triggerOnce: true });

  const steps = [
    {
      number: '1',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: 'Inscrivez-vous gratuitement',
      description:
        'Creez votre compte en 30 secondes. Choisissez vos destinations preferees ou suivez le monde entier.',
    },
    {
      number: '2',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Nous trouvons les deals',
      description:
        'Nous scannons les meilleures offres de vols pour denicher les meilleurs prix et erreurs tarifaires.',
    },
    {
      number: '3',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: 'Recevez les alertes',
      description:
        'Nous vous envoyons par mail les meilleurs deals des qu\'on en trouve !',
    },
  ]

  const reviews = [
    {
      name: 'Marie L.',
      location: 'Paris',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 5,
      text: 'J\'ai economise plus de 400€ sur mon vol pour Bangkok ! Le deal est arrive dans ma boite mail et j\'ai reserve dans la foulee. Incroyable service.',
    },
    {
      name: 'Thomas D.',
      location: 'Lyon',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5,
      text: 'Grace a FlightAlert, j\'ai pu partir a New York pour 280€ A/R au lieu de 650€. Je recommande a tous les voyageurs !',
    },
    {
      name: 'Sophie M.',
      location: 'Bordeaux',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      rating: 5,
      text: 'En 6 mois, j\'ai fait 3 voyages grace aux deals recus. Marrakech, Lisbonne et Rome pour moins de 200€ au total. Merci FlightAlert !',
    },
  ]

  return (
    <section ref={elementRef as React.RefObject<HTMLElement>} className="py-16 px-4 relative">
      {/* Reviews Section - First */}
      <div className={`container mx-auto max-w-6xl relative z-10 mb-20 transition-all duration-700 ${isInViewport ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <h2 className="heading-md text-center mb-8">Ce que disent nos membres</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="glass-card hover-lift"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Header with avatar */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                />
                <div>
                  <div className="font-bold">{review.name}</div>
                  <div className="text-sm text-gray-400">{review.location}</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-300 text-sm leading-relaxed">"{review.text}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works Section - Second */}
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
          <h2 className="heading-md mb-4">
            Comment ca marche ?
          </h2>
          <p className="text-gray-300 text-xl leading-relaxed max-w-2xl mx-auto">
            3 etapes simples pour ne plus jamais rater un bon plan
          </p>
        </div>

        {/* Steps without timeline */}
        <div className="relative max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative text-center transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${400 + index * 200}ms` }}
              >
                {/* Number badge with icon */}
                <div className="relative inline-block mb-6">
                  <div className="glass-card w-24 h-24 flex items-center justify-center mx-auto hover-lift hover-glow border-2 border-primary/30">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/50">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className={`mt-12 text-center transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '1000ms' }}>
          <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-full px-6 py-3">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-300">
              <span className="font-bold text-primary">Astuce :</span> Les prix peuvent tres vite varier, reservez avant qu'il ne disparaisse !
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
