import Stripe from "stripe";

const globalForStripe = globalThis as unknown as {
  stripe: Stripe | undefined;
};

/**
 * Lazily creates the Stripe client so that importing this module never
 * requires STRIPE_SECRET_KEY (e.g. during `next build` in CI).
 */
export function getStripe(): Stripe {
  if (globalForStripe.stripe) return globalForStripe.stripe;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  const client = new Stripe(secretKey, {
    apiVersion: "2026-02-25.clover",
  });
  globalForStripe.stripe = client;
  return client;
}
