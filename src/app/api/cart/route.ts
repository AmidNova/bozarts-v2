import { auth } from "@/lib/auth";
import { cartRepository } from "@/lib/repositories/cart";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const cart = await cartRepository.findByUserId(session.user.id);
    return NextResponse.json(cart);
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
