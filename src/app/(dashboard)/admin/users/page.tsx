import Link from "next/link";
import { Suspense } from "react";
import { userRepository } from "@/lib/repositories/user";
import { AdminUserFilterSchema } from "@/lib/schemas/admin";
import { formatDate, formatFullName, pluralize } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserRoleBadge, UserStatusBadge } from "@/components/ui/StatusBadge";
import { AdminUserFilter } from "@/components/admin/AdminUserFilter";
import { Pagination } from "@/components/products/Pagination";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

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
      <PageHeader
        title="Utilisateurs"
        subtitle={pluralize(total, "utilisateur")}
        actions={<Suspense><AdminUserFilter /></Suspense>}
      />

      {users.length === 0 ? (
        <EmptyState message="Aucun utilisateur trouve." />
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
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {formatFullName(user.firstName, user.name) || "-"}
                  </TableCell>
                  <TableCell className="text-sm">{user.email}</TableCell>
                  <TableCell>
                    <UserRoleBadge value={user.role} />
                  </TableCell>
                  <TableCell>
                    <UserStatusBadge value={user.status} />
                  </TableCell>
                  <TableCell>{user._count.products}</TableCell>
                  <TableCell>{user._count.orders}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(user.createdAt)}
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
              ))}
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
