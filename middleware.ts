import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("stakewise_token")?.value;
    const { pathname } = request.nextUrl;

    // Define protected routes
    const protectedRoutes = ["/dashboard", "/stocks", "/profile", "/admin"];

    // Check if the current path starts with any protected route
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

    if (isProtected && !token) {
        const loginUrl = new URL("/login", request.url);
        // Add returnUrl parameter to redirect back after login
        loginUrl.searchParams.set("returnUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
