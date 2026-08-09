import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { settingsStore } from "@/lib/settingsStore";

const schema = z.object({
  storeName: z.string().min(1),
  supportEmail: z.string().email(),
  currency: z.string().min(1),
  freeShippingThreshold: z.coerce.number().nonnegative(),
  standardShippingFee: z.coerce.number().nonnegative(),
});

export async function GET() {
  return NextResponse.json({ settings: settingsStore.get() });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
    }
    const settings = settingsStore.update(parsed.data);
    return NextResponse.json({ settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to update settings" }, { status: 500 });
  }
}
