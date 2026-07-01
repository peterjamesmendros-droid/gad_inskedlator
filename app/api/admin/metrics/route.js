import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Structural time offsets matching local regional operations (Asia/Manila UTC+8)
    const now = new Date();
    const manilaTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    const todayStr = manilaTime.toISOString().split('T')[0];
    const currentTimeStr = manilaTime.toISOString().split('T')[1].substring(0, 8);

    // Dynamic metrics calculated against physical layout parameters 
    const totalBookingsRes = await query('SELECT COUNT(*)::int as c FROM bookings');
    const totalUsersRes = await query('SELECT COUNT(*)::int as c FROM users');
    const unreadMsgRes = await query("SELECT COUNT(*)::int as c FROM contact_messages WHERE status = 'Unread'");

    // Determine current utilization states for Room 1, Room 2, and Room 3
    const targetRooms = ["Room 1", "Room 2", "Room 3"];
    const roomStatuses = {};

    for (const room of targetRooms) {
      const activeBooking = await query(
        `SELECT id FROM bookings 
         WHERE room = $1 AND date = $2 AND status = 'accepted'
         AND start_time <= $3 AND end_time > $3 LIMIT 1`,
        [room, todayStr, currentTimeStr]
      );
      roomStatuses[room] = activeBooking.rows.length > 0 ? "Occupied" : "Available";
    }

    return NextResponse.json({
      success: true,
      metrics: {
        totalBookings: totalBookingsRes.rows[0].c,
        totalUsers: totalUsersRes.rows[0].c,
        unreadCount: unreadMsgRes.rows[0].c,
      },
      roomStatuses,
      formattedDate: manilaTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}