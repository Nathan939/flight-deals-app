import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { ToastProvider } from '@/components/ui/Toast'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'FlightDeals - Alertes de vols pas chers',
  description: 'Recevez les meilleurs deals de vols avant tout le monde. Alertes email gratuites ou SMS premium.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <body className={jetbrainsMono.className}>
        <ToastProvider>
          <Header />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  )
}
