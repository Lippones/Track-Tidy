import { env } from '@workspace/env'
import { prisma } from '@workspace/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(env.STRIPE_API_KEY)

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature') as string
  const body = await req.text()

  try {
    const event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    )

    if (event.type === 'checkout.session.completed') {
      if (event.data.object.payment_status === 'paid') {
        // Sei que essa código está uma bosta 👌

        const creditPackage = await prisma.creditPackage.findUnique({
          where: {
            id: event.data.object.metadata?.packageId as string
          }
        })

        if (!creditPackage) {
          throw new Error('Package not found')
        }

        await prisma.user.update({
          where: {
            email: event.data.object.customer_email as string
          },
          data: {
            credits: {
              increment: creditPackage.credits // Ajuste conforme a lógica do seu pacote de créditos
            },
            creditTransactions: {
              create: {
                amount: creditPackage.credits,
                type: 'PURCHASE',
                packageId: creditPackage.id
              }
            }
          }
        })
        console.log('Payment was successful for session:', event.data.object.id)
      }
    }
  } catch (error) {
    console.error('Error processing Stripe webhook:', error)
    return new Response('Webhook Error', { status: 400 })
  }
}
