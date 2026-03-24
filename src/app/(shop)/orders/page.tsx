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
import { Pagination } from "@/components/products/Pagination";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function OrdersPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const raw = await searchParams;
  const filters = OrderFilterSchema.parse(raw);
  const { orders, page, totalPages } = await orderRepository.findByClientId(
    session.user.id,
    filters
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Mes commandes</h1>
        <Suspense>
          <OrderStatusFilter />
        </Suspense>
      </div>

      {orders.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">Aucune commande trouvee.</p>
          <Button className="mt-4" render={<Link href="/products" />}>
            Decouvrir les produits
          </Button>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commande</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>Total</TableHead>
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
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    {order.items.length} article{order.items.length > 1 ? "s" : ""}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {Number(order.totalAmount).toFixed(2)}&nbsp;&euro;
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      render={<Link href={`/orders/${order.id}`} />}
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
    </div>
  );
}
