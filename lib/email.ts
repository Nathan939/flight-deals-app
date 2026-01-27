import { DealData } from './types'

// SendGrid est utilisé pour les emails
// Vous devez configurer un domaine vérifié dans SendGrid
const isConfigured = !!(
  process.env.EMAIL_API_KEY &&
  process.env.EMAIL_FROM
)

export async function sendDealEmail(
  to: string,
  deal: DealData,
  userName?: string
) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'JetBrains Mono', monospace;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="text-align: center; padding: 30px 0;">
          <h1 style="color: #DC2626; font-size: 32px; margin: 0;">✈️ Nouveau Deal Détecté!</h1>
        </div>

        <!-- Main Content -->
        <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 30px; margin: 20px 0;">
          <p style="color: #E5E7EB; font-size: 16px; margin-bottom: 20px;">
            Bonjour ${userName || 'voyageur'} 👋
          </p>
          <p style="color: #D1D5DB; font-size: 14px; margin-bottom: 30px;">
            Nous avons trouvé un excellent deal pour vous :
          </p>

          <!-- Deal Card -->
          <div style="background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%); border: 2px solid rgba(220, 38, 38, 0.3); border-radius: 12px; padding: 25px; margin: 20px 0; position: relative;">
            <!-- Discount Badge -->
            ${deal.discount ? `
              <div style="position: absolute; top: -12px; right: 20px; background: #DC2626; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.3);">
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
                <a href="${deal.url}" style="display: inline-block; background: #DC2626; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.3);">
                  ✈️ Réserver maintenant
                </a>
              </div>
            ` : ''}
          </div>

          <!-- Savings -->
          ${deal.originalPrice && deal.originalPrice > deal.price ? `
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 15px; margin-top: 20px; text-align: center;">
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
          <p style="margin: 5px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3050'}/destinations" style="color: #DC2626; text-decoration: none;">Gérer mes destinations</a>
          </p>
          <p style="margin: 15px 0 5px 0; color: #4B5563;">
            © ${new Date().getFullYear()} Les Vols de Sylvain - Tous droits réservés
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  const emailText = `
Nouveau Deal Détecté! 🔥

Bonjour ${userName || 'voyageur'},

Nous avons trouvé un excellent deal pour vous:

${deal.from} → ${deal.to}
Prix: ${deal.price}${deal.currency === 'EUR' ? '€' : deal.currency}
${deal.originalPrice ? `Prix habituel: ${deal.originalPrice}${deal.currency === 'EUR' ? '€' : deal.currency}` : ''}
${deal.discount ? `Réduction: -${deal.discount}%` : ''}
${deal.dates ? `Dates: ${deal.dates}` : ''}

${deal.url ? `Réserver: ${deal.url}` : ''}

Dépêchez-vous, les places partent vite! ⚡

---
Les Vols de Sylvain
${process.env.NEXTAUTH_URL || 'http://localhost:3050'}
  `

  if (!isConfigured) {
    console.log('⚠️ Twilio email not configured')
    console.log('To:', to)
    console.log('Subject:', `🔥 ${deal.from} → ${deal.to} à ${deal.price}${deal.currency === 'EUR' ? '€' : deal.currency}`)
    console.log('Vous devez configurer un domaine vérifié dans Twilio SendGrid')
    return false
  }

  try {
    // SendGrid API pour l'envoi d'emails
    // Documentation: https://docs.sendgrid.com/api-reference/mail-send/mail-send
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
          subject: `🔥 ${deal.from} → ${deal.to} à ${deal.price}${deal.currency === 'EUR' ? '€' : deal.currency}`,
        }],
        from: {
          email: process.env.EMAIL_FROM || 'noreply@example.com',
          name: process.env.EMAIL_FROM_NAME || 'Les Vols de Sylvain',
        },
        content: [
          {
            type: 'text/plain',
            value: emailText,
          },
          {
            type: 'text/html',
            value: emailHtml,
          },
        ],
      }),
    })

    if (response.ok || response.status === 202) {
      console.log('✅ Email sent successfully to:', to)
      return true
    } else {
      const errorText = await response.text()
      console.error('❌ Error sending email:', response.status, errorText)
      return false
    }
  } catch (error: any) {
    console.error('❌ Error sending email:', error)
    return false
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
    <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'JetBrains Mono', monospace;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="text-align: center; padding: 30px 0;">
          <h1 style="color: #DC2626; font-size: 36px; margin: 0;">✈️ Bienvenue !</h1>
        </div>

        <!-- Main Content -->
        <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 30px; margin: 20px 0;">
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
          <div style="background: rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.3); border-radius: 8px; padding: 20px; margin: 20px 0;">
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
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3050'}/destinations" style="display: inline-block; background: #DC2626; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.3);">
              📍 Ajouter mes destinations
            </a>
          </div>
        </div>

        <!-- Tips -->
        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="color: #F59E0B; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">
            💡 Conseil :
          </p>
          <p style="color: #D1D5DB; font-size: 14px; line-height: 1.6; margin: 0;">
            Plus vous ajoutez de destinations, plus vous recevrez de deals intéressants. N'hésitez pas à en ajouter plusieurs !
          </p>
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

  const emailText = `
Bienvenue chez Les Vols de Sylvain! ✈️

Bonjour ${name || 'voyageur'},

Merci de vous être inscrit ! Vous allez maintenant recevoir les meilleurs deals de vols avant tout le monde.

Prochaines étapes :
- Ajoutez vos destinations préférées
- Configurez vos préférences d'alertes
- Recevez des deals personnalisés
- Économisez jusqu'à 80% sur vos vols

Accédez à votre dashboard : ${process.env.NEXTAUTH_URL || 'http://localhost:3050'}/destinations

Bon voyage !

---
Les Vols de Sylvain
${process.env.NEXTAUTH_URL || 'http://localhost:3050'}
  `

  if (!isConfigured) {
    console.log('⚠️ Twilio email not configured, welcome email not sent to:', to)
    return false
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
          subject: '✈️ Bienvenue chez Les Vols de Sylvain !',
        }],
        from: {
          email: process.env.EMAIL_FROM || 'noreply@example.com',
          name: process.env.EMAIL_FROM_NAME || 'Les Vols de Sylvain',
        },
        content: [
          {
            type: 'text/plain',
            value: emailText,
          },
          {
            type: 'text/html',
            value: emailHtml,
          },
        ],
      }),
    })

    if (response.ok || response.status === 202) {
      console.log('✅ Welcome email sent successfully to:', to)
      return true
    } else {
      const errorText = await response.text()
      console.error('❌ Error sending welcome email:', response.status, errorText)
      return false
    }
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
    url: process.env.NEXTAUTH_URL || 'http://localhost:3050',
  }

  return await sendDealEmail(to, testDeal, 'Testeur')
}
