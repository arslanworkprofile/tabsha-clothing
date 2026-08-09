import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/services/categoryService";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const category = await categoryService.getById(id);
  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
  return NextResponse.json({ category });
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();
    const category = await categoryService.update(id, body);
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
    return NextResponse.json({ category });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const ok = await categoryService.delete(id);
  if (!ok) return NextResponse.json({ error: "Category not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
