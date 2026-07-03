'use client';

import { useState, useEffect } from 'react';
import { Send, Trash2, MessageSquare, Bell } from 'lucide-react';

const card = { background:'#fff', border:'0.5px solid #e2e0e7', borderRadius:12, overflow:'hidden', marginBottom:16 };

export default function UpdatesPage() {
  const [posts, setPosts]           = useState([]);
  const [user, setUser]             = useState({ fullname:'Guest' });
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('session_user');
    if (saved) try { setUser(JSON.parse(saved)); } catch {}
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch('/api/updates');
      const json = await res.json();
      if (json.success) setPosts(json.posts);
    } catch {}
    finally { setLoading(false); }
  }

  async function handleComment(uploadId) {
    const text = (commentText[uploadId] || '').trim();
    if (!text) return;
    await fetch('/api/updates', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ upload_id:uploadId, comment:text, user_name:user.fullname }) });
    setCommentText(p => ({ ...p, [uploadId]:'' }));
    fetchPosts();
  }

  async function handleDelete(commentId) {
    if (!confirm('Delete your comment?')) return;
    await fetch(`/api/updates?comment_id=${commentId}&user_name=${encodeURIComponent(user.fullname)}`, { method:'DELETE' });
    fetchPosts();
  }

  const ext = (path) => (path?.split('.').pop() || '').toLowerCase();

  return (
    <div style={{ padding:'26px 26px 40px' }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:18, fontWeight:700, color:'#1a1a2e' }}>Facility updates</div>
        <div style={{ fontSize:12, color:'#8b8999', marginTop:3 }}>Child-Minding Centre and Lactation Room announcements.</div>
      </div>

      {loading && <div style={{ ...card, padding:48, textAlign:'center', fontSize:13, color:'#8b8999' }}>Loading...</div>}

      {!loading && posts.length === 0 && (
        <div style={{ ...card, padding:48, textAlign:'center' }}>
          <Bell size={40} color="#e2e0e7" style={{ margin:'0 auto 12px', display:'block' }} />
          <div style={{ fontSize:13, color:'#8b8999' }}>No updates posted yet.</div>
        </div>
      )}

      {posts.map(post => (
        <div key={post.id} style={card}>
          <div style={{ padding:'16px 16px 12px' }}>
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:14, fontWeight:600, color:'#5b1f6a', marginBottom:4 }}>{post.title}</div>
              <span style={{ fontSize:11, fontWeight:600, padding:'2px 9px', borderRadius:20, background:'#fef3cd', color:'#b7791f' }}>{post.category}</span>
            </div>
            <div style={{ fontSize:13, color:'#4a4760', lineHeight:1.7, marginBottom:12 }}>{post.description}</div>
            <div style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#8b8999', marginBottom:4 }}>
                <span>Progress</span><span style={{ fontWeight:600 }}>{post.progress}%</span>
              </div>
              <div style={{ height:7, background:'#e2e0e7', borderRadius:4, overflow:'hidden' }}>
                <div style={{ height:7, background:'#5b1f6a', borderRadius:4, width:`${post.progress}%` }} />
              </div>
            </div>
            {['jpg','jpeg','png','gif'].includes(ext(post.file_path)) && (
              <img src={post.file_path.startsWith("/uploads") ? post.file_path : `/uploads/${post.file_path}`} alt={post.title} style={{ width:'100%', maxHeight:380, objectFit:'contain', borderRadius:8, border:'0.5px solid #e2e0e7' }} />
            )}
            {['mp4','webm'].includes(ext(post.file_path)) && (
              <video controls style={{ width:'100%', maxHeight:380, borderRadius:8 }}>
                <source src={post.file_path.startsWith("/uploads") ? post.file_path : `/uploads/${post.file_path}`} />
              </video>
            )}
          </div>

          <div style={{ borderTop:'0.5px solid #e2e0e7', padding:'12px 16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:'#8b8999', marginBottom:10 }}>
              <MessageSquare size={12} color="#8b8999" /> Comments
            </div>
            {post.comments?.length > 0 && (
              <div style={{ marginBottom:10 }}>
                {post.comments.map(c => (
                  <div key={c.id} style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, background:'#f8f7fa', borderRadius:8, padding:'8px 12px', fontSize:13, marginBottom:6 }}>
                    <div><span style={{ fontWeight:600, color:'#5b1f6a' }}>{c.name}:</span> <span style={{ color:'#4a4760' }}>{c.comment}</span></div>
                    {c.name === user.fullname && (
                      <button onClick={() => handleDelete(c.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#8b8999', padding:0, flexShrink:0, marginTop:2 }}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div style={{ display:'flex', gap:8 }}>
              <input type="text" value={commentText[post.id]||''} onChange={e=>setCommentText(p=>({...p,[post.id]:e.target.value}))}
                onKeyDown={e=>e.key==='Enter'&&handleComment(post.id)}
                placeholder="Write a comment..." style={{ flex:1, border:'1.5px solid #e2e0e7', borderRadius:8, padding:'7px 12px', fontSize:13, fontFamily:'inherit', outline:'none', background:'#f8f7fa' }} />
              <button onClick={()=>handleComment(post.id)} style={{ padding:'0 14px', background:'#5b1f6a', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', display:'flex', alignItems:'center' }}>
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}