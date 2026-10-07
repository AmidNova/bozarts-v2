import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { orderRepository } from "@/lib/repositories/order";

/**
 * Stripe webhook. The order already exists (PENDING, created with its price
 * snapshot when the checkout session was opened); this handler only moves it
 * to CONFIRMED on payment or CANCELLED on expiry. Both transitions are
 * idempotent, so Stripe retries are harmless.
 */
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.expired"
  ) {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object;
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId metadata" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.expired") {
      await orderRepository.cancelPending(orderId);
    } else if (session.payment_status === "paid") {
      await orderRepository.confirmPayment(orderId, paymentIntentId(session));
    }
  } catch (error) {
    // 500 makes Stripe retry the event later.
    console.error(`Stripe webhook ${event.type} failed for order ${orderId}`, error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function paymentIntentId(session: Stripe.Checkout.Session): string | null {
  const intent = session.payment_intent;
  if (!intent) return null;
  return typeof intent === "string" ? intent : intent.id;
}
