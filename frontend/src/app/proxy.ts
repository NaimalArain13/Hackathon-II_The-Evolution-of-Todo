/**
 * Next.js 16 Proxy for Route Protection
 * Feature: 007-dashboard-ui
 *
 * Replaces middleware.ts in Next.js 16
 * Runs on Node.js runtime (not Edge)
 *
 * Checks for JWT token cookie and redirects:
 * - Unauthenticated users from /dashboard/* routes to /signin
 * - Authenticated users from auth pages to /dashboard
 */

import { NextRequest, NextResponse } from "next/server";

// === CONFIGURATION ===

// Paths that don't require authentication
const PUBLIC_PATHS = [
  "/",
  "/signin",
  "/signup",
  "/api/auth", // Auth API routes
];

// Paths that require authentication
const PROTECTED_PATHS = [
  "/dashboard",
];

// Cookie name for JWT token (matches our auth store)
const AUTH_COOKIE = "auth_token";

// === HELPERS ===

function matchesPath(pathname: string, paths: string[]): boolean {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function isProtectedPath(pathname: string): boolean {
  return matchesPath(pathname, PROTECTED_PATHS);
}

function isAuthPage(pathname: string): boolean {
  return pathname === "/signin" || pathname === "/signup";
}

// === PROXY FUNCTION ===

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookies
  const authToken = request.cookies.get(AUTH_COOKIE);
  const isAuthenticated = !!authToken;

  // Redirect authenticated users away from auth pages to dashboard
  if (isAuthenticated && isAuthPage(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to signin for protected paths
  if (!isAuthenticated && isProtectedPath(pathname)) {
    const signinUrl = new URL("/signin", request.url);
    // Add the original URL as a redirect parameter
    signinUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signinUrl);
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

// === MATCHER CONFIG ===

export const config = {
  matcher: [
    // Match dashboard routes
    "/dashboard/:path*",
    // Match auth routes
    "/signin",
    "/signup",
  ],
};
