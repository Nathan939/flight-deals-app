import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendDealSMS } from '@/lib/sms'
import { sendDealEmail } from '@/lib/email'

interface OfferData {
  from: string
  to: string
  toCity: string
  price: number
  originalPrice: number
  currency: string
  discount: number
  dates?: string
  url?: string
}

export async function POST(request: NextRequest) {
  try {
    const offerData: OfferData = await request.json()

    // Validation
    if (!offerData.from || !offerData.to || !offerData.toCity ||
        !offerData.price || !offerData.originalPrice ||
        !offerData.currency || !offerData.discount) {
      return NextResponse.json(
        { error: 'Tous les champs requis manquants' },
        { status: 400 }
      )
    }

    // Créer le deal dans la base de données
    const deal = await prisma.deal.create({
      data: {
        from: offerData.from,
        to: offerData.to,
        price: offerData.price,
        originalPrice: offerData.originalPrice,
        currency: offerData.currency,
        discount: offerData.discount,
        dates: offerData.dates || null,
        url: offerData.url || null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
      }
    })

    // Trouver tous les utilisateurs qui ont ajouté cette destination en favoris
    const destinations = await prisma.destination.findMany({
      where: {
        code: offerData.to
      },
      include: {
        user: {
          include: {
            subscription: true
          }
        }
      }
    })

    const notifications: Array<{
      userId: string
      type: 'email' | 'sms'
      success: boolean
      email?: string
    }> = []

    // Envoyer les notifications
    for (const destination of destinations) {
      const user = destination.user

      // Vérifier que l'utilisateur a un abonnement actif
      if (!user.subscription || user.subscription.status !== 'active') {
        continue
      }

      // Préparer les données du deal
      const dealData = {
        id: deal.id,
        from: deal.from,
        to: deal.to,
        toCity: offerData.toCity,
        price: deal.price,
        originalPrice: deal.originalPrice,
        currency: deal.currency,
        discount: deal.discount,
        dates: deal.dates || undefined,
        url: deal.url || undefined,
        createdAt: deal.createdAt
      }

      // Si le canal préféré est SMS et que l'utilisateur est premium avec numéro de téléphone
      if (destination.notifyChannel === 'sms' &&
          user.phone &&
          (user.subscription.plan === 'premium' || user.subscription.plan === 'sms')) {

        const smsSuccess = await sendDealSMS(user.phone, dealData)

        notifications.push({
          userId: user.id,
          type: 'sms',
          success: smsSuccess,
          email: user.email
        })

        // Créer un enregistrement d'alerte
        if (smsSuccess) {
          await prisma.alert.create({
            data: {
              userId: user.id,
              dealId: deal.id,
              channel: 'sms',
              sent: true,
              sentAt: new Date()
            }
          })
        }
      } else {
        // Sinon envoyer un email
        const emailResult = await sendDealEmail(user.email, dealData, user.name || undefined)

        notifications.push({
          userId: user.id,
          type: 'email',
          success: emailResult.success,
          email: user.email
        })

        // Créer un enregistrement d'alerte
        if (emailResult.success) {
          await prisma.alert.create({
            data: {
              userId: user.id,
              dealId: deal.id,
              channel: 'email',
              sent: true,
              sentAt: new Date()
            }
          })
        }
      }
    }

    // Compter les notifications envoyées avec succès
    const notificationsSent = notifications.filter(n => n.success).length

    return NextResponse.json({
      success: true,
      deal: {
        id: deal.id,
        from: deal.from,
        to: deal.to,
        price: deal.price,
        discount: deal.discount
      },
      notificationsSent,
      totalUsers: destinations.length,
      notifications: notifications.map(n => ({
        email: n.email,
        type: n.type,
        success: n.success
      }))
    })
  } catch (error: any) {
    console.error('Send offer error:', error)
    return NextResponse.json(
      { error: 'Error sending offer', details: error.message },
      { status: 500 }
    )
  }
}
