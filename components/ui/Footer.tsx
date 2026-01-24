import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-primary font-bold text-xl mb-4">FlightAlert</h3>
            <p className="text-gray-400 text-sm">
              Les meilleurs deals de vols avant tout le monde
            </p>
            <p className="text-gray-500 text-xs mt-4">
              Conformite RGPD<br />
              Données hébergées en Europe
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Navigation</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/recherche" className="hover:text-primary transition-colors">
                  Rechercher des vols
                </Link>
              </li>
              <li>
                <Link href="/comment-ca-marche" className="hover:text-primary transition-colors">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link href="/tarifs" className="hover:text-primary transition-colors">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Légal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/mentions-legales" className="hover:text-primary transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="hover:text-primary transition-colors">
                  Conditions Générales de Vente
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="hover:text-primary transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/rgpd" className="hover:text-primary transition-colors">
                  RGPD
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <a
              href="mailto:contact@flightdeals.com"
              className="text-gray-400 text-sm hover:text-primary transition-colors"
            >
              contact@flightdeals.com
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} FlightAlert. Tous droits réservés.</p>
          <p className="text-xs text-gray-500 mt-2">
            FlightAlert est un service d'agrégation de deals de vols. Nous ne vendons pas de billets d'avion.
          </p>
        </div>
      </div>
    </footer>
  )
}
