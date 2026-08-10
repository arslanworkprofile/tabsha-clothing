import Link from "next/link";
import Image from "next/image";
import { categoryService } from "@/services/categoryService";
import AdminCategoryRowActions from "@/components/AdminCategoryRowActions";

// This page reads straight from the database with no dynamic API (cookies/searchParams)
// in play, so without this Next.js will prerender it once at build time and keep serving
// that frozen snapshot to every visitor — new categories added afterward wouldn't show
// up. force-dynamic makes it render fresh on every request instead.
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await categoryService.list();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl font-bold">Categories ({categories.length})</h1>
        <Link href="/admin/categories/new" className="rounded-full bg-ash px-5 py-2.5 text-sm font-medium text-white">
          Add Category
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ash/10">
        <table className="w-full text-sm">
          <thead className="bg-cloud text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id} className="border-t border-ash/10">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-cloud shrink-0">
                      {c.image && <Image src={c.image} alt={c.name} fill className="object-cover" />}
                    </div>
                    <span className="font-medium">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ash/60">{c.slug}</td>
                <td className="px-4 py-3 text-ash/60">{c.featured ? "Yes" : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <AdminCategoryRowActions id={c._id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <p className="text-center text-sm text-ash/50 py-12">No categories yet — add your first one.</p>
        )}
      </div>
    </div>
  );
}
