import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { orderRepository } from "@/lib/repositories/order";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { UpdateStatusForm } from "@/components/orders/UpdateStatusForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MyOrderDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ARTISAN") {
    redirect("/");
  }

  const { id } = await params;
  const order = await orderRepository.findById(id);

  if (!order) {
    notFound();
  }

  // Verify this artisan has products in this order
  const artisanItems = order.items.filter(
    (item) => item.product.artisan.id === session.user!.id
  );
  if (artisanItems.length === 0) {
    notFound();
  }

  const clientName = [order.client.firstName, order.client.name]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" render={<Link href="/my-orders" />}>
          &larr; Retour
        </Button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Commande #{order.id.slice(0, 8)}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Recue le{" "}
            {new Date(order.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <UpdateStatusForm orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="font-semibold">Client</h2>
          <p className="mt-1 text-sm">{clientName || order.client.email}</p>
          <p className="text-sm text-muted-foreground">{order.client.email}</p>
        </div>
        <div>
          <h2 className="font-semibold">Adresse de livraison</h2>
          <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
            {order.shippingAddress}
          </p>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        <h2 className="font-semibold">Vos articles dans cette commande</h2>
        {artisanItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-lg border p-3"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
              {item.product.imageUrl ? (
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  —
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.product.name}</p>
            </div>
            <div className="text-right text-sm">
              <p>
                {item.quantity} &times;{" "}
                {Number(item.unitPrice).toFixed(2)}&nbsp;&euro;
              </p>
              <p className="font-semibold">
                {(item.quantity * Number(item.unitPrice)).toFixed(2)}&nbsp;&euro;
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
