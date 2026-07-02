import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    // Extract both message and username payload from the client-side JSON request body
    const { message, username } = await request.json();
    const userMessage = message ? message.trim().toLowerCase() : '';
    let reply = "I'm not quite sure how to process that. You can select one of the quick options or ask 'Is Room 1 free?'";

    if (!userMessage) {
      return NextResponse.json({ reply: "Please enter a statement request." });
    }

    // =========================================================
    // 1. CHECK REAL-TIME SYSTEM ROOM ALLOCATION STATUS
    // =========================================================
    if (userMessage.includes('availability') || userMessage.includes('status') || userMessage.includes('free')) {
      const rooms = ["Room 1", "Room 2", "Room 3"];
      const statusReport = [];

      // Loop queries using parameterized SQL inputs safely via Promise array processing
      for (const room of rooms) {
        const queryText = `
          SELECT id FROM bookings 
          WHERE room = $1 
            AND date = (TIMEZONE('Asia/Manila', NOW())::date)
            AND status = 'accepted' 
            AND (TIMEZONE('Asia/Manila', NOW())::time) BETWEEN start_time::time AND end_time::time 
          LIMIT 1
        `;
        
        const result = await query(queryText, [room]);
        const hasBooking = Array.isArray(result) ? result.length > 0 : (result?.rows?.length > 0);
        
        statusReport.push(hasBooking ? `• ${room}: ❌ Occupied` : `• ${room}: ✅ Available`);
      }

      reply = `Here is the current real-time room allocation status:\n${statusReport.join('\n')}`;
    } 
    
    // =========================================================
    // 2. CHECK ACCOUNT BOOKING HISTORY SCHEDULES
    // =========================================================
    else if (userMessage.includes('appointment') || userMessage.includes('my booking') || userMessage.includes('schedule')) {
      
      // DYNAMIC FIX: Capture the passed client username instead of hardcoding "test1234"
      const activeUser = username || 'Guest'; 

      if (!activeUser || activeUser === 'Guest') {
        reply = "Please sign into your account first so I can look up your tracking credentials.";
      } else {
        const queryText = `
          SELECT room, 
                 TO_CHAR(date, 'Mon DD, YYYY') as formatted_date, 
                 TO_CHAR(start_time::time, 'HH12:MI AM') as formatted_start, 
                 TO_CHAR(end_time::time, 'HH12:MI AM') as formatted_end, 
                 status 
          FROM bookings 
          WHERE fullname = $1 
          ORDER BY date DESC, start_time DESC 
          LIMIT 3
        `;
        
        const result = await query(queryText, [activeUser]);
        const bookingsList = Array.isArray(result) ? result : (result?.rows || []);

        if (bookingsList.length > 0) {
          const logs = bookingsList.map(b => 
            `• ${b.room} [${b.status.toUpperCase()}]\n  ${b.formatted_date} (${b.formatted_start} - ${b.formatted_end})`
          );
          reply = `Here are your recent reservation logs:\n\n${logs.join('\n\n')}`;
        } else {
          reply = `I couldn't find any reservation logs matching your current profile: "${activeUser}".`;
        }
      }
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Chatbot Core Engine Matrix Error:", error);
    return NextResponse.json(
      { reply: "Sorry, I hit an exception error attempting to pool database parameters." }, 
      { status: 500 }
    );
  }
}