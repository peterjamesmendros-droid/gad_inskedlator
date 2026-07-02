import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('user_id'), 10);
    if (!userId) return NextResponse.json({ success: false, message: 'Missing user_id' }, { status: 400 });

    const manilaTime = new Date(Date.now() + 8 * 60 * 60 * 1000);
    const today   = manilaTime.toISOString().split('T')[0];
    const curTime = manilaTime.toISOString().split('T')[1].substring(0, 8);

    await query(`UPDATE bookings SET status='completed' WHERE status='accepted' AND date=$1 AND end_time <= $2`, [today, curTime]);

    const rooms = ['Room 1', 'Room 2', 'Room 3'];
    const roomStatus = {};
    let availCount = 0;
    for (const room of rooms) {
      const res = await query(
        `SELECT id FROM bookings WHERE room=$1 AND date=$2 AND status='accepted' AND start_time <= $3 AND end_time > $3 LIMIT 1`,
        [room, today, curTime]
      );
      const status = res.rows.length > 0 ? 'occupied' : 'available';
      roomStatus[room] = { status };
      if (status === 'available') availCount++;
    }

    const [pendingRes, completedTodayRes, rejectedRes] = await Promise.all([
      query(`SELECT COUNT(*)::int c FROM bookings WHERE user_id=$1 AND status='pending'`, [userId]),
      query(`SELECT COUNT(*)::int c FROM bookings WHERE user_id=$1 AND status='completed' AND date=$2`, [userId, today]),
      query(`SELECT COUNT(*)::int c FROM bookings WHERE user_id=$1 AND status='rejected'`, [userId]),
    ]);

    const schedRes = await query(
      `SELECT room, fullname, TO_CHAR(start_time,'HH12:MI AM') AS start_fmt, TO_CHAR(end_time,'HH12:MI AM') AS end_fmt
       FROM bookings WHERE date=$1 AND status='accepted' AND end_time > $2 ORDER BY start_time ASC`,
      [today, curTime]
    );

    const recentRes = await query(
      `SELECT room, date::text, status, TO_CHAR(start_time,'HH12:MI AM') AS start_fmt, TO_CHAR(end_time,'HH12:MI AM') AS end_fmt
       FROM bookings WHERE user_id=$1 ORDER BY date DESC, start_time DESC LIMIT 5`,
      [userId]
    );

    const announcements = [];
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(Date.now() + 8 * 60 * 60 * 1000 + i * 86400000).toISOString().split('T')[0];
      for (const room of rooms) {
        const slotRes = await query(
          `SELECT TO_CHAR(start_time,'HH12:MI AM') s, TO_CHAR(end_time,'HH12:MI AM') e
           FROM bookings WHERE room=$1 AND date=$2 AND status='accepted'
           AND ($3='other' OR end_time > $4) ORDER BY start_time ASC`,
          [room, checkDate, checkDate === today ? 'today' : 'other', curTime]
        );
        if (slotRes.rows.length > 0) {
          const displayDate = new Date(checkDate + 'T12:00:00')
            .toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
          announcements.push({ room, date: displayDate, slots: slotRes.rows.map(r => r.s + '–' + r.e).join(', ') });
        }
      }
    }

    return NextResponse.json({
      success: true, availCount, roomStatus,
      stats: { pending: pendingRes.rows[0].c, completedToday: completedTodayRes.rows[0].c, rejected: rejectedRes.rows[0].c },
      todaySchedule: schedRes.rows,
      myBookings: recentRes.rows,
      announcements,
      todayFormatted: manilaTime.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' })
    });
  } catch (err) {
    console.error('[DASHBOARD API]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}