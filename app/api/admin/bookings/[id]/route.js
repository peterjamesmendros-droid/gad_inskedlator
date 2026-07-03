import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request, { params }) {
  try {
    const { id }     = await params;
    const { action } = await request.json();

    if (action === 'accept') {
      // Get the booking details first
      const bookingRes = await query(
        'SELECT room, date, start_time, end_time FROM bookings WHERE id=$1',
        [id]
      );
      if (bookingRes.rows.length === 0)
        return NextResponse.json({ success:false, message:'Booking not found.' }, { status:404 });

      const { room, date, start_time, end_time } = bookingRes.rows[0];

      // Check for overlap with already-accepted bookings (excluding this one)
      const overlapRes = await query(
        `SELECT id FROM bookings
         WHERE room=$1 AND date=$2 AND status='accepted' AND id != $3
           AND start_time < $4 AND end_time > $5`,
        [room, date, id, end_time, start_time]
      );

      if (overlapRes.rows.length > 0)
        return NextResponse.json({
          success: false,
          message: `Cannot accept — ${room} already has an approved booking that overlaps this time slot.`
        }, { status: 409 });

      await query('UPDATE bookings SET status=$1 WHERE id=$2', ['accepted', id]);
      return NextResponse.json({ success:true, message:'Booking accepted.' });

    } else if (action === 'reject') {
      await query('UPDATE bookings SET status=$1 WHERE id=$2', ['rejected', id]);
      return NextResponse.json({ success:true, message:'Booking rejected.' });

    } else if (action === 'delete') {
      await query('DELETE FROM bookings WHERE id=$1', [id]);
      return NextResponse.json({ success:true, message:'Booking deleted.' });

    } else {
      return NextResponse.json({ success:false, message:'Invalid action.' }, { status:400 });
    }

  } catch (err) {
    console.error('Admin booking action error:', err);
    return NextResponse.json({ success:false, error: err.message }, { status:500 });
  }
}