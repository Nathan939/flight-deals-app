import Link from 'next/link'

export default function CommentCaMarche() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-5xl font-bold mb-8 text-center">
        Comment ça marche?
      </h1>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
              1
            </div>
            <h2 className="text-3xl font-bold">Inscription gratuite</h2>
          </div>
          <p className="text-gray-300 text-lg ml-16">
            Créez votre compte en quelques secondes. Aucune carte bancaire n'est
            requise pour le plan gratuit. Choisissez vos destinations préférées
            parmi plus de 200 destinations dans le monde, ou suivez simplement
            toutes les destinations pour ne rien manquer.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
              2
            </div>
            <h2 className="text-3xl font-bold">Nous trouvons les deals</h2>
          </div>
          <p className="text-gray-300 text-lg ml-16">
            Notre algorithme puissant scanne automatiquement des milliers de vols
            chaque jour sur des centaines de compagnies aériennes. Nous détectons
            les erreurs tarifaires, les promotions éclair et les prix anormalement
            bas avant qu'ils ne disparaissent.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
              3
            </div>
            <h2 className="text-3xl font-bold">Recevez les alertes</h2>
          </div>
          <p className="text-gray-300 text-lg ml-16 mb-4">
            Dès qu'un deal correspond à vos critères, vous êtes immédiatement
            averti:
          </p>
          <ul className="text-gray-300 text-lg ml-16 space-y-2">
            <li>
              <span className="text-primary font-bold">Plan gratuit:</span> Alertes
              par email 2 fois par semaine
            </li>
            <li>
              <span className="text-primary font-bold">Plan premium SMS:</span>{' '}
              Alertes instantanées par SMS dès la détection du deal
            </li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
              4
            </div>
            <h2 className="text-3xl font-bold">Réservez rapidement</h2>
          </div>
          <p className="text-gray-300 text-lg ml-16">
            Les meilleurs deals partent en quelques heures, parfois quelques
            minutes. Grâce à nos alertes rapides, vous avez une longueur d'avance
            et pouvez réserver avant que le prix ne remonte ou que les places ne
            soient épuisées.
          </p>
        </section>
      </div>

      <div className="mt-16 bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">
          Prêt à ne plus jamais payer le prix fort?
        </h3>
        <p className="text-gray-300 mb-6">
          Rejoignez des milliers de voyageurs malins
        </p>
        <Link
          href="/signup"
          className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-all duration-200"
        >
          Commencer gratuitement
        </Link>
      </div>
    </div>
  )
}
