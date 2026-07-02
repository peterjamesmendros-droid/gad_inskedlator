'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, DoorClosed, Clock, CalendarCheck } from 'lucide-react';

export default function DashboardPage() {
  const [data, setData]         = useState(null);
  const [user, setUser]         = useState({ id: 0, fullname: 'Guest' });
  const [liveTime, setLiveTime] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('session_user');
    if (saved) try { setUser(JSON.parse(saved)); } catch {}
  }, []);

  const fetchDashboard = useCallback(async () => {
    if (!user.id) return;
    try {
      const res  = await fetch(`/api/dashboard?user_id=${user.id}`);
      const json = await res.json();
      if (json.success) setData(json);
    } catch (err) { console.error(err); }
  }, [user.id]);

  useEffect(() => {
    fetchDashboard();
    const t = setInterval(fetchDashboard, 10000);
    return () => clearInterval(t);
  }, [fetchDashboard]);

  useEffect(() => {
    const tick = () => {
      const now  = new Date();
      const date = now.toLocaleDateString('en-PH', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
      const time = now.toLocaleTimeString('en-PH', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
      setLiveTime(`${date} · ${time}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const badgeStyle = (status) => {
    const map = {
      available: { background:'#e6f5ef', color:'#2e7d5a', fontWeight:700, fontSize:11, padding:'3px 10px', borderRadius:20 },
      occupied:  { background:'#fdecea', color:'#c0392b', fontWeight:700, fontSize:11, padding:'3px 10px', borderRadius:20 },
      pending:   { background:'#fef3cd', color:'#b7791f', fontWeight:700, fontSize:11, padding:'3px 10px', borderRadius:20 },
      accepted:  { background:'#e6f5ef', color:'#2e7d5a', fontWeight:700, fontSize:11, padding:'3px 10px', borderRadius:20 },
      completed: { background:'#f0e6f5', color:'#5b1f6a', fontWeight:700, fontSize:11, padding:'3px 10px', borderRadius:20 },
      rejected:  { background:'#fdecea', color:'#c0392b', fontWeight:700, fontSize:11, padding:'3px 10px', borderRadius:20 },
    };
    return map[status] || { background:'#f5f4f7', color:'#4a4760', fontSize:11, padding:'3px 10px', borderRadius:20 };
  };

  const dotColor = (status) => status === 'occupied' ? '#c0392b' : '#2e7d5a';

  const card = { background:'#fff', border:'0.5px solid #e2e0e7', borderRadius:12, overflow:'hidden' };
  const cardHeader = { padding:'12px 16px', borderBottom:'0.5px solid #e2e0e7', display:'flex', alignItems:'center', justifyContent:'space-between' };
  const cardTitle  = { fontSize:13, fontWeight:600, color:'#1a1a2e', display:'flex', alignItems:'center', gap:7 };

  return (
    <div style={{ padding:'26px 26px 40px' }}>

      {/* PAGE HEADER */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20, gap:16, flexWrap:'wrap' }}>
        <div>
          <div style={{ fontSize:18, fontWeight:700, color:'#1a1a2e' }}>Dashboard</div>
          <div style={{ fontSize:12, color:'#8b8999', marginTop:3 }}>{liveTime || '...'}</div>
        </div>
        <Link href="/bookings" style={{
          display:'inline-flex', alignItems:'center', gap:6,
          padding:'0 16px', height:34, borderRadius:8,
          background:'#5b1f6a', color:'#fff',
          fontSize:13, fontWeight:600, textDecoration:'none',
        }}>
          <Plus size={15} /> Book a room
        </Link>
      </div>

      {/* STAT CARDS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }}>
        {[
          { label:'Available now',   value: data?.availCount ?? '—',           detail:'of 3 rooms',       borderColor:'#2e7d5a', valueColor:'#2e7d5a' },
          { label:'My pending',      value: data?.stats?.pending ?? '—',       detail:'awaiting approval', borderColor:'#b7791f', valueColor:'#1a1a2e' },
          { label:'Completed today', value: data?.stats?.completedToday ?? '—',detail:'bookings done',     borderColor:'#5b1f6a', valueColor:'#1a1a2e' },
          { label:'Rejected total',  value: data?.stats?.rejected ?? '—',      detail:'all time',          borderColor:'#c0392b', valueColor:'#c0392b' },
        ].map(({ label, value, detail, borderColor, valueColor }) => (
          <div key={label} style={{
            background:'#fff', border:'0.5px solid #e2e0e7',
            borderRadius:12, padding:'14px 16px',
            borderLeft:`3px solid ${borderColor}`,
            transition:'transform 0.18s,box-shadow 0.18s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 20px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}
          >
            <div style={{ fontSize:11, color:'#8b8999', marginBottom:4 }}>{label}</div>
            <div style={{ fontSize:24, fontWeight:700, color:valueColor, lineHeight:1 }}>{value}</div>
            <div style={{ fontSize:11, color: borderColor === '#b7791f' ? '#b7791f' : borderColor === '#c0392b' ? '#c0392b' : '#8b8999', marginTop:4 }}>{detail}</div>
          </div>
        ))}
      </div>

      {/* ROOM STATUS + TODAY'S SCHEDULE */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>

        {/* Room status — list with dots, matching PHP exactly */}
        <div style={card}>
          <div style={cardHeader}>
            <div style={cardTitle}>
              <DoorClosed size={15} color="#5b1f6a" /> Room status
            </div>
            <span
              onClick={fetchDashboard}
              style={{ fontSize:12, color:'#5b1f6a', fontWeight:500, cursor:'pointer' }}
            >
              Refresh
            </span>
          </div>
          <div>
            {['Room 1','Room 2','Room 3'].map(room => {
              const info   = data?.roomStatus?.[room] ?? { status:'available' };
              const status = info.status;
              return (
                <div key={room} style={{
                  display:'flex', alignItems:'center', gap:11,
                  padding:'10px 16px', borderBottom:'0.5px solid #e2e0e7',
                }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:dotColor(status), flexShrink:0, display:'inline-block' }} />
                  <span style={{ flex:1, fontSize:13, fontWeight:500, color:'#1a1a2e' }}>{room}</span>
                  {status === 'occupied' && info.time && (
                    <span style={{ fontSize:11.5, color:'#8b8999' }}>
                      Until {info.time.split('–')[1]?.trim() ?? ''}
                    </span>
                  )}
                  <span style={badgeStyle(status)}>{status.charAt(0).toUpperCase()+status.slice(1)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's schedule */}
        <div style={card}>
          <div style={cardHeader}>
            <div style={cardTitle}><Clock size={15} color="#5b1f6a" /> Today's schedule</div>
          </div>
          {data?.todaySchedule?.length > 0 ? data.todaySchedule.map((s, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:11, padding:'9px 16px', borderBottom:'0.5px solid #e2e0e7' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:'#5b1f6a', flexShrink:0 }} />
              <div style={{ fontSize:11.5, color:'#8b8999', minWidth:82 }}>{s.start_fmt}–{s.end_fmt}</div>
              <div style={{ flex:1, fontSize:13, fontWeight:500 }}>{s.fullname || '—'}</div>
              <div style={{ fontSize:11.5, color:'#4a4760' }}>{s.room}</div>
            </div>
          )) : (
            <div style={{ padding:'24px 16px', textAlign:'center', fontSize:13, color:'#8b8999' }}>
              No more bookings scheduled for today.
            </div>
          )}
        </div>

      </div>

      {/* MY RECENT BOOKINGS */}
      <div style={{ ...card, marginBottom:14 }}>
        <div style={cardHeader}>
          <div style={cardTitle}><CalendarCheck size={15} color="#5b1f6a" /> My recent bookings</div>
          <Link href="/bookings" style={{ fontSize:12, color:'#5b1f6a', fontWeight:500, textDecoration:'none' }}>View all</Link>
        </div>
        {data?.myBookings?.length > 0 ? (
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ background:'#f8f7fa', borderBottom:'0.5px solid #e2e0e7' }}>
                {['Room','Date','Time','Status'].map(h => (
                  <th key={h} style={{ padding:'9px 14px', textAlign:'left', fontSize:10.5, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:'#8b8999', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.myBookings.map((b, i) => (
                <tr key={i} style={{ borderBottom:'0.5px solid #e2e0e7' }}>
                  <td style={{ padding:'10px 14px', color:'#1a1a2e' }}>{b.room}</td>
                  <td style={{ padding:'10px 14px', color:'#1a1a2e' }}>
                    {new Date(b.date + 'T12:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                  </td>
                  <td style={{ padding:'10px 14px', whiteSpace:'nowrap', color:'#1a1a2e' }}>{b.start_fmt} – {b.end_fmt}</td>
                  <td style={{ padding:'10px 14px' }}>
                    <span style={badgeStyle(b.status)}>{b.status.charAt(0).toUpperCase()+b.status.slice(1)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding:'24px 16px', textAlign:'center', fontSize:13, color:'#8b8999' }}>
            No bookings yet.{' '}
            <Link href="/bookings" style={{ color:'#5b1f6a', fontWeight:600 }}>Book a room</Link>
          </div>
        )}
      </div>

      {/* UPCOMING BOOKED SLOTS — NEXT 7 DAYS */}
      <div style={card}>
        <div style={cardHeader}>
          <div style={cardTitle}><CalendarCheck size={15} color="#5b1f6a" /> Upcoming booked slots — next 7 days</div>
        </div>
        {data?.announcements?.length > 0 ? data.announcements.map((a, i) => (
          <div key={i} style={{ padding:'9px 16px', borderBottom:'0.5px solid #e2e0e7', fontSize:13 }}>
            <div style={{ fontWeight:600, color:'#1a1a2e', marginBottom:1 }}>{a.room} — {a.date}</div>
            <div style={{ fontSize:11.5, color:'#8b8999' }}>Booked: {a.slots}</div>
          </div>
        )) : (
          <div style={{ padding:'24px 16px', textAlign:'center', fontSize:13, color:'#8b8999' }}>
            All rooms are open for the next 7 days.
          </div>
        )}
      </div>

    </div>
  );
}