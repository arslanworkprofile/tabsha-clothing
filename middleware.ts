import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, USER_COOKIE_NAME, verifyAdminToken, verifyUserToken } from "@/lib/auth";

// Protects:
// - /admin/* pages (except /admin/login itself) -> redirect to /admin/login
// - /dashboard/* pages -> redirect to /login
// - Mutating product/upload API calls (POST/PUT/DELETE) -> 401 JSON
const ADMIN_PAGE_PREFIX = "/admin";
const ADMIN_LOGIN_PAGE = "/admin/login";
const DASHBOARD_PAGE_PREFIX = "/dashboard";
const CUSTOMER_LOGIN_PAGE = "/login";
const PROTECTED_API_PREFIXES = ["/api/products", "/api/upload", "/api/categories", "/api/settings"];

async function hasValidAdminSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  return (await verifyAdminToken(token)) !== null;
}

async function hasValidUserSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(USER_COOKIE_NAME)?.value;
  if (!token) return false;
  return (await verifyUserToken(token)) !== null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Gate the admin dashboard pages.
  if (pathname.startsWith(ADMIN_PAGE_PREFIX) && pathname !== ADMIN_LOGIN_PAGE) {
    if (!(await hasValidAdminSession(req))) {
      const loginUrl = new URL(ADMIN_LOGIN_PAGE, req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Gate the customer account pages.
  if (pathname.startsWith(DASHBOARD_PAGE_PREFIX)) {
    if (!(await hasValidUserSession(req))) {
      const loginUrl = new URL(CUSTOMER_LOGIN_PAGE, req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Gate mutating API routes used by the admin dashboard (create/edit/delete
  // products, image uploads). Reads (GET) stay public for the storefront.
  const isProtectedApi = PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p));
  if (isProtectedApi && req.method !== "GET") {
    if (!(await hasValidAdminSession(req))) {
      return NextResponse.json({ error: "Unauthorized. Please sign in as an admin." }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/api/products/:path*", "/api/upload/:path*", "/api/categories/:path*", "/api/settings/:path*"],
};
