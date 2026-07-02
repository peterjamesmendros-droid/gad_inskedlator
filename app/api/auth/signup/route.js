import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import * as bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullname, email, password } = body;

    if (!fullname || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please fulfill all registry fields.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. HOUSEKEEPING: Automatically complete old active bookings matching PHP rules
    // Handled natively on each execution loop to clear out historical scheduling flags
    const phTimezoneOffset = 8 * 60 * 60 * 1000; // Asia/Manila Offset
    const localPHTime = new Date(Date.now() + phTimezoneOffset);
    const today = localPHTime.toISOString().split('T')[0];
    const currentTime = localPHTime.toISOString().split('T')[1].substring(0, 8);

    await query(`
      UPDATE bookings
      SET status = 'completed'
      WHERE status = 'accepted'
        AND date = $1
        AND end_time <= $2
    `, [today, currentTime]);

    // 2. CHECK DUPLICATES: Make sure user doesn't already exist
    const duplicateCheck = await query(
      'SELECT id FROM users_login WHERE LOWER(email) = $1',
      [cleanEmail]
    );

    if (duplicateCheck.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists!' },
        { status: 409 } // Conflict
      );
    }

    // 3. CRYPTO HASHING: Encrypt password via standard secure definitions
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. INSERT RECORD
    await query(
      'INSERT INTO users_login (fullname, email, password) VALUES ($1, $2, $3)',
      [fullname.trim(), cleanEmail, hashedPassword]
    );

    return NextResponse.json({
      success: true,
      message: 'Account registered successfully!'
    });

  } catch (error) {
    console.error('[SIGNUP API EXCEPTION ERROR]:', error);
    return NextResponse.json(
      { success: false, message: 'Database Write Error: ' + error.message },
      { status: 500 }
    );
  }
}