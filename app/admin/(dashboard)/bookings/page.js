'use client';

import { useState, useEffect, useCallback } from 'react';
import { DoorClosed, Check, X, Trash2, Clock } from 'lucide-react';

const badgeStyle = (s) => ({ display:'inline-block', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background: s==='accepted' ? '#e6f5ef' : s==='rejected' ? '#fdecea' : s==='completed' ? '#f0e6f5' : '#fef3cd', color: s==='accepted' ? '#2e7d5a' : s==='rejected' ? '#c0392b' : s==='completed' ? '#5b1f6a' : '#b7791f' });

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms]       = useState({});
  const [filter, setFilter]     = useState('all');
  const [liveTime, setLiveTime] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [bRes, rRes] = await Promise.all([fetch('/api/admin/bookings'), fetch('/api/rooms')]);
      const bData = await bRes.json();
      const rData = await rRes.json();
      if (bData.success) setBookings(bData.bookings);
      if (rData.success) setRooms(rData.rooms);
    } catch {}
  }, []);

  const [actionError, setActionError] = useState('');

  useEffect(() => { fetchData(); const t = setInterval(fetchData, 10000); return () => clearInterval(t); }, [fetchData]);
  useEffect(() => { const t = setInterval(() => setLiveTime(new Date().toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit',second:'2-digit'})),1000); return ()=>clearInterval(t); },[]);

  async function handleAction(id, action) {
    if (action === 'delete' && !confirm('Delete this booking permanently?')) return;
    setActionError('');
    try {
      const res  = await fetch(`/api/admin/bookings/${id}`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action }) });
      const json = await res.json();
      if (!json.success) { setActionError(json.message || 'Action failed.'); return; }
    } catch { setActionError('Network error. Please try again.'); return; }
    fetchData();
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  const filters = [
    { key:'all', label:'All bookings' },
    { key:'pending', label:'Pending' },
    { key:'accepted', label:'Accepted' },
    { key:'rejected', label:'Rejected' },
    { key:'completed', label:'Completed' },
  ];

  return (
    <div style={{ padding:'26px 26px 40px' }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:18, fontWeight:700, color:'#1a1a2e' }}>Booking management</div>
        <div style={{ fontSize:12, color:'#8b8999', marginTop:3 }}>Review, approve, reject, and monitor all booking requests.</div>
      </div>

      {/* ROOM STATUS */}
      <div style={{ background:'#fff', border:'0.5px solid #e2e0e7', borderRadius:12, overflow:'hidden', marginBottom:18 }}>
        <div style={{ padding:'12px 16px', borderBottom:'0.5px solid #e2e0e7', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#1a1a2e', display:'flex', alignItems:'center', gap:7 }}><DoorClosed size={14} color="#5b1f6a" /> Room status</div>
          <span style={{ fontSize:12, color:'#8b8999' }}>{liveTime}</span>
        </div>
        <div style={{ padding:'14px 16px', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {['Room 1','Room 2','Room 3'].map(name => {
            const info   = rooms[name] || { status:'available' };
            const status = (info.status || 'available').toLowerCase();
            const occ    = status === 'occupied';
            return (
              <div key={name} style={{ background:'#fff', border:'0.5px solid #e2e0e7', borderRadius:12, padding:'22px 16px', textAlign:'center', borderTop:`3px solid ${occ?'#c0392b':'#2e7d5a'}`, minHeight:100, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#1a1a2e' }}>{name}</div>
                <span style={{ display:'inline-block', fontSize:11, fontWeight:700, padding:'4px 14px', borderRadius:20, background: occ?'#fdecea':'#e6f5ef', color: occ?'#c0392b':'#2e7d5a' }}>{occ?'Occupied':'Available'}</span>
                {occ && info.booked_by && (
                  <div style={{ fontSize:11, color:'#8b8999', lineHeight:1.4 }}>
                    {info.booked_by}<br/>{info.time}
                  </div>
                )}
                {!occ && <div style={{ fontSize:11, color:'transparent' }}>—</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding:'5px 14px', borderRadius:20, border:`1px solid ${filter===f.key?'#5b1f6a':'#e2e0e7'}`, fontSize:12.5, fontWeight:500, cursor:'pointer', background: filter===f.key?'#5b1f6a':'#fff', color: filter===f.key?'#fff':'#4a4760', fontFamily:'inherit', transition:'all 0.12s' }}>
            {f.label}{f.key==='pending'&&pendingCount>0&&<span style={{ marginLeft:5, background:'rgba(255,255,255,0.3)', borderRadius:10, padding:'0 6px', fontSize:10 }}>{pendingCount}</span>}
          </button>
        ))}
      </div>

      {/* ACTION ERROR */}
      {actionError && (
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fdecea', border:'0.5px solid #f5b7b1', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#c0392b', marginBottom:14 }}>
          ⚠ {actionError}
          <button onClick={()=>setActionError('')} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#c0392b', fontSize:16, lineHeight:1 }}>×</button>
        </div>
      )}

      {/* BOOKINGS TABLE */}
      <div style={{ background:'#fff', border:'0.5px solid #e2e0e7', borderRadius:12, overflow:'hidden' }}>
        {filtered.length > 0 ? (
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ background:'#f8f7fa', borderBottom:'0.5px solid #e2e0e7' }}>
                {['Employee','Room','Date','Time','Status','Actions'].map(h => (
                  <th key={h} style={{ padding:'9px 14px', textAlign:'left', fontSize:10.5, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:'#8b8999', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} style={{ borderBottom:'0.5px solid #e2e0e7' }}>
                  <td style={{ padding:'10px 14px', color:'#1a1a2e', fontWeight:500 }}>{b.fullname}</td>
                  <td style={{ padding:'10px 14px', color:'#1a1a2e' }}>{b.room}</td>
                  <td style={{ padding:'10px 14px', color:'#1a1a2e', whiteSpace:'nowrap' }}>{new Date(b.date+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</td>
                  <td style={{ padding:'10px 14px', color:'#1a1a2e', whiteSpace:'nowrap' }}>{b.start_time} – {b.end_time}</td>
                  <td style={{ padding:'10px 14px' }}><span style={badgeStyle(b.status)}>{b.status.charAt(0).toUpperCase()+b.status.slice(1)}</span></td>
                  <td style={{ padding:'10px 14px' }}>
                    <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                      {b.status === 'pending' && (<>
                        <button onClick={()=>handleAction(b.id,'accept')} style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 10px', background:'#e6f5ef', color:'#2e7d5a', border:'none', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}><Check size={13}/> Accept</button>
                        <button onClick={()=>handleAction(b.id,'reject')} style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 10px', background:'#fef3cd', color:'#b7791f', border:'none', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}><X size={13}/> Reject</button>
                      </>)}
                      {b.status !== 'pending' && <span style={{ fontSize:12, color:'#8b8999' }}>Processed</span>}
                      <button onClick={()=>handleAction(b.id,'delete')} style={{ display:'inline-flex', alignItems:'center', padding:'4px 8px', background:'#fdecea', color:'#c0392b', border:'none', borderRadius:6, fontSize:12, cursor:'pointer' }}><Trash2 size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding:'32px 16px', textAlign:'center', fontSize:13, color:'#8b8999' }}>No bookings found for this filter.</div>
        )}
      </div>
    </div>
  );
}