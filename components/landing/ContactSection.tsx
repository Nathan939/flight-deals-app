'use client';

import { useInViewport } from '@/hooks/useInViewport';

export default function ContactSection() {
  const { elementRef, isInViewport } = useInViewport({ threshold: 0.2, triggerOnce: true });

  return (
    <section ref={elementRef as React.RefObject<HTMLElement>} className="py-16 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-3xl relative z-10">
        <div className={`text-center transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a
            href="mailto:contact@flightdeals.com"
            className="text-lg text-gray-400 hover:text-primary transition-colors"
          >
            contact@flightdeals.com
          </a>
        </div>
      </div>
    </section>
  );
}
