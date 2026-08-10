import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { imageService } from "@/services/imageService";

// Note: the App Router's built-in req.formData() already parses multipart/form-data,
// so Multer (designed for the Express req/res model) isn't needed here.
//
// Images are stored as binary documents in MongoDB (see models/Image.ts +
// services/imageService.ts), not on disk: Vercel's serverless functions have a
// read-only filesystem (aside from /tmp, which doesn't persist between requests), so
// writing to /public/uploads only ever works in local dev, never in production.
// Each upload becomes its own Image document; the returned URL (/api/images/<id>) is
// what gets saved onto the product/category, and app/api/images/[id]/route.ts streams
// the bytes back out with the right content-type on request.

export const runtime = "nodejs";

const MAX_FILES = 8;
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB per image before compression
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(req: NextRequest) {
  try {
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

      // Auto resize (cap longest edge at 1600px), compress, and convert to WebP —
      // this is also what keeps each document comfortably under MongoDB's 16MB limit.
      const optimized = await sharp(buffer)
        .rotate() // respect EXIF orientation
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();

      const alt = file.name.replace(/\.[^.]+$/, "");
      const { url } = await imageService.create(optimized, "image/webp", file.name);
      results.push({ url, alt });
    }

    return NextResponse.json({ images: results }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid image url" }, { status: 400 });
    }

    if (url.startsWith("/api/images/")) {
      const id = url.replace("/api/images/", "");
      await imageService.delete(id);
      return NextResponse.json({ success: true });
    }

    if (url.startsWith("/uploads/products/")) {
      const filename = url.replace("/uploads/products/", "");
      await imageService.delete(filename);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid image url" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Delete failed" }, { status: 500 });
  }
}
