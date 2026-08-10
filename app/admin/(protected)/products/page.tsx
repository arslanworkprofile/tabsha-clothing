import Link from "next/link";
import Image from "next/image";
import { productService } from "@/services/productService";
import { formatPKR } from "@/lib/utils";
import AdminProductRowActions from "@/components/AdminProductRowActions";

// See note in categories/page.tsx — reads the DB directly with no dynamic API, so it
// needs force-dynamic to avoid getting frozen as a build-time static snapshot.
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const { items } = await productService.list({ limit: 500 });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl font-bold">Products ({items.length})</h1>
        <Link href="/admin/products/new" className="rounded-full bg-ash px-5 py-2.5 text-sm font-medium text-white">
          Add Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ash/10">
        <table className="w-full text-sm">
          <thead className="bg-cloud text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Flags</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id} className="border-t border-ash/10">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-10 rounded-lg overflow-hidden bg-cloud shrink-0">
                      <Image src={p.images[0]?.url ?? "/uploads/placeholder.svg"} alt={p.name} fill className="object-cover" />
                    </div>
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ash/60">{p.sku}</td>
                <td className="px-4 py-3 capitalize text-ash/60">
                  {p.category} · {p.gender}
                </td>
                <td className="px-4 py-3">{formatPKR(p.discountPrice ?? p.price)}</td>
                <td className="px-4 py-3">
                  <span className={p.stock === 0 ? "text-red-600" : ""}>{p.stock}</span>
                </td>
                <td className="px-4 py-3 text-xs text-ash/50 space-x-1">
                  {p.isFeatured && <span>Featured</span>}
                  {p.isBestSeller && <span>· Best Seller</span>}
                  {p.isTrending && <span>· Trending</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <AdminProductRowActions id={p._id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <p className="text-center text-sm text-ash/50 py-12">No products yet — add your first one.</p>
        )}
      </div>
    </div>
  );
}
