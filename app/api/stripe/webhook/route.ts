import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    )
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const userId = session.metadata.userId

        if (!userId) {
          console.error('No userId in session metadata')
          break
        }

        // Retrieve the subscription from Stripe to get currentPeriodEnd
        let currentPeriodEnd = null
        if (session.subscription) {
          try {
            const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription)
            currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000)
          } catch (e) {
            console.error('Error fetching subscription:', e)
          }
        }

        // Upsert user subscription (create if not exists, update if exists)
        await prisma.subscription.upsert({
          where: { userId },
          update: {
            plan: 'sms',
            status: 'active',
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            currentPeriodEnd,
          },
          create: {
            userId,
            plan: 'sms',
            status: 'active',
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            currentPeriodEnd,
          },
        })
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any

        // Find user by stripeSubscriptionId
        const userSub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        })

        if (userSub) {
          await prisma.subscription.update({
            where: { id: userSub.id },
            data: {
              status: subscription.status,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any

        // Find user by stripeSubscriptionId
        const userSub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        })

        if (userSub) {
          await prisma.subscription.update({
            where: { id: userSub.id },
            data: {
              plan: 'free',
              status: 'canceled',
            },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
