import { NextResponse } from 'next/server';
import { query } from '@/lib/db'; 

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'all';

  try {
    // Modified start_time and end_time to convert 24hr strings directly into 12hr AM/PM strings
    const queryText = `
      SELECT 
        id, 
        fullname, 
        room, 
        TO_CHAR(date, 'YYYY-MM-DD') AS date, 
        TO_CHAR(start_time::time, 'HH12:MI AM') AS start_time, 
        TO_CHAR(end_time::time, 'HH12:MI AM') AS end_time, 
        status 
      FROM bookings 
      ORDER BY date DESC
    `;
    
    const result = await query(queryText);
    const allBookings = Array.isArray(result) ? result : (result?.rows || []);

    const pendingCount = allBookings.filter(
      b => b.status?.toLowerCase() === 'pending'
    ).length;

    const filteredBookings = filter === 'all' 
      ? allBookings 
      : allBookings.filter(b => b.status?.toLowerCase() === filter.toLowerCase());

    return NextResponse.json({ 
      success: true, 
      bookings: filteredBookings,
      meta: { 
        pendingCount: pendingCount
      }
    });
  } catch (error) {
    console.error("PostgreSQL GET Query Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}