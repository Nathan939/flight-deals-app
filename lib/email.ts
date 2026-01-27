import { Resend } from 'resend'
import { DealData } from './types'

// Resend pour l'envoi d'emails - simple et efficace
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const isConfigured = !!process.env.RESEND_API_KEY

// Email par défaut de Resend (pas besoin de domaine vérifié)
const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev'
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'Les Vols de Sylvain'

export async function sendDealEmail(
  to: string,
  deal: DealData,
  userName?: string
): Promise<{ success: boolean; error?: string }> {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #000000; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="text-align: center; padding: 30px 0;">
          <h1 style="color: #DC2626; font-size: 32px; margin: 0;">✈️ Nouveau Deal Détecté!</h1>
        </div>

        <!-- Main Content -->
        <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 30px; margin: 20px 0;">
          <p style="color: #E5E7EB; font-size: 16px; margin-bottom: 20px;">
            Bonjour ${userName || 'voyageur'} 👋
          </p>
          <p style="color: #D1D5DB; font-size: 14px; margin-bottom: 30px;">
            Nous avons trouvé un excellent deal pour vous :
          </p>

          <!-- Deal Card -->
          <div style="background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(14, 165, 233, 0.1) 100%); border: 2px solid rgba(220, 38, 38, 0.5); border-radius: 12px; padding: 25px; margin: 20px 0; position: relative;">
            <!-- Discount Badge -->
            ${deal.discount ? `
              <div style="background: #DC2626; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; display: inline-block; margin-bottom: 15px;">
                -${deal.discount}%
              </div>
            ` : ''}

            <!-- Route -->
            <h2 style="color: #FFFFFF; font-size: 28px; margin: 0 0 15px 0; text-align: center;">
              ${deal.from} → ${deal.to}
            </h2>

            <!-- Price -->
            <div style="text-align: center; margin: 20px 0;">
              <div style="color: #DC2626; font-size: 48px; font-weight: bold; margin: 10px 0;">
                ${deal.price}${deal.currency === 'EUR' ? '€' : deal.currency}
              </div>
              ${deal.originalPrice && deal.originalPrice > deal.price ? `
                <div style="color: #9CA3AF; font-size: 20px; text-decoration: line-through;">
                  ${deal.originalPrice}${deal.currency === 'EUR' ? '€' : deal.currency}
                </div>
              ` : ''}
            </div>

            <!-- Dates -->
            ${deal.dates ? `
              <p style="color: #D1D5DB; font-size: 14px; text-align: center; margin: 15px 0;">
                📅 ${deal.dates}
              </p>
            ` : ''}

            <!-- CTA Button -->
            ${deal.url ? `
              <div style="text-align: center; margin-top: 25px;">
                <a href="${deal.url}" style="display: inline-block; background: #DC2626; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  ✈️ Réserver maintenant
                </a>
              </div>
            ` : ''}
          </div>

          <!-- Savings -->
          ${deal.originalPrice && deal.originalPrice > deal.price ? `
            <div style="background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.5); border-radius: 8px; padding: 15px; margin-top: 20px; text-align: center;">
              <p style="color: #10B981; font-size: 16px; margin: 0; font-weight: bold;">
                💰 Vous économisez ${deal.originalPrice - deal.price}${deal.currency === 'EUR' ? '€' : deal.currency} !
              </p>
            </div>
          ` : ''}

          <!-- Urgency -->
          <p style="color: #F59E0B; font-size: 14px; text-align: center; margin-top: 20px; font-weight: bold;">
            ⚡ Dépêchez-vous, les places partent vite !
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px; color: #6B7280; font-size: 12px;">
          <p style="margin: 5px 0;">
            Vous recevez cet email car vous êtes abonné aux alertes Les Vols de Sylvain
          </p>
          <p style="margin: 15px 0 5px 0; color: #4B5563;">
            © ${new Date().getFullYear()} Les Vols de Sylvain - Tous droits réservés
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  if (!isConfigured || !resend) {
    return { success: false, error: 'Resend not configured - RESEND_API_KEY missing' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject: `🔥 ${deal.from} → ${deal.to} à ${deal.price}${deal.currency === 'EUR' ? '€' : deal.currency}`,
      html: emailHtml,
    })

    if (error) {
      return { success: false, error: `Resend error: ${error.message || JSON.stringify(error)}` }
    }

    console.log('✅ Email sent successfully to:', to, 'ID:', data?.id)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: `Exception: ${error.message || error}` }
  }
}

export async function sendWelcomeEmail(to: string, name?: string) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #000000; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="text-align: center; padding: 30px 0;">
          <h1 style="color: #DC2626; font-size: 36px; margin: 0;">✈️ Bienvenue !</h1>
        </div>

        <!-- Main Content -->
        <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 30px; margin: 20px 0;">
          <p style="color: #FFFFFF; font-size: 20px; margin-bottom: 20px; text-align: center;">
            Bonjour ${name || 'voyageur'} 👋
          </p>

          <p style="color: #D1D5DB; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Merci de vous être inscrit sur <strong style="color: #DC2626;">Les Vols de Sylvain</strong> !
          </p>

          <p style="color: #D1D5DB; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Vous allez maintenant recevoir les meilleurs deals de vols avant tout le monde. 🎉
          </p>

          <!-- Features -->
          <div style="background: rgba(14, 165, 233, 0.2); border: 1px solid rgba(14, 165, 233, 0.5); border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="color: #0EA5E9; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">
              🎯 Prochaines étapes :
            </p>
            <ul style="color: #D1D5DB; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>Ajoutez vos destinations préférées</li>
              <li>Configurez vos préférences d'alertes</li>
              <li>Recevez des deals personnalisés</li>
              <li>Économisez jusqu'à 80% sur vos vols</li>
            </ul>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL || 'https://flight-deals-phi.vercel.app'}/recherche" style="display: inline-block; background: #DC2626; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              📍 Commencer maintenant
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px; color: #6B7280; font-size: 12px;">
          <p style="margin: 5px 0;">
            Des questions ? Répondez simplement à cet email !
          </p>
          <p style="margin: 15px 0 5px 0; color: #4B5563;">
            © ${new Date().getFullYear()} Les Vols de Sylvain - Tous droits réservés
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  if (!isConfigured || !resend) {
    console.log('⚠️ Resend not configured, welcome email not sent to:', to)
    return false
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject: '✈️ Bienvenue chez Les Vols de Sylvain !',
      html: emailHtml,
    })

    if (error) {
      console.error('❌ Error sending welcome email:', error)
      return false
    }

    console.log('✅ Welcome email sent successfully to:', to, 'ID:', data?.id)
    return true
  } catch (error: any) {
    console.error('❌ Error sending welcome email:', error)
    return false
  }
}

// Test function for admin
export async function sendTestEmail(to: string) {
  const testDeal: DealData = {
    id: 'test-123',
    from: 'Paris',
    to: 'Tokyo',
    price: 329,
    originalPrice: 950,
    discount: 65,
    currency: 'EUR',
    dates: 'Avril - Juin 2026',
    url: process.env.NEXTAUTH_URL || 'https://flight-deals-phi.vercel.app',
  }

  return await sendDealEmail(to, testDeal, 'Testeur')
}
