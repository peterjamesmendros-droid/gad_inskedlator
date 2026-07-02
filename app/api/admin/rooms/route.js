import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // 1. Fetch bookings active right now using target timezone evaluation
    // Replaced CURRENT_TIME with localized target timezone logic to match user activity hours
    const queryText = `
      SELECT 
        room, 
        fullname, 
        CONCAT(
          TO_CHAR(start_time::time, 'HH12:MI AM'), 
          ' – ', 
          TO_CHAR(end_time::time, 'HH12:MI AM')
        ) AS time_slot
      FROM bookings
      WHERE status = 'accepted'
        AND date = (TIMEZONE('Asia/Manila', NOW())::date)
        AND (TIMEZONE('Asia/Manila', NOW())::time) BETWEEN start_time::time AND end_time::time
    `;

    const result = await query(queryText);
    const activeBookings = Array.isArray(result) ? result : (result?.rows || []);

    // 2. Baseline fallback mapping configuration
    const roomsLayout = {
      "Room 1": { status: "Available", booked_by: null, time: "" },
      "Room 2": { status: "Available", booked_by: null, time: "" },
      "Room 3": { status: "Available", booked_by: null, time: "" }
    };

    // 3. Overlay dynamic data matching
    activeBookings.forEach((booking) => {
      const roomKey = booking.room.trim();
      
      if (roomsLayout[roomKey]) {
        roomsLayout[roomKey] = {
          status: "Occupied",
          booked_by: booking.fullname,
          time: booking.time_slot
        };
      }
    });

    return NextResponse.json({
      success: true,
      rooms: roomsLayout
    });
  } catch (error) {
    console.error("PostgreSQL Rooms Telemetry Query Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}