import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export type BillingPeriod = 'monthly' | 'quarterly' | 'yearly'

const PRICE_IDS: Record<BillingPeriod, string | undefined> = {
  monthly: process.env.STRIPE_PRICE_ID_MONTHLY,
  quarterly: process.env.STRIPE_PRICE_ID_QUARTERLY,
  yearly: process.env.STRIPE_PRICE_ID_YEARLY,
}

export async function createCheckoutSession(
  customerId: string | null,
  email: string,
  userId: string,
  billingPeriod: BillingPeriod = 'monthly'
) {
  const priceId = PRICE_IDS[billingPeriod] || PRICE_IDS.monthly

  if (!priceId) {
    throw new Error('Price ID not configured for this billing period')
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId || undefined,
    customer_email: !customerId ? email : undefined,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXTAUTH_URL}/upgrade?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/upgrade?canceled=true`,
    metadata: {
      userId,
      billingPeriod,
    },
  })

  return session
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId)
}

export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId)
}
