import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { USER_COOKIE_NAME, signUserToken } from "@/lib/auth";
import { comparePassword } from "@/lib/passwords";
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
    const user = await userService.findByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isCorrectPassword = await comparePassword(password, user.passwordHash);
    if (!isCorrectPassword) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

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
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
