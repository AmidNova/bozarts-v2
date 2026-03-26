import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { orderRepository } from "@/lib/repositories/order";
import { formatCurrency, formatDate, formatFullName } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge } from "@/components/ui/StatusBadge";
import { CancelOrderButton } from "@/components/orders/CancelOrderButton";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const order = await orderRepository.findById(id);

  if (!order || order.clientId !== session.user.id) {
    notFound();
  }

  const canCancel =
    order.status === "PENDING" || order.status === "CONFIRMED";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" render={<Link href="/orders" />}>
          &larr; Retour
        </Button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Commande #{order.id.slice(0, 8)}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Passee le {formatDate(order.createdAt, "long")}
          </p>
        </div>
        <OrderStatusBadge value={order.status} />
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        <h2 className="font-semibold">Articles</h2>
        {order.items.map((item) => (
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
              <Link
                href={`/products/${item.product.id}`}
                className="font-medium hover:underline"
              >
                {item.product.name}
              </Link>
              <p className="text-xs text-muted-foreground">
                par {formatFullName(item.product.artisan.firstName, item.product.artisan.name)}
              </p>
            </div>
            <div className="text-right text-sm">
              <p>
                {item.quantity} &times; {formatCurrency(item.unitPrice)}
              </p>
              <p className="font-semibold">
                {formatCurrency(item.quantity * Number(item.unitPrice))}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="font-semibold">Adresse de livraison</h2>
          <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
            {order.shippingAddress}
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <h2 className="font-semibold text-base">Total</h2>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="font-semibold">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {canCancel && (
        <div className="mt-8">
          <CancelOrderButton orderId={order.id} />
        </div>
      )}
    </div>
  );
}
