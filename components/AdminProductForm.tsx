"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import ImageUploader from "@/components/ImageUploader";
import type { Product } from "@/types/product";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  sku: z.string().min(2, "SKU is required"),
  category: z.enum(["clothing", "accessories"]),
  gender: z.enum(["men", "women", "unisex"]),
  brand: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  discountPrice: z.coerce.number().positive().optional().or(z.literal("").transform(() => undefined)),
  stock: z.coerce.number().int().nonnegative(),
  shortDescription: z.string().optional(),
  description: z.string().min(10, "Add a fuller description (10+ characters)"),
  colors: z.string().optional(),
  sizes: z.string().optional(),
  tags: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

function toCsv(arr?: string[]) {
  return (arr ?? []).join(", ");
}
function fromCsv(str?: string) {
  return (str ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AdminProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [images, setImages] = useState(product?.images ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          name: product.name,
          sku: product.sku,
          category: product.category,
          gender: product.gender,
          brand: product.brand,
          price: product.price,
          discountPrice: product.discountPrice,
          stock: product.stock,
          shortDescription: product.shortDescription,
          description: product.description,
          colors: toCsv(product.colors),
          sizes: toCsv(product.sizes),
          tags: toCsv(product.tags),
          isFeatured: product.isFeatured,
          isTrending: product.isTrending,
          isNewArrival: product.isNewArrival,
          isBestSeller: product.isBestSeller,
        }
      : { category: "clothing", gender: "unisex", isNewArrival: true },
  });

  const onSubmit = async (values: FormValues) => {
    if (images.length === 0) {
      setServerError("Add at least one product image.");
      return;
    }
    setServerError(null);
    setSubmitting(true);

    const payload = {
      ...values,
      colors: fromCsv(values.colors),
      sizes: fromCsv(values.sizes),
      tags: fromCsv(values.tags),
      images,
    };

    try {
      if (product) {
        await axios.put(`/api/products/${product._id}`, payload);
      } else {
        await axios.post("/api/products", payload);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setServerError(err.response?.data?.error ?? "Something went wrong saving the product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      <section>
        <h2 className="text-sm font-semibold mb-3">Images</h2>
        <ImageUploader images={images} onChange={setImages} />
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Product Name" error={errors.name?.message}>
          <input {...register("name")} className="input" />
        </Field>
        <Field label="SKU" error={errors.sku?.message}>
          <input {...register("sku")} className="input" />
        </Field>
        <Field label="Category" error={errors.category?.message}>
          <select {...register("category")} className="input">
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
          </select>
        </Field>
        <Field label="Gender" error={errors.gender?.message}>
          <select {...register("gender")} className="input">
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>
        </Field>
        <Field label="Brand">
          <input {...register("brand")} className="input" placeholder="Tabsha" />
        </Field>
        <Field label="Stock" error={errors.stock?.message}>
          <input type="number" {...register("stock")} className="input" />
        </Field>
        <Field label="Price (PKR)" error={errors.price?.message}>
          <input type="number" step="0.01" {...register("price")} className="input" />
        </Field>
        <Field label="Discount Price (PKR)" error={errors.discountPrice?.message as string}>
          <input type="number" step="0.01" {...register("discountPrice")} className="input" />
        </Field>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field label="Colors (comma separated)">
          <input {...register("colors")} className="input" placeholder="Ash Grey, Black, White" />
        </Field>
        <Field label="Sizes (comma separated)">
          <input {...register("sizes")} className="input" placeholder="XS, S, M, L, XL" />
        </Field>
        <Field label="Tags (comma separated)">
          <input {...register("tags")} className="input" placeholder="tee, essential" />
        </Field>
      </section>

      <Field label="Short Description">
        <input {...register("shortDescription")} className="input" />
      </Field>
      <Field label="Description" error={errors.description?.message}>
        <textarea {...register("description")} rows={5} className="input" />
      </Field>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(
          [
            ["isFeatured", "Featured"],
            ["isTrending", "Trending"],
            ["isNewArrival", "New Arrival"],
            ["isBestSeller", "Best Seller"],
          ] as const
        ).map(([name, label]) => (
          <label key={name} className="flex items-center gap-2 text-sm rounded-xl border border-ash/15 px-3 py-2.5">
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  checked={field.value ?? false}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
            {label}
          </label>
        ))}
      </section>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-ash px-8 py-3.5 text-sm font-medium text-white hover:bg-ash-dark transition-colors disabled:opacity-50"
      >
        {submitting ? "Saving…" : product ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium mb-1.5 block">{label}</span>
      {children}
      {error && <span className="text-xs text-red-600 mt-1 block">{error}</span>}
    </label>
  );
}
