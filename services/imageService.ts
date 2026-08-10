import path from "path";
import fs from "fs/promises";
import { connectDB, isMongoConfigured } from "@/lib/mongodb";
import ImageModel from "@/models/Image";

// MongoDB caps a single document at 16MB. Compressed WebP output from the upload route
// (resized to max 1600px, quality 82) lands nowhere near that in practice, but this is a
// hard backstop so an oversized buffer fails loudly instead of getting silently rejected
// by Mongo later.
const MAX_STORED_BYTES = 15 * 1024 * 1024;

const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");

export const imageService = {
  async create(buffer: Buffer, contentType: string, filename?: string): Promise<{ id: string; url: string }> {
    if (buffer.byteLength > MAX_STORED_BYTES) {
      throw new Error("Image is too large to store (max ~15MB after compression).");
    }

    if (isMongoConfigured()) {
      await connectDB();
      const doc = await ImageModel.create({
        data: buffer,
        contentType,
        filename: filename ?? "",
        size: buffer.byteLength,
      });
      const id = doc._id.toString();
      return { id, url: `/api/images/${id}` };
    }

    // No MONGODB_URI configured: fall back to local disk so the app still works for
    // local-only development. This path never runs on Vercel in practice, since nothing
    // else (products, categories, orders) persists there without Mongo either.
    await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
    const crypto = await import("crypto");
    const localName = `${crypto.randomBytes(8).toString("hex")}.webp`;
    await fs.writeFile(path.join(LOCAL_UPLOAD_DIR, localName), buffer);
    return { id: localName, url: `/uploads/products/${localName}` };
  },

  async getById(id: string): Promise<{ data: Buffer; contentType: string } | null> {
    if (!isMongoConfigured()) return null;
    await connectDB();
    const doc = await ImageModel.findById(id).lean<{ data: Buffer; contentType: string } | null>();
    if (!doc) return null;
    return { data: Buffer.from(doc.data as any), contentType: doc.contentType };
  },

  async delete(id: string): Promise<boolean> {
    if (isMongoConfigured()) {
      await connectDB();
      const res = await ImageModel.findByIdAndDelete(id);
      return Boolean(res);
    }
    const filePath = path.join(LOCAL_UPLOAD_DIR, id);
    await fs.unlink(filePath).catch(() => {});
    return true;
  },
};
