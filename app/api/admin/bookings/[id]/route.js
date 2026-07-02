import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'all';

  try {
    // TODO: Connect your real database connection/query here
    // Example MySQL query text: SELECT * FROM bookings
    const mockBookings = [
      {
        id: "1",
        fullname: "Jane Doe",
        room: "Room 2",
        date: "2026-07-02",
        start_time: "09:00 AM",
        end_time: "11:00 AM",
        status: "pending"
      },
      {
        id: "2",
        fullname: "John Smith",
        room: "Room 1",
        date: "2026-07-03",
        start_time: "01:00 PM",
        end_time: "03:00 PM",
        status: "accepted"
      }
    ];

    // Filter results locally for testing
    const filteredBookings = filter === 'all' 
      ? mockBookings 
      : mockBookings.filter(b => b.status === filter);

    return NextResponse.json({ 
      success: true, 
      bookings: filteredBookings,
      meta: { 
        pendingCount: mockBookings.filter(b => b.status === 'pending').length 
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}