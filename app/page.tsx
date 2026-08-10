import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import ProductRail from "@/components/ProductRail";
import Testimonials from "@/components/Testimonials";
import { productService } from "@/services/productService";

// Reads the DB directly with no dynamic API in play, so without this Next.js would
// prerender it once at build time and freeze it — new/edited products wouldn't show up
// on the storefront until the next deploy.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ items: newArrivals }, { items: trending }, { items: bestSellers }] = await Promise.all([
    productService.list({ sort: "newest", limit: 8 }),
    productService.list({ sort: "popularity", limit: 8 }),
    productService.list({ limit: 8 }),
  ]);

  return (
    <>
      <Hero />
      <CategoryGrid />
      <ProductRail title="New Arrivals" viewAllHref="/shop?sort=newest" products={newArrivals} />
      <ProductRail title="Trending Now" viewAllHref="/shop?sort=popularity" products={trending} />
      <ProductRail
        title="Best Sellers"
        viewAllHref="/shop"
        products={bestSellers.filter((p) => p.isBestSeller)}
      />
      <Testimonials />
    </>
  );
}
