export default function MentionsLegales() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Mentions légales</h1>

      <div className="space-y-6 text-gray-300">
        <section>
          <h2 className="text-2xl font-bold text-white mb-3">Éditeur du site</h2>
          <p>
            Raison sociale: FlightDeals<br />
            Adresse: [Votre adresse]<br />
            Email: contact@flightdeals.com<br />
            Téléphone: [Votre téléphone]
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">Hébergement</h2>
          <p>
            Ce site est hébergé par:<br />
            [Nom de l'hébergeur]<br />
            [Adresse de l'hébergeur]
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">Propriété intellectuelle</h2>
          <p>
            L'ensemble de ce site relève de la législation française et internationale
            sur le droit d'auteur et la propriété intellectuelle. Tous les droits de
            reproduction sont réservés.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">Responsabilité</h2>
          <p>
            FlightDeals ne peut être tenu responsable des erreurs ou omissions dans les
            informations fournies. Les tarifs des vols sont donnés à titre indicatif et
            peuvent varier.
          </p>
        </section>
      </div>
    </div>
  )
}
