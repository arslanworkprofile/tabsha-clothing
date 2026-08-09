import fs from "fs";
import path from "path";
import { Category } from "@/types/category";

const DB_PATH = path.join(process.cwd(), "data", "categories.json");
const SEED_VERSION = 1;

interface DBShape {
  _seedVersion?: number;
  categories: Category[];
}

function genId() {
  return "c_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function seedCategories(): Category[] {
  const now = new Date().toISOString();
  const base = (name: string, description: string, image: string, featured: boolean): Category => ({
    _id: genId(),
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    description,
    image,
    featured,
    createdAt: now,
    updatedAt: now,
  });

  return [
    base("Men", "Structured tailoring, weekday essentials.", "/uploads/products/demo/structured-wool-overcoat-1.webp", true),
    base("Women", "Draped silhouettes, considered detail.", "/uploads/products/demo/draped-satin-midi-dress-1.webp", true),
    base("Accessories", "The finishing pieces, made to last.", "/uploads/products/demo/minimal-leather-card-wallet-1.webp", true),
    base("Sarees", "Handwoven and printed sarees for every occasion.", "/uploads/products/demo/banarasi-silk-saree-1.webp", true),
  ];
}

function freshSeed(): DBShape {
  return { _seedVersion: SEED_VERSION, categories: seedCategories() };
}

function readDB(): DBShape {
  if (!fs.existsSync(DB_PATH)) {
    const seeded = freshSeed();
    fs.writeFileSync(DB_PATH, JSON.stringify(seeded, null, 2));
    return seeded;
  }
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  try {
    const parsed = JSON.parse(raw) as DBShape;
    if (parsed._seedVersion !== SEED_VERSION) {
      const reseeded = freshSeed();
      fs.writeFileSync(DB_PATH, JSON.stringify(reseeded, null, 2));
      return reseeded;
    }
    return parsed;
  } catch {
    const seeded = freshSeed();
    fs.writeFileSync(DB_PATH, JSON.stringify(seeded, null, 2));
    return seeded;
  }
}

function writeDB(db: DBShape) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const localCategoryStore = {
  list(): Category[] {
    return readDB().categories;
  },
  findById(id: string): Category | undefined {
    return readDB().categories.find((c) => c._id === id);
  },
  create(data: { name: string; description?: string; image?: string; featured?: boolean }): Category {
    const db = readDB();
    const now = new Date().toISOString();
    const category: Category = {
      _id: genId(),
      name: data.name,
      slug: slugify(data.name),
      description: data.description ?? "",
      image: data.image ?? "",
      featured: data.featured ?? false,
      createdAt: now,
      updatedAt: now,
    };
    db.categories.unshift(category);
    writeDB(db);
    return category;
  },
  update(id: string, data: Partial<Category>): Category | undefined {
    const db = readDB();
    const idx = db.categories.findIndex((c) => c._id === id);
    if (idx === -1) return undefined;
    const patch = { ...data };
    if (data.name) patch.slug = slugify(data.name);
    db.categories[idx] = { ...db.categories[idx], ...patch, updatedAt: new Date().toISOString() };
    writeDB(db);
    return db.categories[idx];
  },
  delete(id: string): boolean {
    const db = readDB();
    const before = db.categories.length;
    db.categories = db.categories.filter((c) => c._id !== id);
    writeDB(db);
    return db.categories.length < before;
  },
};
