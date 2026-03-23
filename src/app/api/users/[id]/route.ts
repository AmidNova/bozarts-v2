import { userRepository } from "@/lib/repositories/user";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const profile = await userRepository.findArtisanPublicProfile(id);
    if (!profile) {
      return NextResponse.json(
        { error: "Artisan introuvable" },
        { status: 404 }
      );
    }

    // Compute average rating
    const ratings = profile.reviewsReceived.map((r) => r.rating);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : null;

    return NextResponse.json({
      ...profile,
      reviewsReceived: undefined,
      avgRating,
      reviewCount: ratings.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
