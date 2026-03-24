"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserNavProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export function UserNav({ user }: UserNavProps) {
  const initials = (user.name ?? user.email ?? "U")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="relative h-8 w-8 rounded-full" />
        }
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm">
          <p className="font-medium">{user.name ?? "Mon compte"}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/profile" />}>
          Profil
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/messages" />}>
          Messages
        </DropdownMenuItem>
        {user.role === "CLIENT" && (
          <DropdownMenuItem render={<Link href="/orders" />}>
            Mes commandes
          </DropdownMenuItem>
        )}
        {user.role === "ARTISAN" && (
          <>
            <DropdownMenuItem render={<Link href="/my-products" />}>
              Mes produits
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/my-orders" />}>
              Commandes
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/my-events" />}>
              Mes evenements
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
          Deconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
