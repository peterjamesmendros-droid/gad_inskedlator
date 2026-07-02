import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();
    if (!name || !email || !subject || !message)
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    await query(
      `INSERT INTO contact_messages (name, email, subject, message, status) VALUES ($1,$2,$3,$4,'Unread')`,
      [name.trim(), email.trim(), subject.trim(), message.trim()]
    );
    return NextResponse.json({ success: true, message: 'Message sent! We typically respond within 24–48 working hours.' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
