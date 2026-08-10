import { notFound } from "next/navigation";
import AdminProductForm from "@/components/AdminProductForm";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([productService.getById(id), categoryService.list()]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-8">Edit Product</h1>
      <AdminProductForm product={product} categories={categories} />
    </div>
  );
}
