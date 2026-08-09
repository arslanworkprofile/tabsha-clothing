"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatPKR } from "@/lib/utils";

// Phase 1: order summary + Cash on Delivery only, no payment gateway wired yet.
// Phase 2 adds Stripe/Razorpay/EasyPaisa/JazzCash, address book, and order persistence.
export default function CheckoutPage() {
  const { items, subtotal, clear } = useCartStore();

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Order placed (demo). Wire this to /api/orders once the Order model and payment gateway are added.");
    clear();
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold mb-3">Nothing to check out</h1>
        <Link href="/shop" className="rounded-full bg-ash px-8 py-3 text-sm font-medium text-white">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 md:px-8 py-12 grid grid-cols-1 md:grid-cols-[1fr_360px] gap-12">
      <form onSubmit={handlePlaceOrder} className="space-y-8">
        <section>
          <h2 className="font-heading text-xl font-bold mb-4">Contact & Shipping</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input required placeholder="Full name" className="input" />
            <input required type="email" placeholder="Email" className="input" />
            <input required placeholder="Phone" className="input" />
            <input required placeholder="City" className="input" />
            <input required placeholder="Address" className="input sm:col-span-2" />
          </div>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold mb-4">Payment Method</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-3 rounded-xl border border-ash/15 px-4 py-3 text-sm">
              <input type="radio" name="payment" defaultChecked /> Cash on Delivery
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-ash/10 px-4 py-3 text-sm text-ash/40">
              <input type="radio" name="payment" disabled /> Card (Stripe) — coming in Phase 2
            </label>
          </div>
        </section>

        <button type="submit" className="rounded-full bg-ash px-8 py-3.5 text-sm font-medium text-white">
          Place Order
        </button>
      </form>

      <aside className="rounded-2xl border border-ash/10 p-6 h-fit">
        <h3 className="font-heading font-semibold mb-4">Order Summary</h3>
        <div className="space-y-3 text-sm">
          {items.map((item) => (
            <div key={`${item.productId}-${item.color}-${item.size}`} className="flex justify-between">
              <span className="text-ash/60">
                {item.name} × {item.quantity}
              </span>
              <span>{formatPKR(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-ash/10 mt-4 pt-4 flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPKR(subtotal())}</span>
        </div>
      </aside>
    </div>
  );
}
