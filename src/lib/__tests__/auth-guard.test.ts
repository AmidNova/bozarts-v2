import { describe, it, expect, vi, beforeEach } from "vitest";

const { authMock } = vi.hoisted(() => ({ authMock: vi.fn() }));
vi.mock("@/lib/auth", () => ({ auth: authMock }));

import { requireAuth, requireAdmin, requireArtisan } from "@/lib/auth-guard";

const sessionFor = (role: string) => ({ user: { id: "user-1", role } });

describe("auth guards", () => {
  beforeEach(() => {
    authMock.mockReset();
  });

  it("requireAuth rejects a missing session", async () => {
    authMock.mockResolvedValue(null);
    expect(await requireAuth()).toEqual({ authenticated: false, error: "Non authentifié" });
  });

  it("requireAuth rejects a session without role", async () => {
    authMock.mockResolvedValue({ user: { id: "user-1" } });
    expect((await requireAuth()).authenticated).toBe(false);
  });

  it("requireAuth returns the user id and role", async () => {
    authMock.mockResolvedValue(sessionFor("CLIENT"));
    expect(await requireAuth()).toEqual({
      authenticated: true,
      user: { id: "user-1", role: "CLIENT" },
    });
  });

  it.each([
    ["CLIENT", false],
    ["ARTISAN", false],
    ["ADMIN", true],
  ])("requireAdmin with role %s → authenticated=%s", async (role, expected) => {
    authMock.mockResolvedValue(sessionFor(role));
    expect((await requireAdmin()).authenticated).toBe(expected);
  });

  it.each([
    ["CLIENT", false],
    ["ADMIN", false],
    ["ARTISAN", true],
  ])("requireArtisan with role %s → authenticated=%s", async (role, expected) => {
    authMock.mockResolvedValue(sessionFor(role));
    expect((await requireArtisan()).authenticated).toBe(expected);
  });

  it("role guards propagate the unauthenticated error", async () => {
    authMock.mockResolvedValue(null);
    expect(await requireAdmin()).toEqual({ authenticated: false, error: "Non authentifié" });
  });
});
