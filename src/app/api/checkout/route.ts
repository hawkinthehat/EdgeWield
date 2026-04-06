import Stripe from 'stripe'
import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const premiumPriceId = process.env.STRIPE_PREMIUM_PRICE_ID

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' })
  : null

export async function POST() {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable' },
      { status: 500 },
    )
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })
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

  const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
    payment_method_types: ['card'],
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

  if (typeof profile?.stripe_customer_id === 'string' && profile.stripe_customer_id.length > 0) {
    sessionParams.customer = profile.stripe_customer_id
  }

  const session = await stripe.checkout.sessions.create(sessionParams)

  return NextResponse.json({ url: session.url }, { status: 200 })
}
