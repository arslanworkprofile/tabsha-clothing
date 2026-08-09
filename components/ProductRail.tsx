import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

export default function ProductRail({
  title,
  viewAllHref,
  products,
}: {
  title: string;
  viewAllHref: string;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 md:px-8 py-16">
      <div className="flex items-end justify-between mb-8">
        <h2 className="font-heading text-2xl md:text-3xl font-bold">{title}</h2>
        <Link href={viewAllHref} className="text-sm underline underline-offset-4 hover:opacity-60">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
        {products.map((p, i) => (
          <ProductCard key={p._id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
