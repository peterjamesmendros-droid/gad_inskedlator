// app/api/auth/admin-logout/route.js
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Successfully signed out."
    });

    // Overwrite the cookie with an immediate expiration date
    response.cookies.set('admin_session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0), // Expired immediately
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}