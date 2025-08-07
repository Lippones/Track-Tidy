import { env } from '@workspace/env'
import type { NextApiRequest } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(env.STRIPE_API_KEY)

export async function POST(req: NextApiRequest) {
  const sig = req.headers['stripe-signature'] as string

  try {
    const event = await stripe.webhooks.constructEventAsync(
      req.body,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    )

    if (event.type === 'checkout.session.completed') {
      if (event.data.object.payment_status === 'paid') {
        console.log('Payment was successful for session:', event.data.object.id)
      }
    }
  } catch (error) {
    console.error('Error processing Stripe webhook:', error)
    return new Response('Webhook Error', { status: 400 })
  }

  return new Response('Hello from the POST route!', { status: 200 })
}
