import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import * as bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { step } = body;

    if (step === 'request') {
      const email = body.email?.trim().toLowerCase();
      if (!email) return NextResponse.json({ success: false, message: 'Email is required.' }, { status: 400 });

      const res = await query('SELECT id FROM users_login WHERE LOWER(email)=$1', [email]);
      if (res.rows.length === 0)
        return NextResponse.json({ success: false, message: 'No account found with that email address.' }, { status: 404 });

      return NextResponse.json({ success: true, userId: res.rows[0].id });
    }

    if (step === 'reset') {
      const { userId, password } = body;
      if (!userId || !password)
        return NextResponse.json({ success: false, message: 'Missing fields.' }, { status: 400 });
      if (password.length < 8)
        return NextResponse.json({ success: false, message: 'Password must be at least 8 characters.' }, { status: 400 });
      if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password))
        return NextResponse.json({ success: false, message: 'Password must include at least one letter and one number.' }, { status: 400 });

      const hashed = await bcrypt.hash(password, 10);
      await query('UPDATE users_login SET password=$1 WHERE id=$2', [hashed, parseInt(userId, 10)]);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid step.' }, { status: 400 });
  } catch (err) {
    console.error('[FORGOT PASSWORD ERROR]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
