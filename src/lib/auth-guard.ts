import { auth } from "@/lib/auth";

type AuthUser = { id: string; role: string };

type AuthResult =
  | { authenticated: true; user: AuthUser }
  | { authenticated: false; error: string };

export async function requireAuth(): Promise<AuthResult> {
  const session = await auth();
  const id = session?.user?.id;
  const role = session?.user?.role;

  if (!id || !role) {
    return { authenticated: false, error: "Non authentifié" };
  }

  return { authenticated: true, user: { id, role } };
}

export async function requireAdmin(): Promise<AuthResult> {
  const result = await requireAuth();
  if (!result.authenticated) return result;

  if (result.user.role !== "ADMIN") {
    return { authenticated: false, error: "Réservé aux administrateurs" };
  }

  return result;
}

export async function requireArtisan(): Promise<AuthResult> {
  const result = await requireAuth();
  if (!result.authenticated) return result;

  if (result.user.role !== "ARTISAN") {
    return { authenticated: false, error: "Réservé aux artisans" };
  }

  return result;
}
