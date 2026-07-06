import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { message, username, email } = await request.json();
    const userMessage = message ? message.trim().toLowerCase() : '';
    let reply = "I'm not quite sure how to process that. You can select one of the quick options or ask 'Is Room 1 free?'";

    if (!userMessage) {
      return NextResponse.json({ reply: "Please enter a statement request." });
    }

    // =========================================================
    // 1. CHECK RESERVED SLOTS FOR THE NEXT 7 DAYS
    // =========================================================
    if (
      userMessage.includes('7 days') || 
      userMessage.includes('next week') || 
      userMessage.includes('upcoming slots') ||
      userMessage.includes('reserved slots')
    ) {
      const queryText = `
        SELECT room, 
               TO_CHAR(date, 'Mon DD, YYYY') as formatted_date, 
               TO_CHAR(start_time::time, 'HH12:MI AM') as formatted_start, 
               TO_CHAR(end_time::time, 'HH12:MI AM') as formatted_end,
               fullname
        FROM bookings 
        WHERE status = 'accepted'
          AND date >= (TIMEZONE('Asia/Manila', NOW())::date)
          AND date <= (TIMEZONE('Asia/Manila', NOW())::date + INTERVAL '7 days')
        ORDER BY date ASC, start_time ASC
        LIMIT 10
      `;

      const result = await query(queryText);
      const upcomingBookings = Array.isArray(result) ? result : (result?.rows || []);

      if (upcomingBookings.length > 0) {
        const slots = upcomingBookings.map(b => 
          `• ${b.room} — Reserved by ${b.fullname}\n  ${b.formatted_date} (${b.formatted_start} - ${b.formatted_end})`
        );
        reply = `Here are the accepted reservations for the next 7 days:\n\n${slots.join('\n\n')}`;
      } else {
        reply = "There are currently no room allocations reserved for the next 7 days. Everything is wide open!";
      }
    }

    // =========================================================
    // 2. CHECK REAL-TIME SYSTEM ROOM ALLOCATION STATUS (TODAY)
    // =========================================================
    else if (userMessage.includes('availability') || userMessage.includes('status') || userMessage.includes('free')) {
      const rooms = ["Room 1", "Room 2", "Room 3"];
      const statusReport = [];

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
    // 3. CHECK ACCOUNT BOOKING HISTORY / SCHEDULES / APPROVAL STATUS
    // =========================================================
    else if (
      userMessage.includes('appointment') || 
      userMessage.includes('my booking') || 
      userMessage.includes('schedule') || 
      userMessage.includes('approved') || 
      userMessage.includes('request')
    ) {
      
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
          const logs = bookingsList.map(b => {
            let statusEmoji = '⏳';
            if (b.status.toLowerCase() === 'accepted' || b.status.toLowerCase() === 'approved') statusEmoji = '✅';
            if (b.status.toLowerCase() === 'rejected' || b.status.toLowerCase() === 'denied') statusEmoji = '❌';

            return `• ${b.room} [${b.status.toUpperCase()} ${statusEmoji}]\n  ${b.formatted_date} (${b.formatted_start} - ${b.formatted_end})`;
          });

          const intro = userMessage.includes('approved') || userMessage.includes('request') 
            ? `Here is the approval status of your recent room request logs:` 
            : `Here are your recent reservation logs:`;

          reply = `${intro}\n\n${logs.join('\n\n')}`;
        } else {
          reply = `I couldn't find any reservation logs or allocation requests matching your current profile: "${activeUser}".`;
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