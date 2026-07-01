'use client';

import { useState, useEffect } from 'react';
import { 
  DoorClosed, Check, X, Trash2, Mail, 
  LayoutDashboard, CalendarCheck, BarChart3, LogOut, Filter
} from 'lucide-react';

export default function AdminBookingsPage() {
  const [filter, setFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState('');
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const [roomStatus, setRoomStatus] = useState({
    "Room 1": { status: "Available", booked_by: null, time: "" },
    "Room 2": { status: "Available", booked_by: null, time: "" },
    "Room 3": { status: "Available", booked_by: null, time: "" }
  });

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Core Data Fetcher
  const fetchAdminData = async () => {
    try {
      // 1. Fetch live telemetry for room statuses
      const roomRes = await fetch('/api/admin/rooms');
      const roomData = await roomRes.json();
      if (roomData.success) {
        setRoomStatus(roomData.rooms);
      }

      // 2. Fetch all bookings based on current filter state
      const bookingsRes = await fetch(`/api/admin/bookings?filter=${filter}`);
      const bookingsData = await bookingsRes.json();
      if (bookingsData.success) {
        setBookings(bookingsData.bookings);
        setPendingCount(bookingsData.meta.pendingCount || 0);
        setUnreadCount(bookingsData.meta.unreadCount || 0);
      }
    } catch (err) {
      console.error("Operational exception updating administration data panel:", err);
    } finally {
      setLoading(false);
    }
  };

  // Poll intervals for live time & live database feeds
  useEffect(() => {
    fetchAdminData();
    const dataInterval = setInterval(fetchAdminData, 5000);

    const clockInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(clockInterval);
    };
  }, [filter]);

  // Handle Action Triggers (Accept / Reject / Delete)
  const handleAction = async (id, action) => {
    if (action === 'delete' && !confirm('Delete this booking permanently?')) return;

    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh local data immediately without layout jumping
        fetchAdminData();
      } else {
        alert(data.message || 'Action processing failure.');
      }
    } catch (err) {
      alert('Network transmission failure updating action.');
    }
  };

  const filterTabs = [
    { slug: 'all', label: 'All bookings' },
    { slug: 'pending', label: 'Pending', count: pendingCount },
    { slug: 'accepted', label: 'Accepted' },
    { slug: 'rejected', label: 'Rejected' },
    { slug: 'completed', label: 'Completed' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Booking management</h2>
          <p className="text-xs text-slate-500">Review, approve, reject, and monitor all booking requests.</p>
        </div>
        <div className="text-xs font-bold bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-slate-600 tabular-nums">
          {currentTime || '00:00:00 AM'}
        </div>
      </div>

      {/* Real-time Room Status Grid Section */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
          <DoorClosed className="h-3.5 w-3.5" />
          <span>Room status</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(roomStatus).map(([roomName, roomInfo]) => {
            const isOccupied = roomInfo?.status?.toLowerCase() === "occupied";
            return (
              <div key={roomName} className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                isOccupied ? 'bg-rose-50/40 border-rose-100/70' : 'bg-emerald-50/40 border-emerald-100/70'
              }`}>
                <span className="text-slate-800 text-sm font-bold block mb-1">{roomName}</span>
                <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
                  isOccupied ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {roomInfo?.status || 'Available'}
                </span>

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

      {/* Segmented Filter Controls Row */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.slug}
            onClick={() => setFilter(tab.slug)}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide border transition-all flex items-center gap-2 ${
              filter === tab.slug
                ? 'bg-purple-900 text-white border-purple-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                filter === tab.slug ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-900'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Master Data Records Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {bookings.length > 0 ? (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="p-4">Employee</th>
                  <th className="p-4">Room</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-slate-900 font-semibold">{b.fullname}</td>
                    <td className="p-4">{b.room}</td>
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {b.start_time} – {b.end_time}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        b.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                        b.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                        b.status === 'completed' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleAction(b.id, 'accept')}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                            >
                              <Check className="h-3.5 w-3.5" /> Accept
                            </button>
                            <button
                              onClick={() => handleAction(b.id, 'reject')}
                              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                            >
                              <X className="h-3.5 w-3.5" /> Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium pr-2 select-none">Processed</span>
                        )}
                        <button
                          onClick={() => handleAction(b.id, 'delete')}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Delete Permanently"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 font-medium select-none">
              {loading ? 'Fetching booking datasets...' : 'No bookings found for this filter layout.'}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}