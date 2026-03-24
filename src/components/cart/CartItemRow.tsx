"use client";

import { useActionState } from "react";
import { updateCartQuantity, removeFromCart } from "@/app/actions/cart";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";

interface CartItemRowProps {
  item: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: string | number;
      imageUrl: string | null;
      artisan: {
        name: string | null;
        firstName: string | null;
      };
    };
  };
}

export function CartItemRow({ item }: CartItemRowProps) {
  const price = Number(item.product.price);
  const displayName = [item.product.artisan.firstName, item.product.artisan.name]
    .filter(Boolean)
    .join(" ");

  const [, updateAction, updatingQty] = useActionState(
    async (_prev: ActionResult<void> | null, formData: FormData) => {
      return updateCartQuantity(formData);
    },
    null
  );

  const [removeState, removeAction, removing] = useActionState(
    async (_prev: ActionResult<void> | null, formData: FormData) => {
      return removeFromCart(formData);
    },
    null
  );

  return (
    <div className="flex items-center gap-4 border-b py-4 last:border-0">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        {item.product.imageUrl ? (
          <img
            src={item.product.imageUrl}
            alt={item.product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Pas d&apos;image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <h3 className="font-medium">{item.product.name}</h3>
        <p className="text-xs text-muted-foreground">par {displayName}</p>
        <p className="text-sm font-semibold">{price.toFixed(2)}&nbsp;&euro;</p>
      </div>

      <div className="flex items-center gap-2">
        <form action={updateAction}>
          <input type="hidden" name="cartItemId" value={item.id} />
          <input
            type="hidden"
            name="quantity"
            value={Math.max(1, item.quantity - 1)}
          />
          <Button
            type="submit"
            variant="outline"
            size="icon-xs"
            disabled={updatingQty || item.quantity <= 1}
          >
            -
          </Button>
        </form>

        <span className="w-8 text-center text-sm">{item.quantity}</span>

        <form action={updateAction}>
          <input type="hidden" name="cartItemId" value={item.id} />
          <input type="hidden" name="quantity" value={item.quantity + 1} />
          <Button
            type="submit"
            variant="outline"
            size="icon-xs"
            disabled={updatingQty || item.quantity >= 99}
          >
            +
          </Button>
        </form>
      </div>

      <div className="w-20 text-right text-sm font-semibold">
        {(price * item.quantity).toFixed(2)}&nbsp;&euro;
      </div>

      <form action={removeAction}>
        <input type="hidden" name="cartItemId" value={item.id} />
        <Button
          type="submit"
          variant="destructive"
          size="icon-xs"
          disabled={removing}
        >
          &times;
        </Button>
      </form>

      {removeState && !removeState.success && (
        <p className="text-xs text-destructive">{removeState.error}</p>
      )}
    </div>
  );
}
