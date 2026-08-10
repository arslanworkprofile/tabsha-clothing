import { notFound } from "next/navigation";
import AdminCategoryForm from "@/components/AdminCategoryForm";
import { categoryService } from "@/services/categoryService";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await categoryService.getById(id);
  if (!category) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-8">Edit Category</h1>
      <AdminCategoryForm category={category} />
    </div>
  );
}
