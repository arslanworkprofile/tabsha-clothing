import slugify from "slugify";
import { connectDB, isMongoConfigured } from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import { localStore } from "@/lib/localStore";
import type { Product, ProductFilters, ProductInput } from "@/types/product";

function toPlainProduct(doc: any): Product {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    _id: obj._id.toString(),
    createdAt: obj.createdAt?.toISOString?.() ?? obj.createdAt,
    updatedAt: obj.updatedAt?.toISOString?.() ?? obj.updatedAt,
  };
}

function applyFilters(products: Product[], filters: ProductFilters): Product[] {
  let result = [...products];

  if (filters.category) result = result.filter((p) => p.category === filters.category);
  if (filters.gender) result = result.filter((p) => p.gender === filters.gender);
  if (filters.brand) result = result.filter((p) => p.brand === filters.brand);
  if (filters.size) result = result.filter((p) => p.sizes.includes(filters.size!));
  if (filters.color) result = result.filter((p) => p.colors.includes(filters.color!));
  if (filters.minPrice != null) result = result.filter((p) => (p.discountPrice ?? p.price) >= filters.minPrice!);
  if (filters.maxPrice != null) result = result.filter((p) => (p.discountPrice ?? p.price) <= filters.maxPrice!);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  switch (filters.sort) {
    case "oldest":
      result.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
      break;
    case "price_asc":
      result.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
      break;
    case "price_desc":
      result.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
      break;
    case "popularity":
      result.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "newest":
    default:
      result.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }

  return result;
}

export const productService = {
  async list(filters: ProductFilters = {}): Promise<{ items: Product[]; total: number }> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 12;

    if (isMongoConfigured()) {
      await connectDB();
      // For brevity Phase 1 fetches all then filters in-memory; Phase 2 should push
      // filters/sort/pagination into the Mongo query for large catalogs.
      const docs = await ProductModel.find({}).lean();
      const all = docs.map((d: any) => ({
        ...d,
        _id: d._id.toString(),
        createdAt: d.createdAt?.toISOString?.() ?? d.createdAt,
        updatedAt: d.updatedAt?.toISOString?.() ?? d.updatedAt,
      })) as Product[];
      const filtered = applyFilters(all, filters);
      const start = (page - 1) * limit;
      return { items: filtered.slice(start, start + limit), total: filtered.length };
    }

    const all = localStore.list();
    const filtered = applyFilters(all, filters);
    const start = (page - 1) * limit;
    return { items: filtered.slice(start, start + limit), total: filtered.length };
  },

  async getBySlug(slug: string): Promise<Product | null> {
    if (isMongoConfigured()) {
      await connectDB();
      const doc = await ProductModel.findOne({ slug });
      return doc ? toPlainProduct(doc) : null;
    }
    return localStore.findBySlug(slug) ?? null;
  },

  async getById(id: string): Promise<Product | null> {
    if (isMongoConfigured()) {
      await connectDB();
      const doc = await ProductModel.findById(id);
      return doc ? toPlainProduct(doc) : null;
    }
    return localStore.findById(id) ?? null;
  },

  async create(input: ProductInput): Promise<Product> {
    const slug = slugify(input.name, { lower: true, strict: true });

    if (isMongoConfigured()) {
      await connectDB();
      const doc = await ProductModel.create({
        ...input,
        slug,
        isFeatured: input.isFeatured ?? false,
        isTrending: input.isTrending ?? false,
        isNewArrival: input.isNewArrival ?? true,
        isBestSeller: input.isBestSeller ?? false,
        rating: 0,
        reviewCount: 0,
      });
      return toPlainProduct(doc);
    }

    return localStore.create({
      ...input,
      slug,
      isFeatured: input.isFeatured ?? false,
      isTrending: input.isTrending ?? false,
      isNewArrival: input.isNewArrival ?? true,
      isBestSeller: input.isBestSeller ?? false,
      rating: 0,
      reviewCount: 0,
    });
  },

  async update(id: string, input: Partial<ProductInput>): Promise<Product | null> {
    const patch: any = { ...input };
    if (input.name) patch.slug = slugify(input.name, { lower: true, strict: true });

    if (isMongoConfigured()) {
      await connectDB();
      const doc = await ProductModel.findByIdAndUpdate(id, patch, { new: true });
      return doc ? toPlainProduct(doc) : null;
    }
    return localStore.update(id, patch) ?? null;
  },

  async delete(id: string): Promise<boolean> {
    if (isMongoConfigured()) {
      await connectDB();
      const res = await ProductModel.findByIdAndDelete(id);
      return Boolean(res);
    }
    return localStore.delete(id);
  },
};
