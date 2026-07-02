import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Connect your real database query logic here
    // Example: const rooms = await db.rooms.findMany();
    
    const mockRoomStatus = {
      "Room 1": { status: "Available", booked_by: null, time: "" },
      "Room 2": { status: "Occupied", booked_by: "John Doe", time: "09:00 AM - 11:00 AM" },
      "Room 3": { status: "Available", booked_by: null, time: "" }
    };

    return NextResponse.json({ success: true, rooms: mockRoomStatus });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}