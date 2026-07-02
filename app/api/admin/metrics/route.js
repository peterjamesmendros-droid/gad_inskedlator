import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Count rows from your actual database table where status is pending
    const result = await query(
      "SELECT COUNT(*) FROM bookings WHERE status = 'pending'"
    );
    
    const pendingCount = parseInt(result.rows[0].count, 10) || 0;

    return NextResponse.json({
      success: true,
      metrics: {
        pendingCount: pendingCount,
        unreadCount: 0 // Keep at 0 until you build your messages system
      }
    });
  } catch (error) {
    console.error("Metrics API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}