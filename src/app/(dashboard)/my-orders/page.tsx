import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
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
import { UpdateStatusForm } from "@/components/orders/UpdateStatusForm";
import { Pagination } from "@/components/products/Pagination";

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Commandes recues</h1>
        <Suspense>
          <OrderStatusFilter />
        </Suspense>
      </div>

      {orders.length === 0 ? (
        <div className="mt-8 text-center text-muted-foreground">
          <p>Aucune commande trouvee.</p>
        </div>
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
              {orders.map((order) => {
                const clientName = [order.client.firstName, order.client.name]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>{clientName || order.client.email}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      {order.items.length} article
                      {order.items.length > 1 ? "s" : ""}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
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
