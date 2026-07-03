import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const now = new Date();
    const manilaTime = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila', hour12: false,
      year:'numeric', month:'2-digit', day:'2-digit',
      hour:'2-digit', minute:'2-digit', second:'2-digit'
    }).formatToParts(now);

    const p = Object.fromEntries(manilaTime.map(x => [x.type, x.value]));
    const todayDate   = `${p.year}-${p.month}-${p.day}`;
    const currentTime = `${p.hour}:${p.minute}:${p.second}`;

    // Auto-complete past bookings
    await query(
      `UPDATE bookings SET status='completed'
       WHERE status='accepted' AND date=$1 AND end_time <= $2`,
      [todayDate, currentTime]
    );

    const rooms = ['Room 1', 'Room 2', 'Room 3'];
    const result = {};

    for (const room of rooms) {
      const res = await query(
        `SELECT b.id, u.fullname,
                TO_CHAR(b.start_time,'HH12:MI AM') AS start_fmt,
                TO_CHAR(b.end_time,'HH12:MI AM')   AS end_fmt
         FROM bookings b
         JOIN users_login u ON u.id = b.user_id
         WHERE b.room=$1 AND b.date=$2 AND b.status='accepted'
           AND b.start_time <= $3 AND b.end_time > $3
         LIMIT 1`,
        [room, todayDate, currentTime]
      );

      if (res.rows.length > 0) {
        const row = res.rows[0];
        result[room] = {
          status:    'occupied',
          booked_by: row.fullname,
          time:      `${row.start_fmt} – ${row.end_fmt}`,
        };
      } else {
        result[room] = { status: 'available', booked_by: null, time: null };
      }
    }

    return NextResponse.json({ success: true, rooms: result });
  } catch (err) {
    console.error('Rooms API error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}