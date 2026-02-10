import { DealData } from './types'
import twilio from 'twilio'

/**
 * Envoie un SMS de deal via Twilio
 */
export async function sendDealSMS(to: string, deal: DealData) {
  // Use city names if available, fallback to airport codes
  const fromDisplay = deal.fromCity || deal.from
  const toDisplay = deal.toCity || deal.to
  const currencySymbol = deal.currency === 'EUR' ? '€' : deal.currency

  const message = `🔥 DEAL ALERT: ${fromDisplay} → ${toDisplay} à ${deal.price}${currencySymbol} (-${deal.discount}%) au lieu de ${deal.originalPrice}${currencySymbol}. Réservez vite!`

  try {
    // Check if Twilio is configured
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !fromNumber) {
      console.warn('⚠️ Twilio not configured, SMS not sent')
      console.log('SMS would be sent to:', to)
      console.log('Message:', message)
      return false
    }

    if (
      accountSid === 'your_twilio_account_sid' ||
      authToken === 'your_twilio_auth_token' ||
      fromNumber === '+1234567890'
    ) {
      console.warn('⚠️ Twilio credentials are placeholder values, SMS not sent')
      console.log('SMS would be sent to:', to)
      console.log('Message:', message)
      return false
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken)

    // Send SMS
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    })

    console.log('✅ SMS sent successfully:', result.sid)
    return true
  } catch (error) {
    console.error('❌ Error sending SMS:', error)
    return false
  }
}

/**
 * Envoie un SMS de bienvenue
 */
export async function sendWelcomeSMS(to: string, name?: string) {
  const greeting = name ? `Bonjour ${name}` : 'Bonjour'
  const message = `${greeting} ! 👋 Bienvenue sur FlightAlert ! Vous recevrez désormais les meilleurs deals de vols par SMS. Bon voyage ! ✈️`

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !fromNumber) {
      console.warn('⚠️ Twilio not configured')
      return false
    }

    if (
      accountSid === 'your_twilio_account_sid' ||
      authToken === 'your_twilio_auth_token' ||
      fromNumber === '+1234567890'
    ) {
      console.warn('⚠️ Twilio credentials are placeholder values')
      return false
    }

    const client = twilio(accountSid, authToken)

    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    })

    console.log('✅ Welcome SMS sent:', result.sid)
    return true
  } catch (error) {
    console.error('❌ Error sending welcome SMS:', error)
    return false
  }
}

/**
 * Teste l'envoi d'un SMS (pour l'admin)
 */
export async function sendTestSMS(to: string) {
  const message = '🧪 Test SMS depuis FlightAlert - Si vous recevez ce message, Twilio fonctionne correctement ! ✅'

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Twilio non configuré. Ajoutez TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN et TWILIO_PHONE_NUMBER dans .env')
    }

    if (
      accountSid === 'your_twilio_account_sid' ||
      authToken === 'your_twilio_auth_token' ||
      fromNumber === '+1234567890'
    ) {
      throw new Error('Les credentials Twilio sont des valeurs par défaut. Ajoutez vos vraies clés API.')
    }

    const client = twilio(accountSid, authToken)

    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    })

    console.log('✅ Test SMS sent:', result.sid)
    return { success: true, sid: result.sid }
  } catch (error: any) {
    console.error('❌ Error sending test SMS:', error)
    return { success: false, error: error.message }
  }
}
