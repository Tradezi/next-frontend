// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the token from the cookie set by your Flask backend
  const authToken = request.cookies.get('session'); // Ensure this matches your Flask cookie name

  console.log('Auth Token:', authToken); // Log the auth token
  console.log('Request Path:', request.nextUrl.pathname); // Log the request path

  // If accessing dashboard without auth token, redirect to login
  if (!authToken && request.nextUrl.pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/', request.url);
    console.log('Redirecting to login');
    return NextResponse.redirect(loginUrl);
  }

  // Allow access to the dashboard if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};
