'use client';

import { useState, useEffect } from 'react';
import { Upload, Send, Trash2, LayoutDashboard, CheckCircle2, AlertCircle } from 'lucide-react';

const card = { background:'#fff', border:'0.5px solid #e2e0e7', borderRadius:12, overflow:'hidden' };
const cardHeader = { padding:'12px 16px', borderBottom:'0.5px solid #e2e0e7', display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:600, color:'#1a1a2e' };
const infoItem = { display:'flex', gap:10, padding:'9px 0', borderBottom:'0.5px solid #e2e0e7', fontSize:13, color:'#4a4760', lineHeight:1.5 };
const inputStyle = { width:'100%', border:'1.5px solid #e2e0e7', borderRadius:8, padding:'9px 12px', fontSize:13.5, fontFamily:'inherit', color:'#1a1a2e', background:'#f6f5f8', outline:'none', boxSizing:'border-box' };
const labelStyle = { display:'block', fontSize:10.5, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'#4a4760', marginBottom:6 };

export default function AdminDashboard() {
  const [metrics, setMetrics]     = useState({ totalBookings:0, pendingCount:0, totalUsers:0, unreadCount:0 });
  const [posts, setPosts]         = useState([]);
  const [commentText, setCommentText] = useState({});
  const [progress, setProgress]   = useState(40);
  const [success, setSuccess]     = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    try {
      const [mRes, pRes] = await Promise.all([fetch('/api/admin/metrics'), fetch('/api/admin/posts')]);
      const mData = await mRes.json();
      const pData = await pRes.json();
      if (mData.success) setMetrics(mData.metrics);
      if (pData.success) setPosts(pData.posts);
    } catch {}
  }

  async function handlePostSubmit(e) {
    e.preventDefault();
    setLoading(true); setSuccess(''); setError('');
    const fd = new FormData(e.target);
    fd.set('progress', progress);
    try {
      const res  = await fetch('/api/admin/posts', { method:'POST', body: fd });
      const json = await res.json();
      if (json.success) { setSuccess('Update posted successfully!'); e.target.reset(); setProgress(40); fetchAll(); }
      else setError(json.message || 'Failed to post update.');
    } catch { setError('Something went wrong.'); }
    finally { setLoading(false); }
  }

  async function handleDeletePost(id) {
    if (!confirm('Delete this post permanently?')) return;
    await fetch(`/api/admin/posts?id=${id}`, { method:'DELETE' });
    fetchAll();
  }

  async function handleComment(uploadId) {
    const text = (commentText[uploadId] || '').trim();
    if (!text) return;
    await fetch('/api/admin/comments', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ upload_id:uploadId, comment:text, name:'Admin' }) });
    setCommentText(p => ({ ...p, [uploadId]:'' }));
    fetchAll();
  }

  async function handleDeleteComment(id) {
    if (!confirm('Delete this comment?')) return;
    await fetch(`/api/admin/comments?id=${id}`, { method:'DELETE' });
    fetchAll();
  }

  const ext = (path) => (path?.split('.').pop() || '').toLowerCase();

  return (
    <div style={{ padding:'26px 26px 40px' }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:18, fontWeight:700, color:'#1a1a2e' }}>Admin dashboard</div>
        <div style={{ fontSize:12, color:'#8b8999', marginTop:3 }}>Post facility updates and manage the system.</div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:22 }}>
        {[
          { label:'Total bookings',   value: metrics.totalBookings, color:'#5b1f6a', detail: null },
          { label:'Pending approval', value: metrics.pendingCount,  color:'#b7791f', detail: <a href="/admin/bookings" style={{ color:'#b7791f', fontSize:11 }}>Review now</a> },
          { label:'Registered users', value: metrics.totalUsers,    color:'#2e7d5a', detail: null },
          { label:'Unread messages',  value: metrics.unreadCount,   color:'#c0392b', detail: <a href="/admin/messages" style={{ color:'#c0392b', fontSize:11 }}>View inbox</a> },
        ].map(({ label, value, color, detail }) => (
          <div key={label} style={{ background:'#fff', border:'0.5px solid #e2e0e7', borderRadius:12, padding:'14px 16px', borderLeft:`3px solid ${color}`, transition:'transform 0.18s,box-shadow 0.18s' }}
            onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 20px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}>
            <div style={{ fontSize:11, color:'#8b8999', marginBottom:4 }}>{label}</div>
            <div style={{ fontSize:28, fontWeight:700, color:'#1a1a2e', lineHeight:1 }}>{value}</div>
            {detail && <div style={{ marginTop:4 }}>{detail}</div>}
          </div>
        ))}
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 260px', gap:20, alignItems:'start', marginBottom:22 }}>

        {/* LEFT: POST FORM */}
        <div style={card}>
          <div style={cardHeader}><Upload size={14} color="#5b1f6a" /> Post a facility update</div>
          <div style={{ padding:'16px 16px 20px' }}>
            {success && <div style={{ display:'flex', alignItems:'center', gap:8, background:'#e6f5ef', border:'0.5px solid #b7e0cc', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#2e7d5a', marginBottom:14 }}><CheckCircle2 size={15}/>{success}</div>}
            {error   && <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fdecea', border:'0.5px solid #f5b7b1', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#c0392b', marginBottom:14 }}><AlertCircle size={15}/>{error}</div>}
            <form onSubmit={handlePostSubmit}>
              <div style={{ marginBottom:14 }}>
                <label style={labelStyle}>Title</label>
                <input style={inputStyle} name="title" placeholder="Update title" required />
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, resize:'vertical', minHeight:80, padding:12 }} name="description" rows={4} placeholder="Describe the update..." required />
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={labelStyle}>Facility type</label>
                <select style={inputStyle} name="category">
                  <option value="Child-Minding">Child-Minding Center</option>
                  <option value="Lactation Room">Lactation Room</option>
                </select>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={labelStyle}>Upload photo / video</label>
                <input style={{ ...inputStyle, height:'auto', padding:'8px 12px' }} type="file" name="file" accept="image/*,video/*" required />
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={labelStyle}>Progress — <span>{progress}</span>%</label>
                <input type="range" name="progress" min={0} max={100} value={progress}
                  onChange={e => setProgress(+e.target.value)}
                  style={{ width:'100%', accentColor:'#5b1f6a', marginBottom:4 }} />
                <div style={{ fontSize:11, color:'#8b8999' }}>0–30% Planning &nbsp;|&nbsp; 40–70% Implementation &nbsp;|&nbsp; 80–100% Completed</div>
              </div>
              <button type="submit" disabled={loading} style={{ width:'100%', height:44, background:'#5b1f6a', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:'inherit' }}>
                <Send size={15} /> {loading ? 'Posting...' : 'Post update'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={card}>
            <div style={cardHeader}><CheckCircle2 size={14} color="#5b1f6a" /> Facility focus</div>
            <div style={{ padding:'4px 16px 8px' }}>
              {['Child-Minding Center Development','Lactation Room Improvements','Renovation & Equipment Updates'].map((t,i,a) => (
                <div key={t} style={{ ...infoItem, borderBottom: i===a.length-1 ? 'none' : '0.5px solid #e2e0e7' }}>
                  <CheckCircle2 size={14} color="#5b1f6a" style={{ flexShrink:0, marginTop:2 }} /><span>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={card}>
            <div style={cardHeader}><LayoutDashboard size={14} color="#5b1f6a" /> Progress guide</div>
            <div style={{ padding:'4px 16px 8px' }}>
              {[['0–30%','Planning stage'],['40–70%','Implementation'],['80–100%','Completed']].map(([pct,lbl],i,a) => (
                <div key={pct} style={{ ...infoItem, borderBottom: i===a.length-1 ? 'none' : '0.5px solid #e2e0e7' }}>
                  <span style={{ color:'#5b1f6a', fontWeight:700, minWidth:52, fontSize:12 }}>{pct}</span><span>{lbl}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={card}>
            <div style={cardHeader}><AlertCircle size={14} color="#5b1f6a" /> Reminders</div>
            <div style={{ padding:'4px 16px 8px' }}>
              {['Files must comply with company policies and data protection regulations.','Content must be respectful, professional, and free from unauthorized confidential information.'].map((t,i,a) => (
                <div key={t} style={{ ...infoItem, borderBottom: i===a.length-1 ? 'none' : '0.5px solid #e2e0e7', fontSize:12 }}>
                  <CheckCircle2 size={13} color="#5b1f6a" style={{ flexShrink:0, marginTop:2 }} /><span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* POSTED UPDATES */}
      {posts.length > 0 && (
        <div>
          <div style={{ fontSize:14, fontWeight:600, color:'#1a1a2e', marginBottom:12, display:'flex', alignItems:'center', gap:8 }}>
            <Upload size={15} color="#5b1f6a" /> Posted updates
          </div>
          {posts.map(post => (
            <div key={post.id} style={{ ...card, marginBottom:16 }}>
              <div style={{ padding:'16px 16px 12px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:8 }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:'#5b1f6a', marginBottom:4 }}>{post.title}</div>
                    <span style={{ fontSize:11, fontWeight:600, padding:'2px 9px', borderRadius:20, background:'#fef3cd', color:'#b7791f' }}>{post.category}</span>
                  </div>
                  <button onClick={() => handleDeletePost(post.id)} style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, color:'#c0392b', background:'#fdecea', border:'1px solid #fdecea', borderRadius:8, padding:'5px 10px', cursor:'pointer', fontWeight:600, fontFamily:'inherit', flexShrink:0 }}>
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
                <div style={{ fontSize:13, color:'#4a4760', lineHeight:1.7, marginBottom:10 }}>{post.description}</div>
                <div style={{ fontSize:12, color:'#8b8999', marginBottom:4 }}>Progress: <strong>{post.progress}%</strong></div>
                <div style={{ height:7, background:'#e2e0e7', borderRadius:4, overflow:'hidden', marginBottom:12 }}>
                  <div style={{ height:7, background:'#5b1f6a', borderRadius:4, width:`${post.progress}%` }} />
                </div>
                {['jpg','jpeg','png','gif'].includes(ext(post.file_path)) && (
                  <img src={post.file_path.startsWith("/uploads") ? post.file_path : `/uploads/${post.file_path}`} alt={post.title} style={{ width:'100%', maxHeight:360, objectFit:'contain', borderRadius:8, border:'0.5px solid #e2e0e7', display:'block' }} />
                )}
                {['mp4','webm'].includes(ext(post.file_path)) && (
                  <video controls style={{ width:'100%', maxHeight:360, borderRadius:8, display:'block' }}>
                    <source src={post.file_path.startsWith("/uploads") ? post.file_path : `/uploads/${post.file_path}`} />
                  </video>
                )}
              </div>
              <div style={{ borderTop:'0.5px solid #e2e0e7', padding:'12px 16px' }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:'#8b8999', marginBottom:10 }}>Comments</div>
                {post.comments?.map(c => (
                  <div key={c.id} style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, background:'#f8f7fa', borderRadius:8, padding:'8px 12px', fontSize:13, marginBottom:6 }}>
                    <div><span style={{ fontWeight:600, color:'#5b1f6a' }}>{c.name}:</span> <span style={{ color:'#4a4760' }}>{c.comment}</span></div>
                    <button onClick={() => handleDeleteComment(c.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#c0392b', fontSize:11, fontWeight:600, flexShrink:0, fontFamily:'inherit' }}>delete</button>
                  </div>
                ))}
                <div style={{ display:'flex', gap:8, marginTop:8 }}>
                  <input type="text" value={commentText[post.id]||''} onChange={e=>setCommentText(p=>({...p,[post.id]:e.target.value}))}
                    onKeyDown={e=>e.key==='Enter'&&handleComment(post.id)}
                    placeholder="Write a comment..." style={{ flex:1, border:'1.5px solid #e2e0e7', borderRadius:8, padding:'7px 12px', fontSize:13, fontFamily:'inherit', outline:'none', background:'#f8f7fa' }} />
                  <button onClick={()=>handleComment(post.id)} style={{ padding:'0 14px', background:'#5b1f6a', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, fontFamily:'inherit' }}>
                    <Send size={14} /> Post
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}