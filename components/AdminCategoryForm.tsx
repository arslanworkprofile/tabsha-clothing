"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import ImageUploader from "@/components/ImageUploader";
import type { Category } from "@/types/category";
import type { ProductImage } from "@/types/product";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  featured: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function AdminCategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const [images, setImages] = useState<ProductImage[]>(
    category?.image ? [{ url: category.image, alt: category.name }] : []
  );
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: category
      ? { name: category.name, description: category.description, featured: category.featured }
      : { featured: false },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setSubmitting(true);
    const payload = { ...values, image: images[0]?.url ?? "" };

    try {
      if (category) {
        await axios.put(`/api/categories/${category._id}`, payload);
      } else {
        await axios.post("/api/categories", payload);
      }
      router.push("/admin/categories");
      router.refresh();
    } catch (err: any) {
      setServerError(err.response?.data?.error ?? "Something went wrong saving the category.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-xl">
      <section>
        <h2 className="text-sm font-semibold mb-3">Category Image</h2>
        <ImageUploader images={images} onChange={(imgs) => setImages(imgs.slice(-1))} />
      </section>

      <div className="block">
        <span className="text-sm font-medium mb-1.5 block">Category Name</span>
        <input {...register("name")} className="input" placeholder="e.g. Men" />
        {errors.name && <span className="text-xs text-red-600 mt-1 block">{errors.name.message}</span>}
      </div>

      <div className="block">
        <span className="text-sm font-medium mb-1.5 block">Description</span>
        <textarea {...register("description")} rows={3} className="input" placeholder="Short description shown on category tiles" />
      </div>

      <label className="flex items-center gap-2 text-sm rounded-xl border border-ash/15 px-3 py-2.5 w-fit">
        <Controller
          name="featured"
          control={control}
          render={({ field }) => (
            <input type="checkbox" checked={field.value ?? false} onChange={(e) => field.onChange(e.target.checked)} />
          )}
        />
        Featured on homepage
      </label>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-ash px-8 py-3.5 text-sm font-medium text-white hover:bg-ash-dark transition-colors disabled:opacity-50"
      >
        {submitting ? "Saving…" : category ? "Save Changes" : "Create Category"}
      </button>
    </form>
  );
}
