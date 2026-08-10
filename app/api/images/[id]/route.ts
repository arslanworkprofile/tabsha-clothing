import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/services/imageService";

// Runs on the Node.js runtime (not Edge) since it needs Buffer + Mongoose.
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  const image = await imageService.getById(id).catch((err) => {
    console.error(`Failed to load image ${id}:`, err);
    return null;
  });
  if (!image) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(image.data), {
    status: 200,
    headers: {
      "Content-Type": image.contentType,
      // Each id is unique per upload (a replaced image gets a new id), so the bytes
      // behind a given URL never change — safe to cache aggressively and immutably.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
