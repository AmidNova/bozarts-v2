import Link from "next/link";
import { Suspense } from "react";
import { orderRepository } from "@/lib/repositories/order";
import { OrderFilterSchema } from "@/lib/schemas/order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderStatusFilter } from "@/components/orders/OrderStatusFilter";
import { Pagination } from "@/components/products/Pagination";

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Commandes</h1>
          <p className="mt-1 text-muted-foreground">{total} commande{total > 1 ? "s" : ""}</p>
        </div>
        <Suspense>
          <OrderStatusFilter />
        </Suspense>
      </div>

      {orders.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          Aucune commande trouvee.
        </p>
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
              {orders.map((order) => {
                const clientName = [order.client.firstName, order.client.name]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/users/${order.client.id}`}
                        className="hover:underline"
                      >
                        {clientName || order.client.email}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {order.items.length} article
                      {order.items.length > 1 ? "s" : ""}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(Number(order.totalAmount))}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
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
