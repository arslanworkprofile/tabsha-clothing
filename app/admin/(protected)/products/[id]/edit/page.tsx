import { notFound } from "next/navigation";
import AdminProductForm from "@/components/AdminProductForm";
import { productService } from "@/services/productService";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await productService.getById(id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-8">Edit Product</h1>
      <AdminProductForm product={product} />
    </div>
  );
}
