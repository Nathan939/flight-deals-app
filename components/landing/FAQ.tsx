'use client';

import { useState } from 'react';
import { useInViewport } from '@/hooks/useInViewport';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { elementRef, isInViewport } = useInViewport({ threshold: 0.1, triggerOnce: true });

  const faqs = [
    {
      question: 'Comment fonctionne le service ?',
      answer:
        'Vous vous inscrivez gratuitement, choisissez vos destinations préférées, et notre algorithme scanne des milliers de vols chaque jour. Dès qu\'un prix exceptionnel est détecté, vous recevez une alerte par email (gratuit) ou SMS (premium).',
    },
    {
      question: 'Quelle est la différence entre email et SMS ?',
      answer:
        'Les alertes email sont gratuites et illimitées. Les alertes SMS sont payantes (4,99€/mois ou 44,99€/an) mais vous permettent d\'être averti instantanément, même sans connexion internet, pour ne jamais rater un deal.',
    },
    {
      question: 'Combien de temps les deals restent-ils disponibles ?',
      answer:
        'Les deals peuvent disparaître en quelques heures, voire quelques minutes pour les erreurs tarifaires. C\'est pourquoi nous vous alertons immédiatement dès leur détection.',
    },
    {
      question: 'Puis-je choisir mes destinations ?',
      answer:
        'Oui, vous pouvez sélectionner vos destinations préférées ou suivre toutes les destinations pour ne rien manquer. Vous pouvez modifier vos préférences à tout moment depuis votre tableau de bord.',
    },
    {
      question: 'Y a-t-il un engagement ?',
      answer:
        'Aucun engagement. Le plan gratuit reste gratuit pour toujours. Pour le plan SMS, vous pouvez annuler à tout moment sans frais supplémentaires.',
    },
    {
      question: 'Comment puis-je réserver un vol après avoir reçu une alerte ?',
      answer:
        'Chaque alerte contient un lien direct vers le site de réservation. Nous ne prenons aucune commission, vous réservez directement auprès de la compagnie aérienne ou de l\'agence de voyage.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={elementRef as React.RefObject<HTMLElement>} className="py-14 px-4 relative">
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className={`text-center mb-8 transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="heading-md mb-3">
            Questions fréquentes
          </h2>
          <p className="subtitle">
            Tout ce que vous devez savoir sur FlightDeals
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`glass-card !p-0 overflow-hidden transition-all duration-500 ${isInViewport ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
              >
                <span className="font-bold text-lg pr-4">{faq.question}</span>
                <span className="text-primary text-2xl flex-shrink-0 transition-transform duration-300" style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-300 animate-fadeIn">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
