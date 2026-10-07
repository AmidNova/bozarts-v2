import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { orderRepository, OrderValidationError } from "@/lib/repositories/order";
import { CreateOrderSchema } from "@/lib/schemas/order";
import { SHIPPING_FEE } from "@/lib/constants";

/** Stripe's minimum lifetime for a Checkout session; expired sessions cancel their order. */
const CHECKOUT_SESSION_TTL_SECONDS = 30 * 60;

/**
 * Open a Stripe Checkout session for the current cart.
 *
 * A PENDING order is created first (stock check + price snapshot) and the
 * Stripe line items are built from it, so the amount charged always matches
 * the order — even if the cart changes while the customer is paying.
 * The cart itself is only cleared by the webhook once payment is confirmed.
 */
export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = CreateOrderSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: "Adresse de livraison requise" }, { status: 400 });
  }

  let order;
  try {
    order = await orderRepository.createFromCart(userId, parsed.data.shippingAddress, {
      clearCart: false,
    });
  } catch (error) {
    if (error instanceof OrderValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Pending order creation failed", error);
    return NextResponse.json({ error: "Erreur lors de la commande" }, { status: 500 });
  }

  const lineItems = [
    ...order.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.product.name,
          ...(item.product.imageUrl && { images: [item.product.imageUrl] }),
        },
        unit_amount: Math.round(Number(item.unitPrice) * 100),
      },
      quantity: item.quantity,
    })),
    {
      price_data: {
        currency: "eur",
        product_data: { name: "Frais de livraison" },
        unit_amount: SHIPPING_FEE * 100,
      },
      quantity: 1,
    },
  ];

  const origin = request.headers.get("origin") ?? process.env.AUTH_URL;

  try {
    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      client_reference_id: order.id,
      metadata: { orderId: order.id },
      expires_at: Math.floor(Date.now() / 1000) + CHECKOUT_SESSION_TTL_SECONDS,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error(`Stripe session creation failed for order ${order.id}`, error);
    await orderRepository.cancelPending(order.id);
    return NextResponse.json(
      { error: "Le paiement est momentanement indisponible, reessayez plus tard" },
      { status: 502 }
    );
  }
}
