"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatPKR } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold mb-3">Your bag is empty</h1>
        <p className="text-sm text-ash/50 mb-8">Find something you'll want to keep.</p>
        <Link href="/shop" className="rounded-full bg-ash px-8 py-3 text-sm font-medium text-white">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 md:px-8 py-12">
      <h1 className="font-heading text-3xl font-bold mb-8">Your Bag</h1>
      <div className="space-y-6">
        {items.map((item) => (
          <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-5 border-b border-ash/10 pb-6">
            <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-cloud">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <Link href={`/product/${item.slug}`} className="font-medium hover:underline">
                  {item.name}
                </Link>
                <span className="font-semibold">{formatPKR(item.price * item.quantity)}</span>
              </div>
              <p className="text-xs text-ash/50 mt-1">{[item.color, item.size].filter(Boolean).join(" / ")}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-3 rounded-full border border-ash/15 px-3 py-1">
                  <button onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)}>
                    -
                  </button>
                  <span className="text-sm w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.productId, item.color, item.size)}
                  className="text-xs text-ash/50 underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <span className="text-ash/60">Subtotal</span>
        <span className="text-xl font-semibold">{formatPKR(subtotal())}</span>
      </div>
      <Link
        href="/checkout"
        className="mt-6 block w-full rounded-full bg-ash py-4 text-center text-sm font-medium text-white hover:bg-ash-dark transition-colors"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
