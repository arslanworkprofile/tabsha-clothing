"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Men", href: "/shop?gender=men" },
  { label: "Women", href: "/shop?gender=women" },
  { label: "Accessories", href: "/shop?category=accessories" },
  { label: "New Arrivals", href: "/shop?sort=newest" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const openCart = useCartStore((s) => s.openCart);
  const count = useCartStore((s) => s.count());

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex h-20 items-center justify-between">
          <button
            className="md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ash text-paper font-heading text-sm font-bold">
              T
            </span>
            <span className="font-heading text-lg md:text-xl font-bold tracking-widest2 uppercase hidden sm:inline">
              Tabsha
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-9">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group relative text-sm font-medium tracking-wide"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-ash transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button aria-label="Search" className="hidden sm:inline-flex hover:opacity-60 transition-opacity">
              <Search size={20} />
            </button>
            <Link href="/dashboard/wishlist" aria-label="Wishlist" className="hidden sm:inline-flex hover:opacity-60 transition-opacity">
              <Heart size={20} />
            </Link>
            <Link href="/login" aria-label="Account" className="hidden sm:inline-flex hover:opacity-60 transition-opacity">
              <User size={20} />
            </Link>
            <button aria-label="Open cart" onClick={openCart} className="relative hover:opacity-60 transition-opacity">
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-ash text-[10px] text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden transition-[max-height] duration-300 border-t border-ash/10 bg-paper",
          menuOpen ? "max-h-80" : "max-h-0"
        )}
      >
        <nav className="flex flex-col px-5 py-4 gap-4">
          {NAV.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm font-medium" onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
