import Link from "next/link";
import { notFound } from "next/navigation";
import { orderRepository } from "@/lib/repositories/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderStatusUpdateForm } from "@/components/admin/OrderStatusUpdateForm";
import { Separator } from "@/components/ui/separator";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await orderRepository.findById(id);

  if (!order) notFound();

  const clientName = [order.client.firstName, order.client.name]
    .filter(Boolean)
    .join(" ");

  const formatCurrency = (value: number | { toNumber?: () => number }) => {
    const num = typeof value === "number" ? value : Number(value);
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(num);
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Commande {order.id.slice(0, 8)}...
          </h1>
          <div className="mt-2 flex items-center gap-3">
            <OrderStatusBadge status={order.status} />
            <span className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>
        <OrderStatusUpdateForm
          orderId={order.id}
          currentStatus={order.status}
        />
      </div>

      <Separator className="my-6" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>
              <Link
                href={`/admin/users/${order.client.id}`}
                className="font-medium hover:underline"
              >
                {clientName || order.client.email}
              </Link>
            </p>
            <p className="text-muted-foreground">{order.client.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Livraison
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="whitespace-pre-wrap">
              {order.shippingAddress ?? "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mt-8 text-lg font-semibold">Articles</h2>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Produit</TableHead>
            <TableHead>Artisan</TableHead>
            <TableHead>Prix unitaire</TableHead>
            <TableHead>Quantite</TableHead>
            <TableHead className="text-right">Sous-total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Link
                  href={`/products/${item.product.id}`}
                  className="font-medium hover:underline"
                >
                  {item.product.name}
                </Link>
              </TableCell>
              <TableCell className="text-sm">
                <Link
                  href={`/admin/users/${item.product.artisan.id}`}
                  className="hover:underline"
                >
                  {[item.product.artisan.firstName, item.product.artisan.name]
                    .filter(Boolean)
                    .join(" ")}
                </Link>
              </TableCell>
              <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(Number(item.unitPrice) * item.quantity)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-end">
        <p className="text-lg font-bold">
          Total : {formatCurrency(order.totalAmount)}
        </p>
      </div>
    </>
  );
}
