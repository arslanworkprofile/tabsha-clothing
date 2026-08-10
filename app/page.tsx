import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import ProductRail from "@/components/ProductRail";
import Testimonials from "@/components/Testimonials";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { settingsService } from "@/services/settingsService";

// Reads the DB directly with no dynamic API in play, so without this Next.js would
// prerender it once at build time and freeze it — new/edited products wouldn't show up
// on the storefront until the next deploy.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ items: newArrivals }, { items: trending }, { items: bestSellers }, allCategories, settings] =
    await Promise.all([
      productService.list({ sort: "newest", limit: 8 }),
      productService.list({ sort: "popularity", limit: 8 }),
      productService.list({ limit: 8 }),
      categoryService.list(),
      settingsService.get(),
    ]);

  // Prefer categories marked "Featured on homepage" in the admin; if none are marked
  // yet, fall back to showing whatever categories exist so the section isn't empty.
  const featured = allCategories.filter((c) => c.featured);
  const homeCategories = (featured.length > 0 ? featured : allCategories).slice(0, 3);

  return (
    <>
      <Hero heroImage={settings.heroImage} />
      <CategoryGrid categories={homeCategories} />
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
