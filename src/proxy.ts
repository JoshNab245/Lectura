import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sessionCookie, verifySession } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(sessionCookie.name)?.value;
  const session = token ? await verifySession(token) : null;
  if (!session) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
