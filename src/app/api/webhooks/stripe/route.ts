import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

type SubscriptionStatus = 'active' | 'canceled' | 'past_due'

function normalizeSubscriptionStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  if (status === 'active' || status === 'trialing') return 'active'
  if (status === 'past_due' || status === 'unpaid' || status === 'incomplete') return 'past_due'
  return 'canceled'
}

function isPremiumStatus(status: SubscriptionStatus) {
  return status === 'active'
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

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' })
  const signature = req.headers.get('stripe-signature')
  const rawBody = await req.text()

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown webhook error'
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  const supabaseAdmin = getSupabaseAdmin() as any

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.supabase_user_id

      if (!userId) {
        console.warn('checkout.session.completed missing metadata.supabase_user_id')
        break
      }

      const updates: {
        is_premium: boolean
        subscription_status: SubscriptionStatus
        stripe_customer_id?: string
        is_pro: boolean
        role: 'free' | 'pro'
      } = {
        is_premium: true,
        subscription_status: 'active',
        is_pro: true,
        role: 'pro',
      }

      if (typeof session.customer === 'string') {
        updates.stripe_customer_id = session.customer
      }

      const { error } = await supabaseAdmin.from('profiles').update(updates).eq('id', userId)
      if (error) {
        console.error('Failed to update profile from checkout.session.completed:', error)
      }
      break
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const status = normalizeSubscriptionStatus(subscription.status)
      const customerId = typeof subscription.customer === 'string' ? subscription.customer : null

      if (!customerId) {
        console.warn(`${event.type} missing string customer id`)
        break
      }

      const { error } = await supabaseAdmin
        .from('profiles')
        .update({
          is_premium: isPremiumStatus(status),
          subscription_status: status,
          is_pro: isPremiumStatus(status),
          role: isPremiumStatus(status) ? 'pro' : 'free',
        })
        .eq('stripe_customer_id', customerId)

      if (error) {
        console.error(`Failed to update profile from ${event.type}:`, error)
      }
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
