/**
 * Seeds MongoDB with the same demo product catalog used by the local JSON
 * store, so the storefront looks identical whether you're on Mongo or not.
 *
 * Usage:
 *   npm run seed
 *
 * Reads MONGODB_URI from .env.local (falls back to mongodb://localhost:27017/tabsha).
 * Safe to re-run: it upserts by slug, so it won't create duplicates.
 */
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// --- Minimal .env.local loader (avoids adding a dotenv dependency) ---
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadEnvLocal();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tabsha";

const ProductImageSchema = new mongoose.Schema(
  { url: { type: String, required: true }, alt: { type: String, default: "" } },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    sku: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    category: { type: String, enum: ["clothing", "accessories"], required: true },
    gender: { type: String, enum: ["men", "women", "unisex"], required: true },
    brand: { type: String, default: "Tabsha" },
    tags: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    images: { type: [ProductImageSchema], default: [] },
    stock: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function seed() {
  const seedProducts = require(path.join(process.cwd(), "data", "seed-products.json"));

  console.log(`Connecting to ${MONGODB_URI} ...`);
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.");

  let created = 0;
  let updated = 0;

  for (const product of seedProducts) {
    const res = await Product.findOneAndUpdate(
      { slug: product.slug },
      { $set: product },
      { upsert: true, new: true, rawResult: true }
    );
    if (res.lastErrorObject?.updatedExisting) updated++;
    else created++;
  }

  const total = await Product.countDocuments();
  console.log(`Done. ${created} created, ${updated} updated, ${total} total products in the database.`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
