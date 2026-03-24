"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  updateUserStatus,
  updateUserRole,
} from "@/app/actions/admin";

interface UserActionsProps {
  userId: string;
  currentStatus: string;
  currentRole: string;
}

export function UserActions({
  userId,
  currentStatus,
  currentRole,
}: UserActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusToggle() {
    setPending(true);
    setError(null);
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const result = await updateUserStatus(
      userId,
      newStatus as import("@/generated/prisma/client").UserStatus
    );
    setPending(false);
    if (!result.success) {
      setError(result.error);
    } else {
      router.refresh();
    }
  }

  async function handleRoleChange(role: string) {
    setPending(true);
    setError(null);
    const result = await updateUserRole(
      userId,
      role as import("@/generated/prisma/client").UserRole
    );
    setPending(false);
    if (!result.success) {
      setError(result.error);
    } else {
      router.refresh();
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        variant={currentStatus === "ACTIVE" ? "destructive" : "default"}
        onClick={handleStatusToggle}
        disabled={pending}
      >
        {currentStatus === "ACTIVE" ? "Suspendre" : "Activer"}
      </Button>

      {currentRole !== "ADMIN" && (
        <select
          value={currentRole}
          onChange={(e) => handleRoleChange(e.target.value)}
          disabled={pending}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="CLIENT">Client</option>
          <option value="ARTISAN">Artisan</option>
        </select>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
