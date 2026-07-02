'use client';

import { useState, useEffect } from 'react';
import { Building2, CalendarPlus, ListTodo, CircleCheck, AlertCircle, DoorClosed } from 'lucide-react';

export default function BookingPage() {
  const [rooms, setRooms] = useState({
    "Room 1": { status: "Available", booked_by: null, time: "" },
    "Room 2": { status: "Available", booked_by: null, time: "" },
    "Room 3": { status: "Available", booked_by: null, time: "" }
  });
  const [userBookings, setUserBookings] = useState([]);
  const [currentTime, setCurrentTime] = useState('');
  const [user, setUser] = useState({ id: 0, fullname: 'Guest' });

  // Form State Fields
  const [selectedRoom, setSelectedRoom] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  
  // Alert Status Feedback States
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // 1. Pull user profile information from session context
    const savedUser = localStorage.getItem('session_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser({
        id: parsed.id || 0,
        fullname: parsed.fullname || parsed.FULLNAME || 'Guest'
      });
    }

    // 2. Poll rooms metadata and personal history
    async function fetchFreshData() {
      try {
        // Fetch Live Room Statuses
        const roomRes = await fetch('/api/rooms');
        const roomData = await roomRes.json();
        
        if (roomData.success && roomData.rooms) {
          const formattedRooms = {};

          Object.entries(roomData.rooms).forEach(([name, data]) => {
            // Handle Case A: API returns simple string ("Available" or "Occupied")
            if (typeof data === 'string') {
              const isOccupied = data.toLowerCase() === 'occupied';
              formattedRooms[name] = {
                status: isOccupied ? 'Occupied' : 'Available',
                booked_by: null,
                time: ''
              };
            } 
            // Handle Case B: API returns object structure ({ status: 'occupied', booked_by: '...' })
            else if (data && typeof data === 'object') {
              const rawStatus = (data.status || '').toLowerCase();
              const isOccupied = rawStatus === 'occupied' || rawStatus === 'unavailable';
              formattedRooms[name] = {
                status: isOccupied ? 'Occupied' : 'Available',
                booked_by: data.booked_by || null,
                time: data.time || ''
              };
            }
          });

          // Ensure default clean layout state stays if keys are missing
          setRooms(prev => ({ ...prev, ...formattedRooms }));
        }

        // Fetch Individual User Log History
        if (savedUser) {
          const userId = JSON.parse(savedUser).id;
          const logRes = await fetch(`/api/bookings?user_id=${userId}`);
          const logData = await logRes.json();
          if (logData.success) setUserBookings(logData.bookings);
        }
      } catch (err) {
        console.error("Failed fetching live booking telemetry updates:", err);
      }
    }
    
    fetchFreshData();
    const dataInterval = setInterval(fetchFreshData, 5000); // 5-second polling loop
    
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(clockInterval);
    };
  }, []);

  // Handle Form Submission Action Link
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!selectedRoom || !bookingDate || !startTime) {
      setErrorMsg('Please populate all booking assignment parameters.');
      return;
    }

    const chosenTimestamp = new Date(`${bookingDate} ${startTime}`).getTime();
    if (chosenTimestamp <= Date.now()) {
      setErrorMsg('You cannot book a time that has already passed.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          fullname: user.fullname,
          room: selectedRoom,
          date: bookingDate,
          start_time: startTime
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        setSelectedRoom('');
        setBookingDate('');
        setStartTime('');
        
        const logRes = await fetch(`/api/bookings?user_id=${user.id}`);
        const logData = await logRes.json();
        if (logData.success) setUserBookings(logData.bookings);
      } else {
        setErrorMsg(data.message || 'Booking operational exception occurred.');
      }
    } catch (err) {
      setErrorMsg('Failed to process submission request on the backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBadgeStyles = (status) => {
    const s = status?.toLowerCase();
    if (s === 'accepted') return 'bg-emerald-100 text-emerald-700';
    if (s === 'rejected') return 'bg-rose-100 text-rose-700';
    if (s === 'completed') return 'bg-indigo-100 text-indigo-700';
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
      
      {/* Header Container Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Book a room</h2>
          <p className="text-xs text-slate-500">Each slot is 40 minutes. Bookings require admin approval.</p>
        </div>
        <div className="text-xs font-bold bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-slate-600 tabular-nums">
          {currentTime || '00:00:00 AM'}
        </div>
      </div>

      {/* Real-time Dynamic Room Availability Strip */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
          <Building2 className="h-3.5 w-3.5" />
          <span>Current room status</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(rooms).map(([roomName, roomInfo]) => {
            const isOccupied = roomInfo?.status === "Occupied";
            return (
              <div key={roomName} className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                isOccupied ? 'bg-rose-50/40 border-rose-100/70' : 'bg-emerald-50/40 border-emerald-100/70'
              }`}>
                <div className={`p-2 rounded-full flex items-center justify-center shrink-0 mb-2 ${
                  isOccupied ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  <DoorClosed className="h-4 w-4 fill-current" />
                </div>

                <span className="text-slate-800 text-sm font-bold block mb-1">{roomName}</span>
                <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
                  isOccupied ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                }`}>{roomInfo?.status || 'Available'}</span>

                {isOccupied && roomInfo?.booked_by ? (
                  <div className="text-[11px] text-slate-500 leading-tight mt-2 pt-2 border-t border-slate-100 w-full">
                    <span className="font-semibold block text-slate-700 truncate">{roomInfo.booked_by}</span>
                    <span className="text-[10px] text-slate-400">{roomInfo.time}</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-300 select-none mt-2 pt-2 border-t border-slate-100/0">—</div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Layout Split Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Reservation Insertion Form Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <CalendarPlus className="h-4 w-4 text-purple-900" /> Reserve a slot
          </h3>
          
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl flex gap-2 items-start">
              <CircleCheck className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-xl flex gap-2 items-start">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleBookingSubmit}>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
              <input type="text" readOnly value={user.fullname} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none text-slate-400 font-medium cursor-not-allowed" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Select Room</label>
              <select 
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none text-slate-800 font-medium focus:border-purple-900"
              >
                <option value="">— Choose a room —</option>
                <option value="Room 1">Room 1</option>
                <option value="Room 2">Room 2</option>
                <option value="Room 3">Room 3</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Date</label>
              <input 
                type="date" 
                min={todayStr}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none text-slate-800 font-medium focus:border-purple-900" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Start Time</label>
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none text-slate-800 font-medium focus:border-purple-900" 
              />
              <div className="text-[10px] text-slate-400 mt-0.5 italic">End time is automatically 40 minutes after start.</div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3 bg-purple-900 hover:bg-purple-950 disabled:bg-purple-300 text-white font-semibold text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Processing...' : 'Submit booking'}</span>
            </button>
          </form>
        </div>

        {/* Dynamic User Logs Dataset Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ListTodo className="h-4 w-4 text-purple-900" /> My bookings
            </h3>
            
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              {userBookings.length > 0 ? (
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                      <th className="p-3">Room</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                    {userBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{b.room}</td>
                        <td className="p-3 text-slate-500">
                          {new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="p-3 text-slate-500 whitespace-nowrap">
                          {b.start_time} – {b.end_time}
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${getBadgeStyles(b.status)}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 font-medium select-none">
                  No bookings yet. Use the form to reserve a room.
                </div>
              )}
            </div>
          </div>

          {/* Color Key Status Legend */}
          {userBookings.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-bold">
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-400 block" /> Pending</div>
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500 block" /> Accepted</div>
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-indigo-500 block" /> Completed</div>
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500 block" /> Rejected</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}