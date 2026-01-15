export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="container mx-auto max-w-4xl">
        <h1 className="heading-lg mb-8">Politique de Confidentialité</h1>

        <div className="glass-card space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">1. Collecte des données</h2>
            <p className="mb-4">
              FlightAlert collecte les données personnelles suivantes dans le cadre de ses services :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Adresse email (obligatoire pour la création de compte)</li>
              <li>Nom et prénom (optionnel)</li>
              <li>Numéro de téléphone (uniquement pour les utilisateurs Premium souhaitant recevoir des SMS)</li>
              <li>Destinations favorites et préférences de voyage</li>
              <li>Historique des deals consultés</li>
              <li>Données de navigation (cookies, adresse IP, navigateur)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">2. Utilisation des données</h2>
            <p className="mb-4">Vos données personnelles sont utilisées pour :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Créer et gérer votre compte utilisateur</li>
              <li>Vous envoyer des alertes de deals de vols correspondant à vos préférences</li>
              <li>Personnaliser votre expérience sur notre plateforme</li>
              <li>Gérer vos abonnements et paiements (via Stripe)</li>
              <li>Améliorer nos services et développer de nouvelles fonctionnalités</li>
              <li>Vous contacter pour des questions relatives au service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">3. Base légale du traitement</h2>
            <p>
              Le traitement de vos données personnelles est fondé sur :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li><strong>Votre consentement</strong> : pour l'envoi de newsletters et d'alertes personnalisées</li>
              <li><strong>L'exécution du contrat</strong> : pour la gestion de votre compte et de votre abonnement</li>
              <li><strong>Notre intérêt légitime</strong> : pour améliorer nos services et assurer la sécurité de la plateforme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">4. Partage des données</h2>
            <p className="mb-4">
              Nous ne vendons jamais vos données personnelles. Vos données peuvent être partagées avec :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Stripe</strong> : pour le traitement sécurisé des paiements</li>
              <li><strong>Brevo (Sendinblue)</strong> : pour l'envoi d'emails</li>
              <li><strong>Twilio</strong> : pour l'envoi de SMS (utilisateurs Premium uniquement)</li>
              <li><strong>Kiwi.com</strong> : pour la recherche de vols (données anonymisées)</li>
              <li><strong>Vercel</strong> : hébergement de l'application</li>
            </ul>
            <p className="mt-4">
              Ces prestataires sont situés dans l'Union Européenne ou respectent le RGPD.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">5. Durée de conservation</h2>
            <p className="mb-4">Nous conservons vos données personnelles :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Pendant toute la durée de votre compte actif</li>
              <li>3 ans après votre dernière activité (compte inactif)</li>
              <li>Les données de paiement sont conservées selon les obligations légales (10 ans)</li>
              <li>Les logs de connexion sont conservés 1 an maximum</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">6. Vos droits (RGPD)</h2>
            <p className="mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Droit d'accès</strong> : obtenir une copie de vos données personnelles</li>
              <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
              <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
              <li><strong>Droit à la limitation</strong> : limiter le traitement de vos données</li>
              <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
              <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
              <li><strong>Droit de retrait du consentement</strong> : retirer votre consentement à tout moment</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à : <strong className="text-primary">contact@flightalert.fr</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">7. Sécurité des données</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>Chiffrement des mots de passe (bcrypt)</li>
              <li>Connexions sécurisées HTTPS</li>
              <li>Serveurs sécurisés et sauvegardés régulièrement</li>
              <li>Accès limité aux données personnelles</li>
              <li>Audits de sécurité réguliers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">8. Cookies</h2>
            <p className="mb-4">
              Notre site utilise des cookies pour améliorer votre expérience :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Cookies essentiels</strong> : nécessaires au fonctionnement du site (session, authentification)</li>
              <li><strong>Cookies analytiques</strong> : pour comprendre l'utilisation du site (optionnel)</li>
            </ul>
            <p className="mt-4">
              Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">9. Modifications</h2>
            <p>
              Cette politique de confidentialité peut être modifiée. Nous vous informerons par email
              de tout changement important.
            </p>
            <p className="mt-4">
              <strong>Dernière mise à jour :</strong> 15 janvier 2026
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">10. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou vos données personnelles :
            </p>
            <p className="mt-4">
              <strong>Email :</strong> <span className="text-primary">contact@flightalert.fr</span><br />
              <strong>Responsable du traitement :</strong> FlightAlert
            </p>
            <p className="mt-4">
              Vous pouvez également déposer une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés).
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
