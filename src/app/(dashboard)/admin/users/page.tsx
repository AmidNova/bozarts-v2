import Link from "next/link";
import { Suspense } from "react";
import { userRepository } from "@/lib/repositories/user";
import { AdminUserFilterSchema } from "@/lib/schemas/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserRoleBadge } from "@/components/admin/UserRoleBadge";
import { UserStatusBadge } from "@/components/admin/UserStatusBadge";
import { AdminUserFilter } from "@/components/admin/AdminUserFilter";
import { Pagination } from "@/components/products/Pagination";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const raw = await searchParams;
  const filters = AdminUserFilterSchema.parse(raw);
  const { users, page, totalPages, total } =
    await userRepository.findAllForAdmin(filters);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="mt-1 text-muted-foreground">{total} utilisateur{total > 1 ? "s" : ""}</p>
        </div>
        <Suspense>
          <AdminUserFilter />
        </Suspense>
      </div>

      {users.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          Aucun utilisateur trouve.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Produits</TableHead>
                <TableHead>Commandes</TableHead>
                <TableHead>Inscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const name = [user.firstName, user.name]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {name || "-"}
                    </TableCell>
                    <TableCell className="text-sm">{user.email}</TableCell>
                    <TableCell>
                      <UserRoleBadge role={user.role} />
                    </TableCell>
                    <TableCell>
                      <UserStatusBadge status={user.status} />
                    </TableCell>
                    <TableCell>{user._count.products}</TableCell>
                    <TableCell>{user._count.orders}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        render={<Link href={`/admin/users/${user.id}`} />}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Suspense>
            <Pagination currentPage={page} totalPages={totalPages} />
          </Suspense>
        </div>
      )}
    </>
  );
}
