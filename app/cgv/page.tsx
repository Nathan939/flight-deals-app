export default function CGV() {
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="container mx-auto max-w-4xl">
        <h1 className="heading-lg mb-8">Conditions Générales de Vente (CGV)</h1>

        <div className="glass-card space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">1. Objet</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent l'utilisation des services
              proposés par FlightAlert, accessible à l'adresse <strong>www.flightalert.fr</strong>.
            </p>
            <p className="mt-4">
              FlightAlert est un service d'alertes de deals de vols proposant deux formules :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li><strong>Formule Gratuite</strong> : alertes par email uniquement</li>
              <li><strong>Formule Premium</strong> : alertes par email et SMS, tarif de 4,99€/mois, 11,99€/trimestre ou 44,99€/an</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">2. Acceptation des CGV</h2>
            <p>
              L'utilisation des services de FlightAlert implique l'acceptation pleine et entière des présentes CGV.
              En créant un compte, vous reconnaissez avoir pris connaissance et accepté ces conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">3. Inscription et compte utilisateur</h2>
            <p className="mb-4">
              Pour accéder aux services, vous devez créer un compte en fournissant :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Une adresse email valide</li>
              <li>Un mot de passe sécurisé</li>
              <li>Un numéro de téléphone (pour l'offre Premium uniquement)</li>
            </ul>
            <p className="mt-4">
              Vous êtes responsable de la confidentialité de vos identifiants de connexion.
              Toute utilisation de votre compte est présumée être effectuée par vous.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">4. Services proposés</h2>

            <h3 className="text-xl font-semibold mb-3 text-white mt-6">4.1 Formule Gratuite</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Alertes de deals de vols par email</li>
              <li>Jusqu'à 5 destinations favorites</li>
              <li>Accès aux deals du jour</li>
              <li>Historique des deals envoyés</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white mt-6">4.2 Formule Premium (4,99€/mois, 11,99€/trimestre ou 44,99€/an)</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Tous les avantages de la formule gratuite</li>
              <li>Alertes par SMS en temps réel</li>
              <li>Destinations illimitées</li>
              <li>Alertes prioritaires (avant les utilisateurs gratuits)</li>
              <li>Support client prioritaire</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">5. Tarifs et paiement</h2>
            <p className="mb-4">
              Les tarifs de l'abonnement Premium sont les suivants :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Mensuel</strong> : 4,99€ TTC par mois</li>
              <li><strong>Trimestriel</strong> : 11,99€ TTC par trimestre</li>
              <li><strong>Annuel</strong> : 44,99€ TTC par an</li>
            </ul>
            <p className="mt-4">
              Les paiements sont effectués de manière sécurisée via Stripe. Les moyens de paiement acceptés
              sont : carte bancaire (Visa, Mastercard, American Express).
            </p>
            <p className="mt-4">
              Le paiement est effectué par prélèvement automatique à la date anniversaire de votre souscription.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">6. Renouvellement et résiliation</h2>
            <p className="mb-4">
              L'abonnement Premium est renouvelé automatiquement à chaque échéance (mensuelle ou annuelle)
              sauf résiliation de votre part.
            </p>
            <p className="mt-4">
              Vous pouvez résilier votre abonnement à tout moment depuis votre espace personnel.
              La résiliation prendra effet à la fin de la période en cours, sans remboursement au prorata.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">7. Droit de rétractation</h2>
            <p>
              Conformément au droit européen, vous disposez d'un délai de 14 jours à compter de la
              souscription pour exercer votre droit de rétractation et obtenir un remboursement intégral.
            </p>
            <p className="mt-4">
              Pour exercer ce droit, contactez-nous à : <strong className="text-primary">contact@flightalert.fr</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">8. Nature du service</h2>
            <p className="mb-4">
              FlightAlert est un service d'<strong>agrégation et d'alerte</strong> de deals de vols.
              Nous ne sommes pas une agence de voyage et ne vendons pas de billets d'avion.
            </p>
            <p className="mt-4">
              Les deals proposés proviennent de sources externes (Kiwi.com, compagnies aériennes, etc.).
              FlightAlert ne garantit pas :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>La disponibilité des vols au moment de la réservation</li>
              <li>L'exactitude absolue des prix affichés</li>
              <li>La validité des offres après leur publication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">9. Responsabilité</h2>
            <p className="mb-4">
              FlightAlert s'efforce de fournir des informations exactes et à jour, mais ne peut être
              tenu responsable de :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Modifications de prix ou d'offres par les compagnies aériennes</li>
              <li>Indisponibilité temporaire du service</li>
              <li>Erreurs ou omissions dans les informations fournies</li>
              <li>Problèmes lors de la réservation sur les sites tiers</li>
              <li>Non-réception d'emails/SMS due à des problèmes techniques hors de notre contrôle</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">10. Propriété intellectuelle</h2>
            <p>
              Tous les contenus du site FlightAlert (textes, images, logos, design) sont protégés
              par le droit d'auteur et sont la propriété exclusive de FlightAlert.
            </p>
            <p className="mt-4">
              Toute reproduction, distribution ou utilisation non autorisée est strictement interdite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">11. Modifications des CGV</h2>
            <p>
              FlightAlert se réserve le droit de modifier les présentes CGV à tout moment.
              Les utilisateurs seront informés par email de toute modification substantielle.
            </p>
            <p className="mt-4">
              La poursuite de l'utilisation du service après modification vaut acceptation des nouvelles CGV.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">12. Protection des données</h2>
            <p>
              Vos données personnelles sont traitées conformément à notre{' '}
              <a href="/politique-confidentialite" className="text-primary hover:underline">
                Politique de Confidentialité
              </a>{' '}
              et au Règlement Général sur la Protection des Données (RGPD).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">13. Droit applicable et juridiction</h2>
            <p>
              Les présentes CGV sont soumises au droit français. En cas de litige, et après tentative
              de résolution amiable, les tribunaux français seront seuls compétents.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">14. Contact</h2>
            <p>
              Pour toute question concernant ces CGV :
            </p>
            <p className="mt-4">
              <strong>Email :</strong> <span className="text-primary">contact@flightalert.fr</span><br />
              <strong>Site web :</strong> www.flightalert.fr
            </p>
            <p className="mt-4">
              <strong>Dernière mise à jour :</strong> 15 janvier 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
