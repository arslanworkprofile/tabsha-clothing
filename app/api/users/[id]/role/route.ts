import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import { userService } from "@/services/userService";

type RouteContext = { params: Promise<{ id: string }> };

const schema = z.object({
  role: z.enum(["customer", "admin"]),
});

// Gated by middleware.ts (PROTECTED_API_PREFIXES includes /api/users), which already
// rejects non-admin requests before this handler runs. We still read the admin's own
// session here so an admin can't accidentally demote/remove themselves.
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = token ? await verifyAdminToken(token) : null;

    const target = await userService.findById(id);
    if (!target) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (parsed.data.role === "customer") {
      if (session && session.userId === id) {
        return NextResponse.json({ error: "You can't remove your own admin access." }, { status: 400 });
      }
      if (target.role === "admin") {
        const adminCount = await userService.countAdmins();
        if (adminCount <= 1) {
          return NextResponse.json({ error: "At least one admin must remain." }, { status: 400 });
        }
      }
    }

    const updated = await userService.updateRole(id, parsed.data.role);
    if (!updated) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      user: { _id: updated._id, name: updated.name, email: updated.email, role: updated.role },
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
