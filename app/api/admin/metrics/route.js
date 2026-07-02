import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    console.log("--- METRICS INSPECTION RUN ---");
    
    const bookingsResult = await query('SELECT COUNT(*) as count FROM bookings');
    console.log("RAW BOOKINGS RESULT:", JSON.stringify(bookingsResult));

    // Fallback extraction tree covering plain array, .rows array, and nested objects
    const extractCount = (res) => {
      if (!res) return 0;
      if (Array.isArray(res) && res[0]) return res[0].count ?? res[0].COUNT ?? 0;
      if (res.rows && Array.isArray(res.rows) && res.rows[0]) return res.rows[0].count ?? res.rows[0].COUNT ?? 0;
      return res.count ?? 0;
    };

    const totalBookings = extractCount(bookingsResult);

    const pendingResult = await query("SELECT COUNT(*) as count FROM bookings WHERE status='pending'");
    const pendingCount = extractCount(pendingResult);

    const userResult = await query('SELECT COUNT(*) as count FROM users').catch(() => null);
    const totalUsers = extractCount(userResult);

    const msgResult = await query("SELECT COUNT(*) as count FROM contact_messages WHERE status='Unread'");
    const unreadCount = extractCount(msgResult);

    console.log("PROCESSED COUNTS:", { totalBookings, pendingCount, totalUsers, unreadCount });

    return NextResponse.json({
      success: true,
      metrics: {
        totalBookings: Number(totalBookings),
        pendingCount: Number(pendingCount),
        totalUsers: Number(totalUsers),
        unreadCount: Number(unreadCount)
      }
    });

  } catch (error) {
    console.error("METRICS API CRASH:", error.message);
    return NextResponse.json({ 
      success: false, 
      metrics: { totalBookings: 0, pendingCount: 0, totalUsers: 0, unreadCount: 0 } 
    });
  }
}