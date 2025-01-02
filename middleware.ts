// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the token from the cookie set by your Flask backend
  const authToken = request.cookies.get('session'); // Make sure this matches your Flask cookie name

  // If accessing dashboard without auth token, redirect to login
  if (!authToken && request.nextUrl.pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};
