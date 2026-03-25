import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { SHIPPING_FEE } from "@/lib/constants";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata?.userId;
    const shippingAddress = session.metadata?.shippingAddress;

    if (!userId || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing metadata" },
        { status: 400 }
      );
    }

    // Create order from cart atomically
    await prisma.$transaction(async (tx) => {
      const cartItems = await tx.cartItem.findMany({
        where: { userId },
        include: { product: true },
      });

      if (cartItems.length === 0) {
        // Cart already cleared (webhook retry or duplicate)
        return;
      }

      const subtotal = cartItems.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
      );
      const totalAmount = subtotal + SHIPPING_FEE;

      await tx.order.create({
        data: {
          clientId: userId,
          shippingAddress,
          totalAmount,
          status: "CONFIRMED",
          stripePaymentId: session.payment_intent as string,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.price,
            })),
          },
        },
      });

      await tx.cartItem.deleteMany({ where: { userId } });
    });
  }

  return NextResponse.json({ received: true });
}
