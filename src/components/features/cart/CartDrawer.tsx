"use client";

import { Drawer } from "@/components/ui/Drawer";
import { useUIStore } from "@/store/useUIStore";
import {
  useCart,
  useUpdateCartItem,
  useRemoveFromCart,
} from "@/services/queries/cartQueries";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

export function CartDrawer() {
  const { cartDrawerOpen, closeCartDrawer } = useUIStore();
  const { data: cart } = useCart();
  const updateQuantity = useUpdateCartItem();
  const removeItem = useRemoveFromCart();

  return (
    <Drawer
      isOpen={cartDrawerOpen}
      onClose={closeCartDrawer}
      title="Shopping Cart"
      position="right"
    >
      {cart && cart.items.length > 0 ? (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.product.slug}`}
                    onClick={closeCartDrawer}
                    className="font-medium hover:text-primary line-clamp-2"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      updateQuantity.mutate({
                        itemId: item.id,
                        quantity: item.quantity - 1,
                      })
                    }
                    className="w-6 h-6 border rounded flex items-center justify-center text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity.mutate({
                        itemId: item.id,
                        quantity: item.quantity + 1,
                      })
                    }
                    className="w-6 h-6 border rounded flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem.mutate(item.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span className="font-semibold">
                {formatCurrency(cart.subtotal)}
              </span>
            </div>
            {cart.discount > 0 && (
              <div className="flex justify-between text-green-600 mb-2">
                <span>Discount</span>
                <span>-{formatCurrency(cart.discount)}</span>
              </div>
            )}
            <div className="flex justify-between mb-4">
              <span>Delivery</span>
              <span>{formatCurrency(cart.delivery)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Total</span>
              <span>{formatCurrency(cart.total)}</span>
            </div>
            <Link href="/user/cart" onClick={closeCartDrawer}>
              <Button className="w-full">View Cart</Button>
            </Link>
            <Link href="/user/checkout" onClick={closeCartDrawer}>
              <Button variant="secondary" className="w-full mt-2">
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link href="/products">
            <Button onClick={closeCartDrawer}>Continue Shopping</Button>
          </Link>
        </div>
      )}
    </Drawer>
  );
}
