import { NextRequest, NextResponse } from "next/server";
import { USER_COOKIE_NAME, verifyUserToken } from "@/lib/auth";
import { userService } from "@/services/userService";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(USER_COOKIE_NAME)?.value;
  const payload = token ? await verifyUserToken(token) : null;
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await userService.findById(payload.userId);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user: { name: user.name, email: user.email } });
}
