import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { USER_COOKIE_NAME, signUserToken } from "@/lib/auth";
import { hashPassword } from "@/lib/passwords";
import { userService } from "@/services/userService";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please fill in all fields correctly." }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    const existing = await userService.findByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await userService.create({ name, email, passwordHash });

    const token = await signUserToken(user._id, user.email);
    const res = NextResponse.json({ ok: true, user: { name: user.name, email: user.email } });
    res.cookies.set(USER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err: any) {
    // Handles a rare race where two requests create the same email at once
    // (Mongo's unique index rejects the second one after our own check passed).
    if (err?.code === 11000) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
