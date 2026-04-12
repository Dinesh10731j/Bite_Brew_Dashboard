import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from '@/lib/auth';


const TOKEN_COOKIE = "access_token" as const;
export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isLogin = pathname === '/login';
  const isDashboard = pathname.startsWith('/dashboard');
  const isForbidden = pathname === '/forbidden';

  // Allow forbidden page
  if (isForbidden) return NextResponse.next();

  // No token
  if (!token) {
    if (isDashboard) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Decode JWT (client-safe, no verify)
  const payload = decodeJwt(token);
  const role = payload?.role;

  // Invalid/expired token
  if (!payload || !role) {
    if (isLogin) return NextResponse.next();
    if (isDashboard) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(TOKEN_COOKIE);
      return response;
    }
    return NextResponse.next();
  }

  // Role-based access - safe type guard
  const isAllowed = role && (role === 'admin' || role === 'manager' || role === 'staff');

  if (isDashboard) {
    if (!isAllowed) {
      return NextResponse.rewrite(new URL('/forbidden', request.url));
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
    '/login',
    '/forbidden',
    '/dashboard/:path*',
  ],
};
