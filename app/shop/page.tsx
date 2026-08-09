import ShopFilters from "@/components/ShopFilters";
import ProductCard from "@/components/ProductCard";
import { productService } from "@/services/productService";
import type { ProductFilters } from "@/types/product";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ShopPage({ searchParams: searchParamsPromise }: PageProps) {
  const searchParams = await searchParamsPromise;
  const filters: ProductFilters = {
    category: searchParams.category as ProductFilters["category"],
    gender: searchParams.gender as ProductFilters["gender"],
    size: searchParams.size,
    color: searchParams.color,
    brand: searchParams.brand,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    search: searchParams.search,
    sort: (searchParams.sort as ProductFilters["sort"]) ?? "newest",
    page: searchParams.page ? Number(searchParams.page) : 1,
    limit: 12,
  };

  const { items, total } = await productService.list(filters);

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 py-12">
      <div className="mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold">Shop</h1>
        <p className="text-sm text-ash/50 mt-2">{total} pieces</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10">
        <aside className="md:sticky md:top-28 h-fit">
          <ShopFilters />
        </aside>

        <div>
          {items.length === 0 ? (
            <p className="py-24 text-center text-sm text-ash/50">
              No pieces match those filters yet. Try clearing a few.
            </p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
              {items.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
