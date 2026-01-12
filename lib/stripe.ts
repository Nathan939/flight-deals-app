import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export async function createCheckoutSession(
  customerId: string | null,
  email: string,
  userId: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId || undefined,
    customer_email: !customerId ? email : undefined,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID_MONTHLY,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/tarifs?canceled=true`,
    metadata: {
      userId,
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
