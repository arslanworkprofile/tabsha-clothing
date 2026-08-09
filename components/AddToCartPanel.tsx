"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPKR, cn } from "@/lib/utils";
import type { Product } from "@/types/product";

export default function AddToCartPanel({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const price = product.discountPrice ?? product.price;
  const inStock = product.stock > 0;

  const handleAdd = () => {
    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.url ?? "/uploads/placeholder.svg",
      price,
      color,
      size,
      quantity: qty,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-semibold">{formatPKR(price)}</span>
          {product.discountPrice && (
            <span className="text-base text-ash/40 line-through">{formatPKR(product.price)}</span>
          )}
        </div>
        <p className={cn("text-xs mt-1", inStock ? "text-green-700" : "text-red-600")}>
          {inStock ? `In stock (${product.stock} left)` : "Out of stock"}
        </p>
      </div>

      {product.colors.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Color: {color}</h3>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs transition-colors",
                  color === c ? "bg-ash text-white border-ash" : "border-ash/20 hover:border-ash/50"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Size: {size}</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs min-w-[2.75rem] transition-colors",
                  size === s ? "bg-ash text-white border-ash" : "border-ash/20 hover:border-ash/50"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold mb-2">Quantity</h3>
        <div className="flex items-center gap-4 rounded-full border border-ash/15 px-4 py-2 w-fit">
          <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
            <Minus size={16} />
          </button>
          <span className="w-5 text-center text-sm">{qty}</span>
          <button aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={!inStock}
        className="w-full rounded-full bg-ash py-4 text-sm font-medium text-white hover:bg-ash-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {inStock ? "Add to Bag" : "Out of Stock"}
      </button>
    </div>
  );
}
