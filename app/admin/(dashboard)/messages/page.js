'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, Trash2, Mail } from 'lucide-react';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all contact messages from the API layer
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/messages');
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error fetching admin messages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Mark message status as 'Read'
  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Read' }),
      });
      const data = await res.json();
      if (data.success) {
        // Optimistically update local state or re-fetch telemetry data
        setMessages(prev =>
          prev.map(msg => (msg.id === id ? { ...msg, status: 'Read' } : msg))
        );
      }
    } catch (err) {
      console.error('Failed to update message status:', err);
    }
  };

  // Delete message record permanently
  const handleDeleteMessage = async (id) => {
    if (!confirm('Delete this message permanently?')) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.filter(msg => msg.id !== id));
      }
    } catch (err) {
      console.error('Failed to remove message record:', err);
    }
  };

  // Compute stats metrics dynamically
  const unreadCount = messages.filter(m => m.status === 'Unread').length;

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto pt-8 px-4 text-center text-xs font-medium text-slate-400">
        Loading workspace messages...
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pt-8 pb-16 px-4 sm:px-6 space-y-6">
      {/* View Header Meta Segment */}
      <div className="pb-2">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Messages</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          {unreadCount} unread — {messages.length} total
        </p>
      </div>

      {/* Primary Data Card Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {messages.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {messages.map((msg) => {
              const isUnread = msg.status === 'Unread';
              return (
                <div
                  key={msg.id}
                  className={`p-5 flex flex-col md:grid md:grid-cols-[200px_200px_1fr_auto] gap-4 items-start transition-colors ${
                    isUnread ? 'bg-purple-50/20' : 'hover:bg-slate-50/50'
                  }`}
                >
                  {/* Column 1: Identity Profile Info */}
                  <div className="space-y-1 min-w-0 w-full">
                    <div className="font-bold text-slate-800 text-sm truncate">{msg.name}</div>
                    <div className="text-xs text-slate-400 font-medium truncate">{msg.email}</div>
                    <div className="pt-1.5">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-wide uppercase ${
                          isUnread
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </div>
                  </div>

                  {/* Column 2: Subject Topic & Timestamp */}
                  <div className="space-y-1 w-full md:w-auto">
                    <div className="font-semibold text-slate-800 text-sm break-words">{msg.subject}</div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {new Date(msg.date_sent).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  {/* Column 3: Text Message Body */}
                  <div className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-wrap break-words pr-4 w-full">
                    {msg.message}
                  </div>

                  {/* Column 4: Context Interactions Workspace */}
                  <div className="flex items-center gap-2 self-end md:self-start shrink-0 pt-2 md:pt-0">
                    {isUnread && (
                      <button
                        onClick={() => handleMarkAsRead(msg.id)}
                        className="text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl px-3 py-1.5 transition-all flex items-center gap-1.5 shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Mark read
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/40 rounded-xl transition-all shadow-2xs"
                      title="Delete Permanently"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-xs font-semibold text-slate-400 flex flex-col items-center justify-center gap-2">
            <Mail className="w-6 h-6 text-slate-300" />
            No bookings found for this filter layout.
          </div>
        )}
      </div>
    </div>
  );
}