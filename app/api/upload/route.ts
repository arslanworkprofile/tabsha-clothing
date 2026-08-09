import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import crypto from "crypto";

// Note: the App Router's built-in req.formData() already parses multipart/form-data,
// so Multer (designed for the Express req/res model) isn't needed here. If you later
// add a classic Express-style API layer, Multer can front that instead.

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");
const MAX_FILES = 8;
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB per image before compression
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(req: NextRequest) {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const formData = await req.formData();
    const files = formData.getAll("images").filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "No images were uploaded" }, { status: 400 });
    }
    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Upload at most ${MAX_FILES} images at a time` }, { status: 400 });
    }

    const results: { url: string; alt: string }[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
      }
      if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json({ error: `${file.name} exceeds the 8MB limit` }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${crypto.randomBytes(8).toString("hex")}.webp`;
      const outputPath = path.join(UPLOAD_DIR, filename);

      // Auto resize (cap longest edge at 1600px), compress, and convert to WebP.
      await sharp(buffer)
        .rotate() // respect EXIF orientation
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outputPath);

      results.push({ url: `/uploads/products/${filename}`, alt: file.name.replace(/\.[^.]+$/, "") });
    }

    return NextResponse.json(
      {
        images: results,
        // Vercel (and most serverless hosts) have an ephemeral, per-instance
        // filesystem: this write succeeds for the current request, but the
        // file is not guaranteed to still be there on a later request once
        // the instance recycles or a new deployment happens. The image will
        // often keep working for a while, then quietly 404 later — flagging
        // it here rather than letting that surprise show up in production.
        warning: process.env.VERCEL
          ? "Uploaded, but this file is on Vercel's temporary storage and isn't guaranteed to persist. Set up permanent storage (e.g. Vercel Blob) before relying on this in production — see README."
          : undefined,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string" || !url.startsWith("/uploads/products/")) {
      return NextResponse.json({ error: "Invalid image url" }, { status: 400 });
    }
    const filePath = path.join(process.cwd(), "public", url);
    await fs.unlink(filePath).catch(() => {});
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Delete failed" }, { status: 500 });
  }
}
