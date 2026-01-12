'use client';

import { useInViewport } from '@/hooks/useInViewport';
import Badge from '@/components/ui/Badge';

export default function ContactSection() {
  const { elementRef, isInViewport } = useInViewport({ threshold: 0.2, triggerOnce: true });

  return (
    <section ref={elementRef as React.RefObject<HTMLElement>} className="py-32 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/10 to-black" />

      <div className="container mx-auto max-w-3xl relative z-10">
        <div className={`text-center transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Badge variant="primary" className="mb-6">
            📧 Contact
          </Badge>
          <h2 className="heading-lg mb-6">
            Une question ?
          </h2>
          <p className="text-gray-300 text-xl leading-relaxed mb-12">
            Notre équipe vous répond sous 24h
          </p>

          {/* Contact card with glassmorphism */}
          <div className="glass-card p-12 max-w-xl mx-auto">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <p className="text-gray-400 text-lg mb-3">
              Vous préférez nous écrire directement ?
            </p>

            <a
              href="mailto:contact@flightdeals.com"
              className="inline-block text-2xl md:text-3xl font-bold text-primary hover:text-primary-light transition-colors mb-4"
            >
              contact@flightdeals.com
            </a>

            <p className="text-gray-500 text-sm">
              Nous répondons généralement en moins de 24 heures
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
