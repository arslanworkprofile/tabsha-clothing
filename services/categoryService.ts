import { connectDB, isMongoConfigured } from "@/lib/mongodb";
import CategoryModel from "@/models/Category";
import { localCategoryStore } from "@/lib/localCategoryStore";
import type { Category, CategoryInput } from "@/types/category";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function toPlainCategory(doc: any): Category {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    _id: obj._id.toString(),
    createdAt: obj.createdAt?.toISOString?.() ?? obj.createdAt,
    updatedAt: obj.updatedAt?.toISOString?.() ?? obj.updatedAt,
  };
}

export const categoryService = {
  async list(): Promise<Category[]> {
    if (isMongoConfigured()) {
      await connectDB();
      const docs = await CategoryModel.find({}).sort({ createdAt: -1 }).lean();
      return docs.map((d: any) => ({
        ...d,
        _id: d._id.toString(),
        createdAt: d.createdAt?.toISOString?.() ?? d.createdAt,
        updatedAt: d.updatedAt?.toISOString?.() ?? d.updatedAt,
      })) as Category[];
    }
    return localCategoryStore.list();
  },

  async getById(id: string): Promise<Category | null> {
    if (isMongoConfigured()) {
      await connectDB();
      const doc = await CategoryModel.findById(id);
      return doc ? toPlainCategory(doc) : null;
    }
    return localCategoryStore.findById(id) ?? null;
  },

  async create(input: CategoryInput): Promise<Category> {
    const slug = slugify(input.name);
    if (isMongoConfigured()) {
      await connectDB();
      const doc = await CategoryModel.create({ ...input, slug });
      return toPlainCategory(doc);
    }
    return localCategoryStore.create(input);
  },

  async update(id: string, input: Partial<CategoryInput>): Promise<Category | null> {
    const patch: any = { ...input };
    if (input.name) patch.slug = slugify(input.name);

    if (isMongoConfigured()) {
      await connectDB();
      const doc = await CategoryModel.findByIdAndUpdate(id, patch, { new: true });
      return doc ? toPlainCategory(doc) : null;
    }
    return localCategoryStore.update(id, patch) ?? null;
  },

  async delete(id: string): Promise<boolean> {
    if (isMongoConfigured()) {
      await connectDB();
      const res = await CategoryModel.findByIdAndDelete(id);
      return Boolean(res);
    }
    return localCategoryStore.delete(id);
  },
};
