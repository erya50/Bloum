import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

/**
 * Lazily throws only when a checkout flow is actually invoked, so the rest of the
 * app keeps working before Stripe test keys are configured.
 */
export const stripe = new Stripe(secretKey || "sk_test_placeholder", {
  apiVersion: "2026-06-24.dahlia",
});

export function assertStripeConfigured() {
  if (!secretKey) {
    throw new Error(
      "Stripe ist noch nicht konfiguriert. Bitte STRIPE_SECRET_KEY in .env.local setzen."
    );
  }
}
