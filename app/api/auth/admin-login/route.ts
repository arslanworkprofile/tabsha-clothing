import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE_NAME, signAdminToken } from "@/lib/auth";
import { comparePassword, hashPassword, getAdminEmail, verifyAdminPassword } from "@/lib/passwords";
import { userService } from "@/services/userService";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    let user = await userService.findByEmail(normalizedEmail);

    // Real, database-backed admin check: the account must exist and carry role "admin".
    if (user && user.role === "admin") {
      const isCorrectPassword = await comparePassword(password, user.passwordHash);
      if (!isCorrectPassword) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }
    } else {
      // Bootstrap path: only runs while NO admin exists in the database yet, so there's
      // always a way in on a fresh deploy. It provisions/promotes exactly one account
      // (matching ADMIN_EMAIL / ADMIN_PASSWORD[_HASH]) to role "admin" and then never
      // fires again. Every admin after that is created via Admin > Customers > Make Admin.
      const adminCount = await userService.countAdmins();
      const isBootstrapEmail = normalizedEmail === getAdminEmail();
      const isBootstrapPassword = await verifyAdminPassword(password);

      if (adminCount > 0 || !isBootstrapEmail || !isBootstrapPassword) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }

      if (user) {
        user = await userService.updateRole(user._id, "admin");
      } else {
        const passwordHash = await hashPassword(password);
        user = await userService.create({
          name: "Admin",
          email: normalizedEmail,
          passwordHash,
          role: "admin",
        });
      }

      if (!user) {
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
      }
    }

    const token = await signAdminToken(user._id, user.email);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
