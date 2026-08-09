import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE_NAME, signAdminToken } from "@/lib/auth";
import { getAdminEmail, verifyAdminPassword } from "@/lib/passwords";

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
    const isCorrectEmail = email.toLowerCase() === getAdminEmail();
    const isCorrectPassword = await verifyAdminPassword(password);

    if (!isCorrectEmail || !isCorrectPassword) {
      console.log(
        `[admin-login] failed — email match: ${isCorrectEmail} (expected "${getAdminEmail()}", got "${email.toLowerCase()}"), password match: ${isCorrectPassword}, ADMIN_PASSWORD_HASH set: ${Boolean(
          process.env.ADMIN_PASSWORD_HASH
        )}, ADMIN_PASSWORD set: ${Boolean(process.env.ADMIN_PASSWORD)}`
      );
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await signAdminToken(email.toLowerCase());
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
