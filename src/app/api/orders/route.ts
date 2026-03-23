import { auth } from "@/lib/auth";
import { orderRepository } from "@/lib/repositories/order";
import { OrderFilterSchema } from "@/lib/schemas/order";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = OrderFilterSchema.safeParse(
    Object.fromEntries(searchParams.entries())
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paramètres invalides" },
      { status: 400 }
    );
  }

  try {
    // Artisans see sales; everyone else sees their purchases
    const result =
      session.user.role === "ARTISAN"
        ? await orderRepository.findByArtisanId(session.user.id, parsed.data)
        : await orderRepository.findByClientId(session.user.id, parsed.data);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
