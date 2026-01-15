export default function RGPD() {
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="container mx-auto max-w-4xl">
        <h1 className="heading-lg mb-8">Conformité RGPD</h1>

        <div className="glass-card space-y-6 text-gray-300">
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mb-6">
            <p className="text-white font-semibold mb-2">
              FlightAlert est pleinement conforme au Règlement Général sur la Protection des Données (RGPD)
            </p>
            <p className="text-sm">
              Nous nous engageons à protéger vos données personnelles et à respecter vos droits en matière de vie privée.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données est <strong>FlightAlert</strong>.
            </p>
            <p className="mt-4">
              <strong>Contact DPO (Délégué à la Protection des Données) :</strong><br />
              Email : <span className="text-primary">dpo@flightalert.fr</span>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">2. Données collectées et finalités</h2>

            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="border border-white/10 p-3 text-left">Donnée collectée</th>
                    <th className="border border-white/10 p-3 text-left">Finalité</th>
                    <th className="border border-white/10 p-3 text-left">Base légale</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-white/10 p-3">Email</td>
                    <td className="border border-white/10 p-3">Authentification, alertes de deals</td>
                    <td className="border border-white/10 p-3">Exécution du contrat</td>
                  </tr>
                  <tr>
                    <td className="border border-white/10 p-3">Mot de passe (haché)</td>
                    <td className="border border-white/10 p-3">Sécurité du compte</td>
                    <td className="border border-white/10 p-3">Exécution du contrat</td>
                  </tr>
                  <tr>
                    <td className="border border-white/10 p-3">Nom, prénom</td>
                    <td className="border border-white/10 p-3">Personnalisation</td>
                    <td className="border border-white/10 p-3">Consentement</td>
                  </tr>
                  <tr>
                    <td className="border border-white/10 p-3">Téléphone</td>
                    <td className="border border-white/10 p-3">Alertes SMS (Premium)</td>
                    <td className="border border-white/10 p-3">Exécution du contrat</td>
                  </tr>
                  <tr>
                    <td className="border border-white/10 p-3">Destinations favorites</td>
                    <td className="border border-white/10 p-3">Envoi d'alertes ciblées</td>
                    <td className="border border-white/10 p-3">Exécution du contrat</td>
                  </tr>
                  <tr>
                    <td className="border border-white/10 p-3">Historique de navigation</td>
                    <td className="border border-white/10 p-3">Amélioration du service</td>
                    <td className="border border-white/10 p-3">Intérêt légitime</td>
                  </tr>
                  <tr>
                    <td className="border border-white/10 p-3">Données de paiement</td>
                    <td className="border border-white/10 p-3">Gestion abonnement</td>
                    <td className="border border-white/10 p-3">Exécution du contrat</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">3. Vos droits RGPD</h2>
            <p className="mb-4">
              Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
            </p>

            <div className="space-y-4 mt-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-bold text-white mb-2">✅ Droit d'accès (Article 15)</h3>
                <p className="text-sm">
                  Vous pouvez obtenir une copie de toutes vos données personnelles que nous détenons.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-bold text-white mb-2">✏️ Droit de rectification (Article 16)</h3>
                <p className="text-sm">
                  Vous pouvez corriger vos données personnelles si elles sont inexactes ou incomplètes.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-bold text-white mb-2">🗑️ Droit à l'effacement (Article 17)</h3>
                <p className="text-sm">
                  Vous pouvez demander la suppression de vos données personnelles ("droit à l'oubli").
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-bold text-white mb-2">⏸️ Droit à la limitation du traitement (Article 18)</h3>
                <p className="text-sm">
                  Vous pouvez demander la limitation du traitement de vos données dans certaines circonstances.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-bold text-white mb-2">📦 Droit à la portabilité (Article 20)</h3>
                <p className="text-sm">
                  Vous pouvez recevoir vos données dans un format structuré et les transmettre à un autre responsable.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-bold text-white mb-2">🚫 Droit d'opposition (Article 21)</h3>
                <p className="text-sm">
                  Vous pouvez vous opposer au traitement de vos données pour des raisons tenant à votre situation particulière.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-bold text-white mb-2">🔄 Droit de retrait du consentement (Article 7)</h3>
                <p className="text-sm">
                  Vous pouvez retirer votre consentement à tout moment pour les traitements basés sur celui-ci.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">4. Comment exercer vos droits ?</h2>
            <p className="mb-4">
              Pour exercer l'un de ces droits, vous pouvez :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Nous contacter par email : <strong className="text-primary">dpo@flightalert.fr</strong></li>
              <li>Accéder à votre espace personnel pour modifier vos données</li>
              <li>Nous envoyer un courrier postal à l'adresse indiquée dans les mentions légales</li>
            </ul>
            <p className="mt-4">
              Nous nous engageons à répondre à votre demande dans un délai maximum de <strong>1 mois</strong>.
              En cas de complexité, ce délai peut être prolongé de 2 mois supplémentaires.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">5. Durée de conservation</h2>
            <p className="mb-4">Vos données sont conservées pour les durées suivantes :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Compte actif :</strong> Pendant toute la durée d'utilisation du service</li>
              <li><strong>Compte inactif :</strong> 3 ans après votre dernière connexion</li>
              <li><strong>Données de paiement :</strong> 10 ans (obligation légale comptable)</li>
              <li><strong>Logs de connexion :</strong> 1 an maximum</li>
              <li><strong>Cookies :</strong> 13 mois maximum</li>
            </ul>
            <p className="mt-4">
              Après ces délais, vos données sont automatiquement supprimées ou anonymisées.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">6. Sécurité des données</h2>
            <p className="mb-4">
              Nous mettons en place des mesures techniques et organisationnelles pour assurer la sécurité de vos données :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Chiffrement des mots de passe avec bcrypt</li>
              <li>Connexion HTTPS avec certificat SSL/TLS</li>
              <li>Hébergement sécurisé chez Vercel (certification ISO 27001)</li>
              <li>Sauvegardes régulières des données</li>
              <li>Accès limité et contrôlé aux données personnelles</li>
              <li>Surveillance et détection des incidents de sécurité</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">7. Transferts de données hors UE</h2>
            <p className="mb-4">
              Certains de nos prestataires sont situés hors de l'Union Européenne :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Vercel (USA) :</strong> Clauses contractuelles types approuvées par la Commission Européenne</li>
              <li><strong>Stripe (USA) :</strong> Certification Privacy Shield et clauses contractuelles types</li>
            </ul>
            <p className="mt-4">
              Ces transferts sont encadrés par des garanties appropriées conformément au RGPD.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">8. Réclamation auprès de la CNIL</h2>
            <p className="mb-4">
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation
              auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) :
            </p>
            <div className="bg-white/5 p-4 rounded-lg">
              <p>
                <strong>CNIL</strong><br />
                3 Place de Fontenoy<br />
                TSA 80715<br />
                75334 PARIS CEDEX 07<br />
                Téléphone : 01 53 73 22 22<br />
                Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">9. Mises à jour de cette politique</h2>
            <p>
              Cette politique RGPD peut être mise à jour pour refléter les évolutions de nos pratiques
              ou de la réglementation. Nous vous informerons par email de toute modification substantielle.
            </p>
            <p className="mt-4">
              <strong>Dernière mise à jour :</strong> 15 janvier 2026
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">10. Contact</h2>
            <p>
              Pour toute question relative à la protection de vos données personnelles :
            </p>
            <p className="mt-4">
              <strong>Délégué à la Protection des Données (DPO) :</strong><br />
              Email : <span className="text-primary">dpo@flightalert.fr</span><br />
              Email général : <span className="text-primary">contact@flightalert.fr</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
