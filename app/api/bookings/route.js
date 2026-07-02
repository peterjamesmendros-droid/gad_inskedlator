import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// ==========================================
// 1. GET: FETCH USER'S PERSONAL BOOKINGS
// ==========================================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User Identification parameters missing' },
        { status: 400 }
      );
    }

    // Query matches PHP logic: ORDER BY date DESC, start_time DESC
    const sql = `
      SELECT 
        id, 
        room, 
        date::text as date, 
        TO_CHAR(start_time, 'HH:MI AM') as start_time, 
        TO_CHAR(end_time, 'HH:MI AM') as end_time, 
        status 
      FROM bookings 
      WHERE user_id = $1 
      ORDER BY date DESC, start_time DESC
    `;
    
    const result = await query(sql, [parseInt(userId, 10)]);

    return NextResponse.json({
      success: true,
      bookings: result.rows
    });

  } catch (error) {
    console.error('[API BOOKINGS GET ERROR]:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Database Read Failure' },
      { status: 500 }
    );
  }
}

// ==========================================
// 2. POST: SUBMIT AND VALIDATE NEW RESERVATION
// ==========================================
export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, fullname, room, date, start_time } = body;

    // Check parameters
    if (!user_id || !fullname || !room || !date || !start_time) {
      return NextResponse.json(
        { success: false, message: 'Missing required reservation fields.' },
        { status: 400 }
      );
    }

    // Calculate End Time (Start time + 40 minutes) matching PHP logic (+2400 seconds)
    const [hours, minutes] = start_time.split(':');
    const startDateObj = new Date(2000, 0, 1, parseInt(hours, 10), parseInt(minutes, 10));
    startDateObj.setMinutes(startDateObj.getMinutes() + 40);
    
    const end_time = startDateObj.toTimeString().split(' ')[0]; // Returns "HH:MM:SS"

    // 1. Double check scheduling conflict rules (accepted slots only)
    const conflictSql = `
      SELECT id FROM bookings
      WHERE room = $1 
        AND date = $2 
        AND status = 'accepted'
        AND $3 < end_time 
        AND $4 > start_time
    `;
    
    const conflictCheck = await query(conflictSql, [room, date, start_time, end_time]);

    if (conflictCheck.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'This room is already booked during that time.' },
        { status: 409 } // Conflict
      );
    }

    // 2. Insert into PostgreSQL database
    const insertSql = `
      INSERT INTO bookings (user_id, fullname, room, date, start_time, end_time, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING id
    `;
    
    await query(insertSql, [
      parseInt(user_id, 10),
      fullname,
      room,
      date,
      start_time,
      end_time
    ]);

    // Format human-friendly time labels back to UI
    const formatTime = (tStr) => {
      const [h, m] = tStr.split(':');
      const ampm = parseInt(h, 10) >= 12 ? 'PM' : 'AM';
      const displayHours = parseInt(h, 10) % 12 || 12;
      return `${displayHours}:${m} ${ampm}`;
    };

    const displayMonthDate = new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    return NextResponse.json({
      success: true,
      message: `Booking submitted! You've reserved ${room} on ${displayMonthDate} from ${formatTime(start_time)} to ${formatTime(end_time)}. Awaiting admin approval.`
    });

  } catch (error) {
    console.error('[API BOOKINGS POST ERROR]:', error);
    return NextResponse.json(
      { success: false, message: 'Database Write Error: ' + error.message },
      { status: 500 }
    );
  }
}