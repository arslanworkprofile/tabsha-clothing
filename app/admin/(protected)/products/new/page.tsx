import AdminProductForm from "@/components/AdminProductForm";
import { categoryService } from "@/services/categoryService";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await categoryService.list();
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-8">Add Product</h1>
      <AdminProductForm categories={categories} />
    </div>
  );
}
