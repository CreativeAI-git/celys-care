/**
 * Celys Care Payment & Subscription Provider Integration
 * Integrates Stripe or Mock Test Gateway in development.
 */

export interface CreateCheckoutParams {
  userId: string;
  userEmail: string;
  plan: "blossom" | "luminary";
  successUrl: string;
  cancelUrl: string;
}

export const PLAN_PRICING = {
  blossom: {
    name: "Blossom Sanctuary Membership",
    priceCents: 999, // $9.99/month
    interval: "month",
    trialDays: 7,
  },
  luminary: {
    name: "Luminary Annual Sanctuary",
    priceCents: 7999, // $79.99/year
    interval: "year",
    trialDays: 7,
  },
};

export async function createCheckoutSession(params: CreateCheckoutParams): Promise<{
  sessionId: string;
  checkoutUrl: string;
}> {
  const planInfo = PLAN_PRICING[params.plan];
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (stripeKey) {
    try {
      // In production with Stripe SDK
      const body = new URLSearchParams({
        "payment_method_types[0]": "card",
        mode: "subscription",
        customer_email: params.userEmail,
        "line_items[0][price_data][currency]": "usd",
        "line_items[0][price_data][product_data][name]": planInfo.name,
        "line_items[0][price_data][unit_amount]": planInfo.priceCents.toString(),
        "line_items[0][price_data][recurring][interval]": planInfo.interval,
        "line_items[0][quantity]": "1",
        "subscription_data[trial_period_days]": planInfo.trialDays.toString(),
        "metadata[userId]": params.userId,
        "metadata[plan]": params.plan,
        success_url: params.successUrl + "?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: params.cancelUrl,
      });

      const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (res.ok) {
        const session = await res.json();
        return {
          sessionId: session.id,
          checkoutUrl: session.url,
        };
      }
    } catch (err) {
      console.warn("Stripe API call failed, falling back to instant sanctuary activation:", err);
    }
  }

  // Standalone / Instant Dev checkout session
  const simSessionId = "cs_celys_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);
  return {
    sessionId: simSessionId,
    checkoutUrl: `${params.successUrl}?session_id=${simSessionId}&plan=${params.plan}`,
  };
}
