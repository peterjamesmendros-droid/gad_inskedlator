// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('admin_session_token')?.value;
  const isTargetingAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isTargetingLoginUI = request.nextUrl.pathname === '/admin/login';

  // 1. Trying to reach the dashboard panels without an active cookie -> Go to Login UI
  if (isTargetingAdminRoute && !isTargetingLoginUI && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // 2. Already logged in but trying to visit login screen -> Bounce back to dashboard
  if (isTargetingLoginUI && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Protect everything under /admin but skip asset loaders and API hooks
  matcher: ['/admin/:path*'],
};