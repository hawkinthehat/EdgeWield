import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

type ProfileUpdate = {
  is_pro: boolean
  role: 'free' | 'pro'
}

async function updateUserRole(userId: string, update: ProfileUpdate) {
  const supabaseAdmin = getSupabaseAdmin()
  const { error } = await supabaseAdmin.from('profiles').update(update).eq('id', userId)

  if (error) {
    console.error('Failed to update profile role:', error)
  }
}

async function getUserIdFromSubscriptionEvent(
  subscription: Stripe.Subscription,
): Promise<string | null> {
  const supabaseAdmin = getSupabaseAdmin()
  const metadataUserId = subscription.metadata?.userId
  if (metadataUserId) return metadataUserId

  if (typeof subscription.customer !== 'string') return null

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', subscription.customer)
    .maybeSingle()

  if (error) {
    console.error('Failed to fetch profile by stripe_customer_id:', error)
    return null
  }

  return data?.id ?? null
}

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeSecretKey || !endpointSecret) {
    return NextResponse.json(
      { error: 'Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET' },
      { status: 500 },
    )
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
  })

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown webhook error'
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId

      if (userId) {
        const supabaseAdmin = getSupabaseAdmin()
        await updateUserRole(userId, { is_pro: true, role: 'pro' })

        if (typeof session.customer === 'string') {
          const { error } = await supabaseAdmin
            .from('profiles')
            .update({ stripe_customer_id: session.customer })
            .eq('id', userId)

          if (error) {
            console.error('Failed to store stripe_customer_id:', error)
          }
        }
      } else {
        console.warn('checkout.session.completed missing metadata.userId')
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = await getUserIdFromSubscriptionEvent(subscription)

      if (userId) {
        await updateUserRole(userId, { is_pro: false, role: 'free' })
      } else {
        console.warn('customer.subscription.deleted could not resolve userId')
      }
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
