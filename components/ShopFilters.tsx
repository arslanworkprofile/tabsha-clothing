"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const SIZES = ["XS", "S", "M", "L", "XL", "One Size"];
const COLORS = ["Ash Grey", "Black", "White"];
const SORTS: { value: string; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popularity", label: "Popularity" },
];

export default function ShopFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || params.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams]
  );

  const active = (key: string, value: string) => searchParams.get(key) === value;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold mb-3">Sort by</h3>
        <select
          className="w-full rounded-xl border border-ash/15 bg-white px-3 py-2.5 text-sm"
          value={searchParams.get("sort") ?? "newest"}
          onChange={(e) => setParam("sort", e.target.value)}
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Gender</h3>
        <div className="flex flex-wrap gap-2">
          {["men", "women", "unisex"].map((g) => (
            <button
              key={g}
              onClick={() => setParam("gender", g)}
              className={`rounded-full border px-4 py-1.5 text-xs capitalize transition-colors ${
                active("gender", g) ? "bg-ash text-white border-ash" : "border-ash/20 hover:border-ash/50"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Category</h3>
        <div className="flex flex-wrap gap-2">
          {["clothing", "accessories"].map((c) => (
            <button
              key={c}
              onClick={() => setParam("category", c)}
              className={`rounded-full border px-4 py-1.5 text-xs capitalize transition-colors ${
                active("category", c) ? "bg-ash text-white border-ash" : "border-ash/20 hover:border-ash/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setParam("size", s)}
              className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                active("size", s) ? "bg-ash text-white border-ash" : "border-ash/20 hover:border-ash/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Color</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setParam("color", c)}
              className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                active("color", c) ? "bg-ash text-white border-ash" : "border-ash/20 hover:border-ash/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => router.push("/shop")} className="text-xs underline underline-offset-4 text-ash/60">
        Clear all filters
      </button>
    </div>
  );
}
