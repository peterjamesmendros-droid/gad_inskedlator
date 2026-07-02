import { NextResponse } from 'next/server';
import { query } from '@/lib/db'; 

export async function POST(request, { params }) {
  try {
    // 1. CRITICAL FOR NEXT.JS 16: You must await params before destructuring!
    const { id } = await params; 
    const { action } = await request.json();

    console.log(`Processing action: ${action} for booking ID: ${id}`);

    if (action === 'accept') {
      await query('UPDATE bookings SET status = $1 WHERE id = $2', ['accepted', id]);
    } else if (action === 'reject') {
      await query('UPDATE bookings SET status = $1 WHERE id = $2', ['rejected', id]);
    } else if (action === 'delete') {
      await query('DELETE FROM bookings WHERE id = $1', [id]);
    } else {
      return NextResponse.json({ success: false, message: 'Invalid action parameter' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Booking record ${action}ed successfully.` });
  } catch (error) {
    console.error("PostgreSQL POST Action Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}