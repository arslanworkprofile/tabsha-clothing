"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatPKR } from "@/lib/utils";

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, subtotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-paper shadow-lift flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-ash/10">
              <h2 className="font-heading font-semibold text-lg">Your Bag ({items.length})</h2>
              <button aria-label="Close cart" onClick={closeCart}>
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {items.length === 0 && (
                <p className="text-sm text-ash/60 py-12 text-center">
                  Your bag is empty. Find something you'll want to keep.
                </p>
              )}
              {items.map((item) => (
                <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-4">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-cloud">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <Link href={`/product/${item.slug}`} className="text-sm font-medium hover:underline">
                        {item.name}
                      </Link>
                      <button
                        aria-label="Remove item"
                        onClick={() => removeItem(item.productId, item.color, item.size)}
                        className="text-ash/40 hover:text-ash"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-ash/50 mt-1">
                      {[item.color, item.size].filter(Boolean).join(" / ")}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3 rounded-full border border-ash/15 px-3 py-1">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">{formatPKR(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <div className="border-t border-ash/10 px-6 py-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-ash/60">Subtotal</span>
                  <span className="font-semibold">{formatPKR(subtotal())}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full rounded-full bg-ash py-3.5 text-center text-sm font-medium text-white hover:bg-ash-dark transition-colors"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
