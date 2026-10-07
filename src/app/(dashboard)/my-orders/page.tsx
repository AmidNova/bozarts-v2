import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { orderRepository } from "@/lib/repositories/order";
import { OrderFilterSchema } from "@/lib/schemas/order";
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
import { OrderStatusBadge } from "@/components/ui/StatusBadge";
import { OrderStatusFilter } from "@/components/orders/OrderStatusFilter";
import { UpdateStatusForm } from "@/components/orders/UpdateStatusForm";
import { Pagination } from "@/components/products/Pagination";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MyOrdersPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ARTISAN") {
    redirect("/");
  }

  const raw = await searchParams;
  const filters = OrderFilterSchema.parse(raw);
  const { orders, page, totalPages } = await orderRepository.findByArtisanId(
    session.user.id,
    filters
  );

  return (
    <>
      <PageHeader
        title="Commandes recues"
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
                <TableHead>Date</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>Statut</TableHead>
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
                    {formatFullName(order.client.firstName, order.client.name) ||
                      order.client.email}
                  </TableCell>
                  <TableCell>
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    {pluralize(order.items.length, "article")}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge value={order.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <UpdateStatusForm
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        render={<Link href={`/my-orders/${order.id}`} />}
                      >
                        Details
                      </Button>
                    </div>
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
