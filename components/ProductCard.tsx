"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { formatPKR, cn } from "@/lib/utils";
import type { Product } from "@/types/product";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [wishlisted, setWishlisted] = useState(false);
  const primary = product.images[0]?.url ?? "/uploads/placeholder.svg";
  const secondary = product.images[1]?.url ?? primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className="group"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cloud">
          <Image
            src={primary}
            alt={product.images[0]?.alt ?? product.name}
            fill
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <Image
            src={secondary}
            alt={product.name}
            fill
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {product.discountPrice && (
            <span className="absolute left-3 top-3 rounded-full bg-ash px-3 py-1 text-[11px] font-medium text-white">
              -{Math.round((1 - product.discountPrice / product.price) * 100)}%
            </span>
          )}

          <button
            aria-label="Toggle wishlist"
            onClick={(e) => {
              e.preventDefault();
              setWishlisted((v) => !v);
            }}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur transition-transform active:scale-90"
          >
            <Heart size={16} className={cn(wishlisted ? "fill-ash text-ash" : "text-ash")} />
          </button>
        </div>

        <div className="mt-3.5 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-medium group-hover:underline underline-offset-4">{product.name}</h3>
            <p className="text-xs text-ash/45 capitalize mt-1 tracking-wide">
              {product.gender} <span className="mx-1 text-ash/25">/</span> {product.category}
            </p>
          </div>
          <div className="text-right shrink-0">
            {product.discountPrice ? (
              <>
                <p className="text-sm font-semibold">{formatPKR(product.discountPrice)}</p>
                <p className="text-xs text-ash/40 line-through">{formatPKR(product.price)}</p>
              </>
            ) : (
              <p className="text-sm font-semibold">{formatPKR(product.price)}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
