import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// 1. GET ALL MESSAGES
export async function GET() {
  try {
    const messages = await query('SELECT * FROM contact_messages ORDER BY date_sent DESC');
    
    return NextResponse.json({
      success: true,
      messages: Array.isArray(messages) ? messages : []
    });
  } catch (error) {
    console.error("Messages GET API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. MARK MESSAGE AS READ
export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { status } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing message ID" }, { status: 400 });
    }

    await query('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Messages PATCH API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. DELETE A MESSAGE
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing message ID" }, { status: 400 });
    }

    await query('DELETE FROM contact_messages WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Messages DELETE API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}