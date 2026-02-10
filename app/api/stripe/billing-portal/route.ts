import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createBillingPortalSession } from '@/lib/stripe'

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

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'Aucun abonnement Stripe trouvé' },
        { status: 404 }
      )
    }

    // Create billing portal session
    const session = await createBillingPortalSession(subscription.stripeCustomerId)

    return NextResponse.json({
      success: true,
      url: session.url,
    })
  } catch (error: any) {
    console.error('Billing portal error:', error.message || error)
    return NextResponse.json(
      { error: `Erreur: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}
