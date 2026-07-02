import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        // 1. Housekeeping: Automatically update past records matching current timestamp limits
        const now = new Date();
        const manilaTime = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Manila',
            hour12: false,
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        }).formatToParts(now);

        const partMap = Object.fromEntries(manilaTime.map(p => [p.type, p.value]));
        const todayDate = `${partMap.year}-${partMap.month}-${partMap.day}`;
        const currentTime = `${partMap.hour}:${partMap.minute}:${partMap.second}`;

        await query(
            `UPDATE bookings 
             SET status = 'completed' 
             WHERE status = 'accepted' 
             AND date = $1 
             AND end_time <= $2`,
            [todayDate, currentTime]
        );

        // 2. Extract specific allocation statuses for your lactation slots
        const targetRooms = ["Room 1", "Room 2", "Room 3"];
        const computedStatuses = {};

        for (const room of targetRooms) {
            const result = await query(
                `SELECT id FROM bookings 
                 WHERE room = $1 
                 AND date = $2 
                 AND status = 'accepted' 
                 AND start_time <= $3 
                 AND end_time > $4 
                 LIMIT 1`,
                [room, todayDate, currentTime, currentTime]
            );
            
            computedStatuses[room] = result.rows.length > 0 ? "Occupied" : "Available";
        }

        return NextResponse.json({ success: true, rooms: computedStatuses, dateString: todayDate });
    } catch (error) {
        console.error("Room engine tracking fault:", error);
        return NextResponse.json({ success: false, error: "Database context execution dropped" }, { status: 500 });
    }
}