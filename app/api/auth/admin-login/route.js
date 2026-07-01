// app/api/auth/admin-login/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs'; // 1. Import bcryptjs

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Look for the admin user
    const userRes = await query(
      "SELECT * FROM users WHERE username = $1 AND role = 'admin' LIMIT 1",
      [username]
    );

    if (userRes.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Access denied. Invalid admin credentials." }, 
        { status: 401 }
      );
    }

    const adminUser = userRes.rows[0];

    // 2. Safely compare the plain-text input with the bcrypt hash
    const isPasswordCorrect = await bcrypt.compare(password, adminUser.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: "Access denied. Invalid admin credentials." }, 
        { status: 401 }
      );
    }

    // Generate the secure admin token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your_super_secure_32_char_long_secret_key');
    const token = await new SignJWT({ 
      id: adminUser.id, 
      username: adminUser.username, 
      role: adminUser.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(secret);

    const response = NextResponse.json({ 
      success: true, 
      message: "Admin authentication successful." 
    });
    
    // Set cookie
    response.cookies.set('admin_session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7200, 
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}