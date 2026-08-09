import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  {
    label: "Men",
    copy: "Structured tailoring, weekday essentials.",
    href: "/shop?gender=men",
    tone: "from-ash-dark via-ash to-ash-light",
  },
  {
    label: "Women",
    copy: "Draped silhouettes, considered detail.",
    href: "/shop?gender=women",
    tone: "from-ash via-ash-light to-cloud",
  },
  {
    label: "Accessories",
    copy: "The finishing pieces, made to last.",
    href: "/shop?category=accessories",
    tone: "from-ink via-ash-dark to-ash",
  },
];

export default function CategoryGrid() {
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
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.label}
            href={cat.href}
            className={`group relative aspect-[3/4] overflow-hidden rounded-3xl bg-gradient-to-br ${cat.tone} flex flex-col justify-end p-7 shadow-soft`}
          >
            <div className="absolute inset-0 grain opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent transition-opacity group-hover:opacity-90" />
            <div className="relative">
              <span className="font-heading text-2xl font-bold text-white tracking-tight block">
                {cat.label}
              </span>
              <p className="text-xs text-white/60 mt-1.5 max-w-[85%]">{cat.copy}</p>
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
