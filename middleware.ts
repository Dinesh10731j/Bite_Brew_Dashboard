import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canAccessDashboard, decodeJwt, TOKEN_COOKIE } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isLogin = pathname === '/login';
  const isDashboard = pathname.startsWith('/dashboard');
  const isDashboardApi = pathname.startsWith('/dashboard/api/');

  // API routes should return JSON status from handlers, not redirects from middleware.
  if (isDashboardApi) {
    return NextResponse.next();
  }

  if (!token) {
    if (isDashboard) {
      return NextResponse.redirect(new URL('/login?reason=unauthorized', request.url));
    }
    return NextResponse.next();
  }

  const payload = decodeJwt(token);
  const role = payload?.role;

  if (!payload || !role) {
    if (isLogin) return NextResponse.next();
    if (isDashboard) {
      const response = NextResponse.redirect(new URL('/login?reason=unauthorized', request.url));
      response.cookies.delete(TOKEN_COOKIE);
      return response;
    }
    return NextResponse.next();
  }

  const isAllowed = canAccessDashboard(role);

  if (isDashboard) {
    if (!isAllowed) {
      return NextResponse.redirect(new URL('/login?reason=forbidden', request.url));
    }
    return NextResponse.next();
  }

  if (isLogin && isAllowed) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
  ],
};
