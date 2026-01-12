import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cancelSubscription } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID requis' },
        { status: 400 }
      )
    }

    // Get user subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    })

    if (!subscription || !subscription.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'Aucun abonnement actif trouvé' },
        { status: 404 }
      )
    }

    // Cancel in Stripe
    await cancelSubscription(subscription.stripeSubscriptionId)

    // Update in database
    await prisma.subscription.update({
      where: { userId },
      data: {
        plan: 'free',
        status: 'canceled',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Abonnement annulé avec succès',
    })
  } catch (error: any) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'annulation' },
      { status: 500 }
    )
  }
}
