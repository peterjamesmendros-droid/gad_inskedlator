'use client';

import { useState, useEffect } from 'react';
import { Building2, CalendarPlus, ListTodo, CircleCheck, AlertCircle } from 'lucide-react';

const ROOM_NAMES = ['Room 1', 'Room 2', 'Room 3'];

const STATUS_COLORS = {
  pending:   { text: 'var(--amber)', dot: 'var(--amber)' },
  accepted:  { text: 'var(--green)', dot: 'var(--green)' },
  completed: { text: 'var(--primary)', dot: 'var(--primary)' },
  rejected:  { text: 'var(--red)',   dot: 'var(--red)' },
};

export default function BookingPage() {
  const [rooms, setRooms] = useState({
    'Room 1': { status: 'available', booked_by: null, time: '' },
    'Room 2': { status: 'available', booked_by: null, time: '' },
    'Room 3': { status: 'available', booked_by: null, time: '' },
  });
  const [userBookings, setUserBookings] = useState([]);
  const [currentTime, setCurrentTime] = useState('');
  const [user, setUser] = useState({ id: 0, fullname: 'Guest' });

  // Form state
  const [selectedRoom, setSelectedRoom] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');

  // Feedback state
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const savedUser = localStorage.getItem('session_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser({
        id: parsed.id || 0,
        fullname: parsed.fullname || parsed.FULLNAME || 'Guest',
      });
    }

    async function fetchFreshData() {
      try {
        const roomRes = await fetch('/api/rooms');
        const roomData = await roomRes.json();

        if (roomData.success && roomData.rooms) {
          const formattedRooms = {};
          Object.entries(roomData.rooms).forEach(([name, data]) => {
            if (typeof data === 'string') {
              const isOccupied = data.toLowerCase() === 'occupied';
              formattedRooms[name] = { status: isOccupied ? 'occupied' : 'available', booked_by: null, time: '' };
            } else if (data && typeof data === 'object') {
              const rawStatus = (data.status || '').toLowerCase();
              const isOccupied = rawStatus === 'occupied' || rawStatus === 'unavailable';
              formattedRooms[name] = {
                status: isOccupied ? 'occupied' : 'available',
                booked_by: data.booked_by || null,
                time: data.time || '',
              };
            }
          });
          setRooms(prev => ({ ...prev, ...formattedRooms }));
        }

        if (savedUser) {
          const userId = JSON.parse(savedUser).id;
          const logRes = await fetch(`/api/bookings?user_id=${userId}`);
          const logData = await logRes.json();
          if (logData.success) setUserBookings(logData.bookings);
        }
      } catch (err) {
        console.error('Failed fetching live booking data:', err);
      }
    }

    fetchFreshData();
    const dataInterval = setInterval(fetchFreshData, 5000);
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(clockInterval);
    };
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!selectedRoom || !bookingDate || !startTime) {
      setErrorMsg('Please fill in all booking fields.');
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
          start_time: startTime,
        }),
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
        setErrorMsg(data.message || 'Something went wrong with your booking.');
      }
    } catch (err) {
      setErrorMsg('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ══════ PAGE HEADER ══════ */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-[23px] font-bold text-[var(--text)] leading-tight">Book a room</div>
          <div className="text-[13.5px] text-[var(--text-muted)] mt-1">
            Each slot is 40 minutes. Bookings require admin approval.
          </div>
        </div>
      </div>

      {/* ══════ ROOM STATUS CARD ══════ */}
      <div className="bg-[var(--surface)] border-[0.5px] border-[var(--border)] rounded-xl mb-5">
        <div className="flex items-center justify-between px-5 py-3.5 border-b-[0.5px] border-[var(--border)]">
          <div className="flex items-center gap-2 text-[14.5px] font-semibold text-[var(--text)]">
            <Building2 size={16} />
            Current room status
          </div>
          <span className="text-[12.5px] text-[var(--text-muted)]">{currentTime}</span>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-3 gap-3.5 max-[500px]:grid-cols-1">
            {ROOM_NAMES.map((roomName) => {
              const info = rooms[roomName] || { status: 'available' };
              const isOccupied = info.status === 'occupied';

              return (
                <div
                  key={roomName}
                  className={`bg-[var(--surface)] border-[0.5px] border-[var(--border)] rounded-xl p-5 text-center transition-colors ${
                    isOccupied ? 'border-t-[3px] border-t-[var(--red)]' : 'border-t-[3px] border-t-[var(--green)]'
                  }`}
                >
                  <div className="text-[14px] font-semibold text-[var(--text)] mb-2">{roomName}</div>
                  <span
                    className="inline-block text-[11px] font-bold px-3.5 py-1 rounded-full"
                    style={{
                      background: isOccupied ? 'var(--red-bg)' : 'var(--green-bg)',
                      color: isOccupied ? 'var(--red)' : 'var(--green)',
                    }}
                  >
                    {isOccupied ? 'Occupied' : 'Available'}
                  </span>

                  {isOccupied ? (
                    <div className="text-[11px] text-[var(--text-muted)] mt-1.5 leading-tight">
                      {info.time ? `Until ${info.time.split(/\s*[–\-]\s*/).pop().trim()}` : ''}
                    </div>
                  ) : (
                    <div className="text-[11px] text-[var(--text-muted)] mt-1.5 leading-tight invisible">—</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════ BOOKING FORM + MY BOOKINGS ══════ */}
      <div className="grid grid-cols-[360px_1fr] gap-5 items-start max-[820px]:grid-cols-1">

        {/* LEFT: RESERVE A SLOT */}
        <div className="bg-[var(--surface)] border-[0.5px] border-[var(--border)] rounded-xl">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b-[0.5px] border-[var(--border)] text-[14.5px] font-semibold text-[var(--text)]">
            <CalendarPlus size={16} />
            Reserve a slot
          </div>

          <div className="p-4">
            {successMsg && (
              <div
                className="flex items-start gap-2 text-[12.5px] rounded-[10px] px-3.5 py-3 mb-4"
                style={{ background: 'var(--green-bg)', color: 'var(--green)', border: '0.5px solid color-mix(in srgb, var(--green) 20%, transparent)' }}
              >
                <CircleCheck size={16} className="shrink-0 mt-[1px]" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div
                className="flex items-start gap-2 text-[12.5px] rounded-[10px] px-3.5 py-3 mb-4"
                style={{ background: 'var(--red-bg)', color: 'var(--red)', border: '0.5px solid color-mix(in srgb, var(--red) 20%, transparent)' }}
              >
                <AlertCircle size={16} className="shrink-0 mt-[1px]" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleBookingSubmit}>
              <div className="mb-4">
                <label className="block text-[10.5px] font-bold tracking-[0.1em] uppercase text-[var(--text-secondary)] mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  readOnly
                  value={user.fullname}
                  className="w-full h-11 rounded-[8px] px-3.5 text-[13.5px] font-medium outline-none cursor-not-allowed"
                  style={{ border: '1.5px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                />
              </div>

              <div className="mb-4">
                <label className="block text-[10.5px] font-bold tracking-[0.1em] uppercase text-[var(--text-secondary)] mb-1.5">
                  Select room
                </label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  required
                  className="w-full h-11 rounded-[8px] px-3.5 text-[13.5px] outline-none"
                  style={{ border: '1.5px solid var(--border)', background: '#f6f5f8', color: 'var(--text)' }}
                >
                  <option value="">— Choose a room —</option>
                  {ROOM_NAMES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-[10.5px] font-bold tracking-[0.1em] uppercase text-[var(--text-secondary)] mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                  className="w-full h-11 rounded-[8px] px-3.5 text-[13.5px] outline-none"
                  style={{ border: '1.5px solid var(--border)', background: '#f6f5f8', color: 'var(--text)' }}
                />
              </div>

              <div className="mb-5">
                <label className="block text-[10.5px] font-bold tracking-[0.1em] uppercase text-[var(--text-secondary)] mb-1.5">
                  Start time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full h-11 rounded-[8px] px-3.5 text-[13.5px] outline-none"
                  style={{ border: '1.5px solid var(--border)', background: '#f6f5f8', color: 'var(--text)' }}
                />
                <div className="text-[11.5px] text-[var(--text-muted)] mt-1.5">
                  End time is automatically 40 minutes after start.
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-[8px] text-white text-[14px] font-bold flex items-center justify-center gap-2 transition-colors"
                style={{ background: isSubmitting ? 'var(--primary-light)' : 'var(--primary)' }}
              >
                <CalendarPlus size={17} />
                {isSubmitting ? 'Processing...' : 'Submit booking'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: MY BOOKINGS TABLE */}
        <div className="bg-[var(--surface)] border-[0.5px] border-[var(--border)] rounded-xl">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b-[0.5px] border-[var(--border)] text-[14.5px] font-semibold text-[var(--text)]">
            <ListTodo size={16} />
            My bookings
          </div>

          {userBookings.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr>
                      {['Room', 'Date', 'Time', 'Status'].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)] border-b-[0.5px] border-[var(--border)]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {userBookings.map((b) => {
                      const s = (b.status || '').toLowerCase();
                      const c = STATUS_COLORS[s] || { text: 'var(--text-muted)', dot: 'var(--text-muted)' };
                      return (
                        <tr key={b.id} className="border-b-[0.5px] border-[var(--border)]">
                          <td className="px-4 py-3.5 text-[var(--text)]">{b.room}</td>
                          <td className="px-4 py-3.5 text-[var(--text-secondary)]">
                            {new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-4 py-3.5 text-[var(--text-secondary)] whitespace-nowrap">
                            {b.start_time} – {b.end_time}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className="inline-block text-[11px] font-bold px-3 py-1 rounded-full"
                              style={{
                                background: s === 'pending' ? 'var(--amber-bg)'
                                  : s === 'accepted' ? 'var(--green-bg)'
                                  : s === 'rejected' ? 'var(--red-bg)'
                                  : 'var(--primary-xlight)',
                                color: c.text,
                              }}
                            >
                              {b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : ''}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-4 flex-wrap px-4 py-3 border-t-[0.5px] border-[var(--border)]">
                {[
                  ['Pending', STATUS_COLORS.pending.dot],
                  ['Accepted', STATUS_COLORS.accepted.dot],
                  ['Completed', STATUS_COLORS.completed.dot],
                  ['Rejected', STATUS_COLORS.rejected.dot],
                ].map(([label, color]) => (
                  <div key={label} className="flex items-center gap-1.5 text-[11.5px] text-[var(--text-secondary)]">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color }} />
                    {label}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-10 text-center text-[13px] text-[var(--text-muted)]">
              No bookings yet. Use the form to reserve a room.
            </div>
          )}
        </div>
      </div>
    </>
  );
}