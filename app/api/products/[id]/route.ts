import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/services/productService";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const product = await productService.getById(id);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();
    const product = await productService.update(id, body);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const ok = await productService.delete(id);
  if (!ok) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
