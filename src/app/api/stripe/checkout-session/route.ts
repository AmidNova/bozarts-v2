import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { cartRepository } from "@/lib/repositories/cart";
import { SHIPPING_FEE } from "@/lib/constants";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const body = await request.json();
  const shippingAddress = body.shippingAddress;

  if (!shippingAddress || typeof shippingAddress !== "string") {
    return NextResponse.json(
      { error: "Adresse de livraison requise" },
      { status: 400 }
    );
  }

  const cart = await cartRepository.findByUserId(session.user.id);

  if (cart.items.length === 0) {
    return NextResponse.json({ error: "Le panier est vide" }, { status: 400 });
  }

  // Check all products are in stock
  const outOfStock = cart.items.filter((item) => !item.product.inStock);
  if (outOfStock.length > 0) {
    const names = outOfStock.map((i) => i.product.name).join(", ");
    return NextResponse.json(
      { error: `Produits indisponibles : ${names}` },
      { status: 400 }
    );
  }

  const lineItems = cart.items.map((item) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: item.product.name,
        ...(item.product.imageUrl && { images: [item.product.imageUrl] }),
      },
      unit_amount: Math.round(Number(item.product.price) * 100),
    },
    quantity: item.quantity,
  }));

  // Add shipping as a line item
  lineItems.push({
    price_data: {
      currency: "eur",
      product_data: {
        name: "Frais de livraison",
      },
      unit_amount: SHIPPING_FEE * 100,
    },
    quantity: 1,
  });

  const origin = request.headers.get("origin") ?? process.env.AUTH_URL;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    metadata: {
      userId: session.user.id,
      shippingAddress,
    },
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout/cancel`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
