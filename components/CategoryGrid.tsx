import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/types/category";

const TONES = ["from-ash-dark via-ash to-ash-light", "from-ash via-ash-light to-cloud", "from-ink via-ash-dark to-ash"];

// Categories aren't linked to products by id in this app (products use a fixed
// clothing/accessories field plus gender), so we map a few well-known slugs to the shop
// filters that already exist. Anything else falls back to a plain /shop link.
function hrefForSlug(slug: string): string {
  if (slug === "men" || slug === "women") return `/shop?gender=${slug}`;
  if (slug === "accessories") return "/shop?category=accessories";
  return "/shop";
}

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-28">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs tracking-widest2 uppercase text-ash/40 mb-3">Explore</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tightest">Shop by Category</h2>
        </div>
        <Link href="/shop" className="hidden sm:inline-flex items-center gap-1.5 text-sm underline underline-offset-4 hover:opacity-60">
          View all <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {categories.map((cat, i) => (
          <Link
            key={cat._id}
            href={hrefForSlug(cat.slug)}
            className={`group relative aspect-[3/4] overflow-hidden rounded-3xl bg-gradient-to-br ${TONES[i % TONES.length]} flex flex-col justify-end p-7 shadow-soft`}
          >
            {cat.image ? (
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            ) : (
              <div className="absolute inset-0 grain opacity-40" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent transition-opacity group-hover:opacity-90" />
            <div className="relative">
              <span className="font-heading text-2xl font-bold text-white tracking-tight block">
                {cat.name}
              </span>
              {cat.description && <p className="text-xs text-white/60 mt-1.5 max-w-[85%]">{cat.description}</p>}
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-white/80 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                Shop now <ArrowUpRight size={13} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
