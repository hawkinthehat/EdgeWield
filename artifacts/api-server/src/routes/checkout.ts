import { Router, type IRouter } from "express";
import Stripe from "stripe";
import { supabase } from "../lib/supabase";

const router: IRouter = Router();

router.post("/checkout", async (req, res) => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!secretKey || !priceId) {
    res.status(500).json({ error: "Stripe is not configured" });
    return;
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2023-10-16" as any });

  // Derive base URL from Replit domains (first domain in the comma-separated list)
  const domains = process.env.REPLIT_DOMAINS ?? "";
  const baseUrl = domains
    ? `https://${domains.split(",")[0].trim()}`
    : "http://localhost:80";

  try {
    const { userId, email, tier, referralCode } = req.body as {
      userId?: string;
      email?: string;
      tier?: "standard" | "pro";
      referralCode?: string;
    };

    // Standard tier uses its own price ID if configured, falls back to default
    const standardPriceId = process.env.STRIPE_STANDARD_PRICE_ID ?? priceId;
    const resolvedPriceId = tier === "standard" ? standardPriceId : priceId;

    // Resolve referrer user_id from referral_code so the webhook can credit them
    let referredByUserId: string | undefined;
    if (referralCode && supabase) {
      const { data: referrer } = await supabase
        .from("profiles")
        .select("id")
        .eq("referral_code", referralCode.toUpperCase())
        .maybeSingle();

      if (referrer) {
        referredByUserId = referrer.id;
        req.log.info({ referralCode, referredByUserId }, "Referral code resolved");
      } else {
        req.log.warn({ referralCode }, "Referral code not found — proceeding without credit");
      }
    }

    const metadata: Record<string, string> = {
      ...(userId            ? { userId }                                  : {}),
      ...(tier              ? { tier }                                     : {}),
      ...(referralCode      ? { referred_by_code: referralCode.toUpperCase() } : {}),
      ...(referredByUserId  ? { referred_by_user_id: referredByUserId }   : {}),
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: resolvedPriceId, quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      ...(email ? { customer_email: email } : {}),
      success_url: `${baseUrl}/picks?success=true`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      ...(Object.keys(metadata).length > 0 ? { metadata } : {}),
    });

    res.json({ url: session.url });
  } catch (err: any) {
    req.log.error({ err }, "Stripe checkout error");
    res.status(500).json({ error: err.message });
  }
});

export default router;
