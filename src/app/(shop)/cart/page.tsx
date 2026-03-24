import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { cartRepository } from "@/lib/repositories/cart";
import { userRepository } from "@/lib/repositories/user";
import { Button } from "@/components/ui/button";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CheckoutForm } from "@/components/cart/CheckoutForm";

export default async function CartPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const cart = await cartRepository.findByUserId(session.user.id);
  const user = await userRepository.findById(session.user.id);

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Panier</h1>
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">Votre panier est vide.</p>
          <Button className="mt-4" render={<Link href="/products" />}>
            Decouvrir les produits
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Panier</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {cart.items.map((item) => (
            <CartItemRow
              key={item.id}
              item={{
                id: item.id,
                quantity: item.quantity,
                product: {
                  id: item.product.id,
                  name: item.product.name,
                  price: item.product.price.toString(),
                  imageUrl: item.product.imageUrl,
                  artisan: item.product.artisan,
                },
              }}
            />
          ))}
        </div>

        <div>
          <CheckoutForm
            defaultAddress={user?.address}
            subtotal={cart.subtotal}
            shippingFee={cart.shippingFee}
            total={cart.total}
          />
        </div>
      </div>
    </div>
  );
}
