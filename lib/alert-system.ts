import { prisma } from './prisma'
import { sendDealSMS } from './sms'
import { sendDealEmail } from './email'

interface DealNotification {
  from: string
  to: string
  toCity: string
  price: number
  originalPrice: number
  currency: string
  discount: number
  url?: string
}

/**
 * Système d'alertes automatiques pour les destinations "likées"
 *
 * Cette fonction doit être appelée quand un nouveau deal est créé.
 * Elle vérifie tous les utilisateurs qui ont "liké" cette destination
 * et leur envoie une alerte (SMS pour premium, email pour gratuit).
 */
export async function notifyUsersForDeal(deal: DealNotification) {
  try {
    // Trouver tous les utilisateurs qui ont "liké" la destination TO
    const usersFollowingDestination = await prisma.destination.findMany({
      where: {
        code: deal.to
      },
      include: {
        user: {
          include: {
            subscription: true
          }
        }
      }
    })

    console.log(`Found ${usersFollowingDestination.length} users following ${deal.toCity}`)

    const notifications = []

    for (const destination of usersFollowingDestination) {
      const user = destination.user

      // Vérifier que l'utilisateur a un abonnement actif
      if (!user.subscription || user.subscription.status !== 'active') {
        continue
      }

      const isPremium = user.subscription.plan === 'premium' || user.subscription.plan === 'sms'

      try {
        if (isPremium && user.phone) {
          // Envoyer SMS pour les utilisateurs premium avec téléphone
          const smsSuccess = await sendDealSMS(user.phone, {
            from: deal.from,
            to: deal.to,
            price: deal.price,
            originalPrice: deal.originalPrice,
            currency: deal.currency,
            discount: deal.discount,
            url: deal.url
          })

          if (smsSuccess) {
            notifications.push({
              userId: user.id,
              type: 'sms',
              success: true
            })
          }
        } else {
          // Envoyer email pour les utilisateurs gratuits
          const emailResult = await sendDealEmail(user.email, {
            from: deal.from,
            to: deal.to,
            toCity: deal.toCity,
            price: deal.price,
            originalPrice: deal.originalPrice,
            currency: deal.currency,
            discount: deal.discount,
            url: deal.url
          })

          if (emailResult.success) {
            notifications.push({
              userId: user.id,
              type: 'email',
              success: true
            })
          }
        }
      } catch (error) {
        console.error(`Error notifying user ${user.id}:`, error)
        notifications.push({
          userId: user.id,
          type: isPremium ? 'sms' : 'email',
          success: false,
          error: String(error)
        })
      }
    }

    return {
      success: true,
      notificationsSent: notifications.length,
      details: notifications
    }
  } catch (error) {
    console.error('Error in notifyUsersForDeal:', error)
    return {
      success: false,
      error: String(error)
    }
  }
}

/**
 * Vérifie si un utilisateur doit être notifié pour un deal
 */
export async function shouldNotifyUser(userId: string, dealId: string): Promise<boolean> {
  // Vérifier si l'utilisateur a déjà reçu une alerte pour ce deal
  const existingAlert = await prisma.alert.findFirst({
    where: {
      userId,
      dealId,
      sent: true
    }
  })

  return !existingAlert
}
