import Link from "next/link";
import { Suspense } from "react";
import { orderRepository } from "@/lib/repositories/order";
import { OrderFilterSchema } from "@/lib/schemas/order";
import { formatCurrency, formatDate, formatFullName, pluralize } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/ui/StatusBadge";
import { OrderStatusFilter } from "@/components/orders/OrderStatusFilter";
import { Pagination } from "@/components/products/Pagination";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const raw = await searchParams;
  const filters = OrderFilterSchema.parse(raw);
  const { orders, page, totalPages, total } =
    await orderRepository.findAllForAdmin(filters);

  return (
    <>
      <PageHeader
        title="Commandes"
        subtitle={pluralize(total, "commande")}
        actions={<Suspense><OrderStatusFilter /></Suspense>}
      />

      {orders.length === 0 ? (
        <EmptyState message="Aucune commande trouvee." />
      ) : (
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">
                    {order.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/users/${order.client.id}`}
                      className="hover:underline"
                    >
                      {formatFullName(order.client.firstName, order.client.name) ||
                        order.client.email}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {pluralize(order.items.length, "article")}
                  </TableCell>
                  <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                  <TableCell>
                    <OrderStatusBadge value={order.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      render={<Link href={`/admin/orders/${order.id}`} />}
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
