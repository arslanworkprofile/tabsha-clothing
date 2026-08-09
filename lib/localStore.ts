import fs from "fs";
import path from "path";
import { Product } from "@/types/product";
import seedProductData from "@/data/seed-products.json";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

// Bump this whenever data/seed-products.json changes. The local JSON store
// seeds itself once on first run and then persists — without a version check,
// anyone who'd already run the app before a seed-data update (new products,
// new demo images) would stay stuck on old cached data with no visible reason
// why. This is what caused product images to look like blank placeholders
// after the saree/pattern artwork was added.
const SEED_VERSION = 1;

interface DBShape {
  _seedVersion?: number;
  products: Product[];
}

function freshSeed(): DBShape {
  return { _seedVersion: SEED_VERSION, products: seedProducts() };
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

function genId() {
  return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export const localStore = {
  list(): Product[] {
    return readDB().products;
  },
  findBySlug(slug: string): Product | undefined {
    return readDB().products.find((p) => p.slug === slug);
  },
  findById(id: string): Product | undefined {
    return readDB().products.find((p) => p._id === id);
  },
  create(data: Omit<Product, "_id" | "createdAt" | "updatedAt">): Product {
    const db = readDB();
    const now = new Date().toISOString();
    const product: Product = { ...data, _id: genId(), createdAt: now, updatedAt: now };
    db.products.unshift(product);
    writeDB(db);
    return product;
  },
  update(id: string, data: Partial<Product>): Product | undefined {
    const db = readDB();
    const idx = db.products.findIndex((p) => p._id === id);
    if (idx === -1) return undefined;
    db.products[idx] = { ...db.products[idx], ...data, updatedAt: new Date().toISOString() };
    writeDB(db);
    return db.products[idx];
  },
  delete(id: string): boolean {
    const db = readDB();
    const before = db.products.length;
    db.products = db.products.filter((p) => p._id !== id);
    writeDB(db);
    return db.products.length < before;
  },
};

function seedProducts(): Product[] {
  const now = new Date().toISOString();
  return (seedProductData as Omit<Product, "_id" | "createdAt" | "updatedAt">[]).map((p) => ({
    ...p,
    _id: genId(),
    createdAt: now,
    updatedAt: now,
  }));
}
