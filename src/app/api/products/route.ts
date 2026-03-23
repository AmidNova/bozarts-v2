import { productRepository } from "@/lib/repositories/product";
import { ProductFilterSchema } from "@/lib/schemas/product";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = ProductFilterSchema.safeParse(
    Object.fromEntries(searchParams.entries())
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paramètres invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = await productRepository.findAll(parsed.data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
