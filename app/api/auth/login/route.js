import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import * as bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body.email ? body.email.trim() : '';
    const password = body.password ? body.password : '';
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide both email and password' },
        { status: 400 }
      );
    }

    // Query looking for case-insensitive email match
    const result = await query(
      'SELECT * FROM users_login WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    if (!result || result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Account does not exist' },
        { status: 401 }
      );
    }

    const user = result.rows[0];
    
    // Fallback normalization in case columns are uppercase in Postgres
    const dbPassword = user.password || user.PASSWORD || user.Password;
    const dbFullname = user.fullname || user.FULLNAME || user.Fullname || 'User';
    const dbId = user.id || user.ID;

    if (!dbPassword) {
      return NextResponse.json(
        { success: false, message: 'Database schema configuration fault' },
        { status: 500 }
      );
    }

    // Secure cryptographic hash validation matching your database
    const match = await bcrypt.compare(password, dbPassword);

    if (!match) {
      return NextResponse.json(
        { success: false, message: 'Invalid password credentials' },
        { status: 401 }
      );
    }

    console.log(`[LOGIN DICT] Login successful for: ${email}`);
    return NextResponse.json({
      success: true,
      user: {
        id: dbId,
        fullname: dbFullname,
        email: email
      }
    });

  } catch (error) {
    console.error('[LOGIN CRITICAL ERROR]:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Authentication Error' },
      { status: 500 }
    );
  }
}