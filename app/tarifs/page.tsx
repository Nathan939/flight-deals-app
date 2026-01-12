import PricingSection from '@/components/landing/PricingSection'

export default function Tarifs() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4 text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Nos tarifs</h1>
        <p className="text-gray-300 text-xl max-w-2xl mx-auto">
          Choisissez le plan qui vous convient. Changez ou annulez à tout moment.
        </p>
      </div>

      <PricingSection />

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Questions fréquentes
        </h2>

        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">
              Puis-je changer de plan à tout moment?
            </h3>
            <p className="text-gray-300">
              Oui, absolument. Vous pouvez passer du plan gratuit au premium à
              tout moment, ou annuler votre abonnement premium sans frais.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">
              Y a-t-il un engagement?
            </h3>
            <p className="text-gray-300">
              Non, aucun engagement. Le plan premium est facturé mensuellement et
              vous pouvez annuler à tout moment.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">
              Quelle est la différence entre email et SMS?
            </h3>
            <p className="text-gray-300">
              Les alertes email sont envoyées 2 fois par semaine avec une sélection
              des meilleurs deals. Les alertes SMS sont instantanées : vous recevez
              un message dès qu'un deal exceptionnel est détecté, pour réserver
              avant tout le monde.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">
              Comment fonctionne le paiement?
            </h3>
            <p className="text-gray-300">
              Les paiements sont 100% sécurisés via Stripe. Nous n'avons jamais
              accès à vos informations bancaires. Vous recevrez une facture par
              email chaque mois.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">
              Les prix incluent-ils la réservation des vols?
            </h3>
            <p className="text-gray-300">
              Non, nous vous alertons uniquement sur les deals. Vous réservez
              ensuite directement auprès de la compagnie aérienne ou de l'agence
              de voyage de votre choix.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
