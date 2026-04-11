import Stripe from 'stripe'
import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const scoutPriceId = process.env.STRIPE_PRICE_ID_SCOUT
const proPriceId = process.env.STRIPE_PRICE_ID_PRO

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' })
  : null

type CheckoutPlan = 'scout' | 'pro'

function resolveCheckoutPriceId(plan: CheckoutPlan): string | null {
  if (plan === 'scout') {
    return scoutPriceId ?? null
  }

  return proPriceId ?? null
}

function getBaseUrl(): string | null {
  const rawValue = process.env.NEXT_PUBLIC_URL ?? process.env.NEXT_PUBLIC_SITE_URL
  return rawValue && rawValue.length > 0 ? rawValue : null
}

async function resolvePromotionCode(
  stripeClient: Stripe,
  rawCode: string | undefined,
): Promise<Stripe.PromotionCode | null> {
  if (!rawCode || rawCode.length === 0) {
    return null
  }

  const normalizedCode = rawCode.trim()
  if (normalizedCode.length === 0) {
    return null
  }

  const promotionCodeList = await stripeClient.promotionCodes.list({
    code: normalizedCode,
    active: true,
    limit: 1,
  })

  return promotionCodeList.data[0] ?? null
}

export async function POST(req: Request) {
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

  const body = (await req.json().catch(() => ({}))) as { plan?: string; foundingMemberCode?: string }
  const foundingMemberCodeInput = body.foundingMemberCode?.trim() ?? ''
  const hasFoundingMemberCode = foundingMemberCodeInput.length > 0
  const requestedPlan = body.plan === 'scout' ? 'scout' : 'pro'
  const selectedPriceId = resolveCheckoutPriceId(requestedPlan)
  const baseUrl = getBaseUrl()

  if (!stripe || !selectedPriceId || !baseUrl) {
    return NextResponse.json(
      {
        error:
          'Missing STRIPE_SECRET_KEY, STRIPE_PRICE_ID_SCOUT/STRIPE_PRICE_ID_PRO, or NEXT_PUBLIC_URL/NEXT_PUBLIC_SITE_URL environment variable',
      },
      { status: 500 },
    )
  }

  const promotionCode = await resolvePromotionCode(stripe, foundingMemberCodeInput)
  if (hasFoundingMemberCode && !promotionCode) {
    return NextResponse.json({ error: 'Invalid or inactive Founding Member code.' }, { status: 400 })
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
        price: selectedPriceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    allow_promotion_codes: true,
    success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/billing`,
    metadata: {
      userId: user.id,
      supabase_user_id: user.id,
      selected_plan: requestedPlan,
    },
  }

  if (typeof profile?.stripe_customer_id === 'string' && profile.stripe_customer_id.length > 0) {
    sessionParams.customer = profile.stripe_customer_id
  }

  if (promotionCode) {
    sessionParams.discounts = [{ promotion_code: promotionCode.id }]
    sessionParams.metadata = {
      ...sessionParams.metadata,
      founding_member_code: promotionCode.code ?? foundingMemberCodeInput,
      founding_member_promotion_code_id: promotionCode.id,
    }
  }

  const session = await stripe.checkout.sessions.create(sessionParams)

  return NextResponse.json({ url: session.url }, { status: 200 })
}
