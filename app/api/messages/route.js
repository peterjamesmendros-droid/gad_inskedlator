import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET all messages
export async function GET() {
  try {
    const res = await query('SELECT * FROM contact_messages ORDER BY date_sent DESC');
    const unreadRes = await query("SELECT COUNT(*)::int c FROM contact_messages WHERE status='Unread'");
    return NextResponse.json({ success: true, messages: res.rows, unreadCount: unreadRes.rows[0].c });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PATCH mark as read
export async function PATCH(request) {
  try {
    const { id } = await request.json();
    await query("UPDATE contact_messages SET status='Read' WHERE id=$1", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE message
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await query('DELETE FROM contact_messages WHERE id=$1', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
