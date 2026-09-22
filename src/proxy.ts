import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const sessionId = request.cookies.get('session_id')?.value;
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/dashboard', '/learn', '/profile', '/admin'];
  const authPaths = ['/auth/login', '/auth/register'];

  const isProtected = protectedPaths.some(p => pathname.startsWith(p));
  const isAuthPath = authPaths.some(p => pathname.startsWith(p));

  if (isProtected && !sessionId) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (isAuthPath && sessionId) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/learn/:path*', '/profile/:path*', '/admin/:path*', '/auth/:path*'],
};
