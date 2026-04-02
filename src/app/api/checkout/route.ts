import Stripe from 'stripe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const premiumPriceId = process.env.STRIPE_PREMIUM_PRICE_ID

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' })
  : null

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!stripe || !premiumPriceId || !process.env.NEXT_PUBLIC_URL) {
    return NextResponse.json(
      {
        error:
          'Missing STRIPE_SECRET_KEY, STRIPE_PREMIUM_PRICE_ID, or NEXT_PUBLIC_URL environment variable',
      },
      { status: 500 },
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ['card'],
    customer:
      typeof profile?.stripe_customer_id === 'string' && profile.stripe_customer_id.length > 0
        ? profile.stripe_customer_id
        : undefined,
    line_items: [
      {
        price: premiumPriceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    allow_promotion_codes: true,
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/billing`,
    metadata: {
      userId: user.id,
      supabase_user_id: user.id,
    },
  }

  const session = await stripe.checkout.sessions.create(sessionParams)

  return NextResponse.json({ url: session.url }, { status: 200 })
}
