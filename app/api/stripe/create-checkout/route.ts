import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createCheckoutSession, BillingPeriod } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, billingPeriod = 'monthly' } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID requis' },
        { status: 400 }
      )
    }

    // Validate billing period
    const validPeriods: BillingPeriod[] = ['monthly', 'quarterly', 'yearly']
    const period: BillingPeriod = validPeriods.includes(billingPeriod) ? billingPeriod : 'monthly'

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    })

    if (!user) {
      console.error('User not found for ID:', userId)
      return NextResponse.json(
        { error: `Utilisateur non trouvé (ID: ${userId})` },
        { status: 404 }
      )
    }

    // Create Stripe checkout session
    const session = await createCheckoutSession(
      user.subscription?.stripeCustomerId || null,
      user.email,
      user.id,
      period
    )

    return NextResponse.json({
      success: true,
      url: session.url,
    })
  } catch (error: any) {
    console.error('Checkout error:', error.message || error)
    return NextResponse.json(
      { error: `Erreur checkout: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}
