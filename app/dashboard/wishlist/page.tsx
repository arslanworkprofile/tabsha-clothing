import ProductCard from "@/components/ProductCard";
import { productService } from "@/services/productService";

// Phase 1: shows a sample of products as a placeholder for a real per-user
// wishlist, which needs auth + a Wishlist model to persist (Phase 2).
export default async function WishlistPage() {
  const { items } = await productService.list({ limit: 4 });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-2">Wishlist</h1>
      <p className="text-sm text-ash/50 mb-8">
        Sample items shown below — persistent per-user wishlists arrive with auth in Phase 2.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
        {items.map((p, i) => (
          <ProductCard key={p._id} product={p} index={i} />
        ))}
      </div>
    </div>
  );
}
