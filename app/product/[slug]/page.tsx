import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductGallery from "@/components/ProductGallery";
import AddToCartPanel from "@/components/AddToCartPanel";
import ProductRail from "@/components/ProductRail";
import { productService } from "@/services/productService";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Tabsha Clothing Studio`,
    description: product.shortDescription || product.description.slice(0, 150),
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images.map((i) => ({ url: i.url })),
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);
  if (!product) notFound();

  const { items: related } = await productService.list({
    category: product.category,
    limit: 4,
  });

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 py-12">
      <nav className="text-xs text-ash/50 mb-8">
        <span className="capitalize">{product.category}</span> / <span className="capitalize">{product.gender}</span> /{" "}
        <span className="text-ash">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">{product.name}</h1>
          <p className="text-sm text-ash/50 mt-2">SKU: {product.sku}</p>

          <div className="mt-8">
            <AddToCartPanel product={product} />
          </div>

          <div className="mt-10 border-t border-ash/10 pt-8">
            <h2 className="text-sm font-semibold mb-3">Description</h2>
            <p className="text-sm text-ash/70 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      <ProductRail
        title="You may also like"
        viewAllHref={`/shop?category=${product.category}`}
        products={related.filter((p) => p._id !== product._id)}
      />
    </div>
  );
}
