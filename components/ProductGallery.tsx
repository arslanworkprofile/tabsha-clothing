"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/product";

export default function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [{ url: "/uploads/placeholder.svg", alt: name }];

  return (
    <div className="grid grid-cols-[72px_1fr] gap-4">
      <div className="flex flex-col gap-3">
        {list.map((img, i) => (
          <button
            key={img.url + i}
            onClick={() => setActive(i)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-xl bg-cloud border-2 transition-colors",
              active === i ? "border-ash" : "border-transparent"
            )}
          >
            <Image src={img.url} alt={img.alt ?? name} fill className="object-cover" sizes="72px" />
          </button>
        ))}
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-cloud group">
        <Image
          src={list[active].url}
          alt={list[active].alt ?? name}
          fill
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
