'use client';

import { useState, useEffect } from 'react';
import { Check, Trash2, Mail } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages]     = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => { fetchMessages(); }, []);

  async function fetchMessages() {
    try {
      const res  = await fetch('/api/admin/messages');
      const json = await res.json();
      if (json.success) { setMessages(json.messages); setUnreadCount(json.unreadCount); }
    } catch {}
  }

  async function markRead(id) {
    await fetch('/api/admin/messages', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id }) });
    fetchMessages();
  }

  async function deleteMsg(id) {
    if (!confirm('Delete this message permanently?')) return;
    await fetch(`/api/admin/messages?id=${id}`, { method:'DELETE' });
    fetchMessages();
  }

  return (
    <div style={{ padding:'26px 26px 40px' }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:18, fontWeight:700, color:'#1a1a2e' }}>Messages</div>
        <div style={{ fontSize:12, color:'#8b8999', marginTop:3 }}>{unreadCount} unread — {messages.length} total</div>
      </div>

      <div style={{ background:'#fff', border:'0.5px solid #e2e0e7', borderRadius:12, overflow:'hidden' }}>
        {messages.length === 0 && (
          <div style={{ padding:'48px 16px', textAlign:'center', fontSize:13, color:'#8b8999' }}>No messages yet.</div>
        )}
        {messages.map(msg => {
          const isUnread = msg.status === 'Unread';
          return (
            <div key={msg.id} style={{ display:'grid', gridTemplateColumns:'160px 200px 1fr auto', gap:16, alignItems:'start', padding:'14px 16px', borderBottom:'0.5px solid #e2e0e7', background: isUnread ? 'rgba(240,230,245,0.25)' : '#fff' }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'#1a1a2e' }}>{msg.name}</div>
                <div style={{ fontSize:11.5, color:'#8b8999', marginTop:2 }}>{msg.email}</div>
                <span style={{ display:'inline-block', marginTop:6, fontSize:10.5, fontWeight:700, padding:'2px 9px', borderRadius:20, background: isUnread ? '#f0e6f5' : '#f8f7fa', color: isUnread ? '#5b1f6a' : '#8b8999' }}>{msg.status}</span>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:500, color:'#1a1a2e' }}>{msg.subject}</div>
                <div style={{ fontSize:11.5, color:'#8b8999', marginTop:3 }}>{new Date(msg.date_sent).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'})}</div>
              </div>
              <div style={{ fontSize:13, color:'#4a4760', lineHeight:1.6 }}>{msg.message}</div>
              <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end' }}>
                {isUnread && (
                  <button onClick={() => markRead(msg.id)} style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, fontWeight:600, color:'#4a4760', background:'none', border:'0.5px solid #e2e0e7', borderRadius:6, padding:'4px 10px', cursor:'pointer', fontFamily:'inherit' }}>
                    <Check size={13} /> Mark read
                  </button>
                )}
                <button onClick={() => deleteMsg(msg.id)} style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, fontWeight:600, color:'#c0392b', background:'#fdecea', border:'none', borderRadius:6, padding:'4px 10px', cursor:'pointer', fontFamily:'inherit' }}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}