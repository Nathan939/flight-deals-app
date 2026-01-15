export default function MentionsLegales() {
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="container mx-auto max-w-4xl">
        <h1 className="heading-lg mb-8">Mentions Légales</h1>

        <div className="glass-card space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">1. Éditeur du site</h2>
            <p>
              <strong>Raison sociale :</strong> FlightAlert<br />
              <strong>Forme juridique :</strong> [À compléter - ex: SARL, SAS, EI, etc.]<br />
              <strong>Capital social :</strong> [À compléter]<br />
              <strong>SIRET :</strong> [À compléter lors de l'immatriculation]<br />
              <strong>Adresse du siège social :</strong> [À compléter avec votre adresse]<br />
              <strong>Email :</strong> <span className="text-primary">contact@flightalert.fr</span><br />
              <strong>Téléphone :</strong> [À compléter]<br />
              <strong>Directeur de la publication :</strong> [Votre nom]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">2. Hébergement</h2>
            <p>
              Ce site est hébergé par :<br />
              <strong>Vercel Inc.</strong><br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789, USA<br />
              Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">vercel.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">3. Propriété intellectuelle</h2>
            <p className="mb-4">
              L'ensemble de ce site (structure, textes, logos, images, vidéos, icônes, sons, logiciels)
              relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.
            </p>
            <p className="mt-4">
              Tous les droits de reproduction et de représentation sont réservés à FlightAlert.
              Toute reproduction, distribution, modification, adaptation, retransmission ou publication
              de ces différents éléments est strictement interdite sans l'accord écrit de FlightAlert.
            </p>
            <p className="mt-4">
              Le non-respect de cette interdiction constitue une contrefaçon pouvant engager
              la responsabilité civile et pénale du contrefacteur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">4. Données personnelles</h2>
            <p>
              Le site FlightAlert respecte la vie privée de l'utilisateur et se conforme strictement
              aux lois en vigueur sur la protection de la vie privée et des libertés individuelles,
              notamment le Règlement Général sur la Protection des Données (RGPD).
            </p>
            <p className="mt-4">
              Pour plus d'informations, consultez notre{' '}
              <a href="/politique-confidentialite" className="text-primary hover:underline">
                Politique de Confidentialité
              </a>.
            </p>
            <p className="mt-4">
              <strong>Responsable du traitement des données :</strong> FlightAlert<br />
              <strong>Contact DPO :</strong> <span className="text-primary">dpo@flightalert.fr</span>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">5. Cookies</h2>
            <p>
              Le site FlightAlert peut collecter des informations sur la navigation des visiteurs
              par l'intermédiaire de cookies. Ces cookies sont utilisés pour :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>Gérer l'authentification et la session utilisateur</li>
              <li>Mémoriser vos préférences</li>
              <li>Analyser le trafic et améliorer le service</li>
            </ul>
            <p className="mt-4">
              Vous pouvez désactiver les cookies dans les paramètres de votre navigateur,
              mais certaines fonctionnalités du site pourraient être limitées.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">6. Responsabilité</h2>
            <p className="mb-4">
              FlightAlert met tout en œuvre pour offrir aux utilisateurs des informations fiables et vérifiées.
              Toutefois, FlightAlert ne peut être tenu responsable :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Des erreurs ou omissions dans les informations fournies</li>
              <li>De l'indisponibilité temporaire ou totale du site</li>
              <li>Des dommages directs ou indirects résultant de l'utilisation du site</li>
              <li>Des modifications de prix ou de disponibilité des vols proposés par les compagnies aériennes</li>
              <li>Des problèmes techniques indépendants de notre volonté</li>
            </ul>
            <p className="mt-4">
              Les tarifs des vols affichés sont donnés à titre indicatif et peuvent varier.
              FlightAlert n'est pas une agence de voyage et ne vend pas de billets d'avion directement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">7. Liens hypertextes</h2>
            <p>
              Le site FlightAlert peut contenir des liens vers d'autres sites (compagnies aériennes,
              agences de voyage, partenaires). FlightAlert n'exerce aucun contrôle sur ces sites
              et décline toute responsabilité quant à leur contenu, leur disponibilité ou leur politique
              de confidentialité.
            </p>
            <p className="mt-4">
              La création de liens hypertextes vers le site FlightAlert est autorisée sous réserve
              d'en faire la demande préalable à : <span className="text-primary">contact@flightalert.fr</span>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">8. Crédits</h2>
            <p>
              <strong>Conception et développement :</strong> FlightAlert<br />
              <strong>Technologies utilisées :</strong> Next.js, React, TypeScript, Tailwind CSS<br />
              <strong>APIs partenaires :</strong> Kiwi.com (recherche de vols), Stripe (paiements),
              Brevo (emails), Twilio (SMS)
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">9. Loi applicable</h2>
            <p>
              Les présentes mentions légales sont régies par la loi française. Tout litige relatif
              à l'utilisation du site FlightAlert sera soumis aux tribunaux français compétents.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">10. Contact</h2>
            <p>
              Pour toute question concernant ces mentions légales ou le site FlightAlert :
            </p>
            <p className="mt-4">
              <strong>Email :</strong> <span className="text-primary">contact@flightalert.fr</span><br />
              <strong>Site web :</strong> <a href="https://www.flightalert.fr" className="text-primary hover:underline">www.flightalert.fr</a>
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
