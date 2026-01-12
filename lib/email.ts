import { DealData } from './types'

// This is a placeholder for Brevo/MailerLite integration
// You'll need to install the appropriate SDK and configure it

export async function sendDealEmail(
  to: string,
  deal: DealData,
  userName?: string
) {
  // Example with fetch to Brevo API
  // Uncomment and configure when you have API keys

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #DC2626;">🔥 Nouveau Deal Détecté!</h1>
      <p>Bonjour ${userName || 'voyageur'},</p>
      <p>Nous avons trouvé un excellent deal pour vous:</p>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #000; margin: 0 0 10px 0;">${deal.from} → ${deal.to}</h2>
        <p style="color: #000; font-size: 24px; font-weight: bold; margin: 10px 0;">
          ${deal.price}${deal.currency}
        </p>
        <p style="color: #DC2626; margin: 5px 0;">
          -${deal.discount}% (prix habituel: ${deal.originalPrice}${deal.currency})
        </p>
        ${deal.url ? `<a href="${deal.url}" style="display: inline-block; background: #DC2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">Voir les dates</a>` : ''}
      </div>
      <p style="color: #666; font-size: 12px;">
        Dépêchez-vous, les places partent vite! ⚡
      </p>
    </div>
  `

  try {
    // Example with Brevo (formerly Sendinblue)
    /*
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.EMAIL_API_KEY || '',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { email: process.env.EMAIL_FROM },
        to: [{ email: to }],
        subject: `🔥 ${deal.from} → ${deal.to} à ${deal.price}${deal.currency}`,
        htmlContent: emailHtml,
      }),
    })
    return response.ok
    */

    // For now, just log to console
    console.log('Email would be sent to:', to)
    console.log('Deal:', deal)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

export async function sendWelcomeEmail(to: string, name?: string) {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #DC2626;">Bienvenue chez Flight Deals Alerts! ✈️</h1>
      <p>Bonjour ${name || 'voyageur'},</p>
      <p>Merci de vous être inscrit! Vous allez maintenant recevoir les meilleurs deals de vols avant tout le monde.</p>
      <p>Configurez vos destinations préférées dans votre dashboard pour recevoir des alertes personnalisées.</p>
      <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background: #DC2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">Accéder au Dashboard</a>
    </div>
  `

  try {
    console.log('Welcome email would be sent to:', to)
    return true
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return false
  }
}
