'use server'

import { authActionClient } from '@/lib/safe-action'
import { prisma } from '@workspace/prisma'
import z from 'zod'
import Stripe from 'stripe'
import { env } from '@workspace/env'
import AbacatePay from 'abacatepay-nodejs-sdk'

const inputSchema = z.object({
  packageId: z.string().min(1, 'Package ID is required'),
  paymentMethod: z.enum(['card', 'pix']).default('card'),
  callbackUrl: z.url().optional()
})

const WEBHOOK_ENDPOINT = `${env.NEXT_PUBLIC_APP_URL}/api/webhooks/stripe`

const stripe = new Stripe(env.STRIPE_API_KEY)
const abacate = AbacatePay(env.ABACATEPAY_API_KEY)

export const buyCredits = authActionClient
  .inputSchema(inputSchema)
  .action(
    async ({
      parsedInput: { packageId, paymentMethod, callbackUrl },
      ctx: { user }
    }) => {
      const creditPackage = await prisma.creditPackage.findUnique({
        where: { id: packageId }
      })

      if (!creditPackage) {
        throw new Error('Package not found')
      }

      if (paymentMethod === 'pix') {
        const order = await abacate.billing.create({
          frequency: 'ONE_TIME',
          customer: {
            email: user.email,
            name: user.name || 'Cliente'
          },
          completionUrl: env.NEXT_PUBLIC_APP_URL,
          methods: ['PIX'],
          products: [
            {
              externalId: creditPackage.id,
              name: creditPackage.name,
              description: creditPackage.description || undefined,
              quantity: 1,
              price: creditPackage.price * 5 // em centavos x dollar
            }
          ],
          returnUrl: callbackUrl ?? `${env.NEXT_PUBLIC_APP_URL}/playlists`
        })

        if (order.error) {
          throw new Error('Failed to create PIX order')
        }

        return {
          url: order.data?.url
        }
      }

      const checkout = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        currency: 'usd',
        cancel_url: callbackUrl ?? `${env.NEXT_PUBLIC_APP_URL}/playlists`,
        success_url: callbackUrl ?? `${env.NEXT_PUBLIC_APP_URL}/playlists`,
        customer_email: user.email || undefined,
        payment_intent_data: {
          metadata: {
            packageId,
            userId: user.id, // Adicione o userId para facilitar o processamento
            webhookUrl: WEBHOOK_ENDPOINT // Referência do webhook
          }
        },
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: creditPackage.name,
                description: creditPackage.description || undefined
              },
              unit_amount: creditPackage.price // in cents
            },
            quantity: 1
          }
        ],
        metadata: {
          packageId
        }
      })

      return {
        url: checkout.url
      }
    }
  )
