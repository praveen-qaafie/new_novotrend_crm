import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/email-verify",
];

const authRoutes = ["/sign-in", "/sign-up", "/forgot-password"];
const tokenBasedRoutes = ["/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("auth_token")?.value || request.cookies.get("userToken")?.value;

  // Not logged in
  if (!token) {
    if (authRoutes.includes(pathname) || tokenBasedRoutes.includes(pathname) || pathname.startsWith("/email-verify") ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Logged in
  if (authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // allow set-password even if logged in
  if (tokenBasedRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  const withNoCache = (response: NextResponse) => {
    response.headers.set("Cache-Control", "no-store");
    return response;
  };

  // Dashboard
  if (pathname === "/") {
    if (!token) {
      return withNoCache(NextResponse.redirect(new URL("/sign-in", request.url)));
    }
    return withNoCache(NextResponse.next());
  }

  // Protected route + no token → sign-in
  if (!isPublicRoute && !token) {
    return withNoCache(NextResponse.redirect(new URL("/sign-in", request.url)));
  }

  // Logged in + public route → dashboard
  // if (isPublicRoute && token) {
  //   return withNoCache(NextResponse.redirect(new URL("/", request.url)));
  // }

  if (isPublicRoute && token && !pathname.startsWith("/email-verify")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return withNoCache(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|otf)).*)",
  ],
};
