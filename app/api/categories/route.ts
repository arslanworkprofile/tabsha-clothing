import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { categoryService } from "@/services/categoryService";

const categoryInputSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  image: z.string().optional(),
  featured: z.boolean().optional(),
});

export async function GET() {
  try {
    const categories = await categoryService.list();
    return NextResponse.json({ categories });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to load categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = categoryInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
    }
    const category = await categoryService.create(parsed.data);
    return NextResponse.json({ category }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to create category" }, { status: 500 });
  }
}
