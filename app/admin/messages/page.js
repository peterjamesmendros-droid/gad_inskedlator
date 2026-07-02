'use client';

import { useState, useEffect } from 'react';
import { Mail, Check, Trash2 } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages]     = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading]       = useState(true);

  useEffect(() => { fetchMessages(); }, []);

  async function fetchMessages() {
    try {
      const res  = await fetch('/api/messages');
      const json = await res.json();
      if (json.success) { setMessages(json.messages); setUnreadCount(json.unreadCount); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function markRead(id) {
    await fetch('/api/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchMessages();
  }

  async function deleteMsg(id) {
    if (!confirm('Delete this message permanently?')) return;
    await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
    fetchMessages();
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
        <p className="text-sm text-slate-500 mt-1">{unreadCount} unread — {messages.length} total</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading && <div className="p-8 text-center text-sm text-slate-400">Loading...</div>}

        {!loading && messages.length === 0 && (
          <div className="p-12 text-center text-sm text-slate-400">No messages yet.</div>
        )}

        {messages.map(msg => {
          const isUnread = msg.status === 'Unread';
          return (
            <div key={msg.id} className={`grid grid-cols-[160px_180px_1fr_auto] gap-4 items-start px-5 py-4 border-b border-slate-50 last:border-0 transition-colors ${isUnread ? 'bg-purple-50/30' : ''}`}>

              <div>
                <div className="text-sm font-semibold text-slate-800">{msg.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{msg.email}</div>
                <span className={`mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full
                  ${isUnread ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-400'}`}>
                  {msg.status}
                </span>
              </div>

              <div>
                <div className="text-sm font-medium text-slate-700">{msg.subject}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {new Date(msg.date_sent).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                </div>
              </div>

              <div className="text-sm text-slate-500 leading-relaxed">{msg.message}</div>

              <div className="flex flex-col gap-2 items-end">
                {isUnread && (
                  <button onClick={() => markRead(msg.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-purple-700 transition-colors px-2 py-1 rounded hover:bg-purple-50">
                    <Check className="h-3.5 w-3.5" /> Mark read
                  </button>
                )}
                <button onClick={() => deleteMsg(msg.id)}
                  className="flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
