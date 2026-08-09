import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { productService } from "@/services/productService";
import type { ProductFilters } from "@/types/product";

const productInputSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  description: z.string().min(10),
  shortDescription: z.string().optional(),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  category: z.enum(["clothing", "accessories"]),
  gender: z.enum(["men", "women", "unisex"]),
  brand: z.string().optional(),
  tags: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  images: z.array(z.object({ url: z.string(), alt: z.string().optional() })).min(1),
  stock: z.number().int().nonnegative(),
  isFeatured: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const filters: ProductFilters = {
    category: (sp.get("category") as ProductFilters["category"]) || undefined,
    gender: (sp.get("gender") as ProductFilters["gender"]) || undefined,
    size: sp.get("size") || undefined,
    color: sp.get("color") || undefined,
    brand: sp.get("brand") || undefined,
    minPrice: sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined,
    maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
    search: sp.get("search") || undefined,
    sort: (sp.get("sort") as ProductFilters["sort"]) || "newest",
    page: sp.get("page") ? Number(sp.get("page")) : 1,
    limit: sp.get("limit") ? Number(sp.get("limit")) : 12,
  };

  try {
    const { items, total } = await productService.list(filters);
    return NextResponse.json({ items, total, page: filters.page, limit: filters.limit });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to load products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = productInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
    }

    const product = await productService.create(parsed.data);
    return NextResponse.json({ product }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to create product" }, { status: 500 });
  }
}
