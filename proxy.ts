import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/admin/login" || pathname === "/admin/logout") {
    return NextResponse.next();
  }

  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  if (!isAdminPath) return NextResponse.next();

  const signedIn = request.cookies.get("portfolio_admin")?.value === "1";
  if (signedIn) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/admin"]
};
