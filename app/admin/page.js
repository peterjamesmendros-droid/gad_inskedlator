'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, CalendarCheck, Mail, BarChart3, 
  LogOut, Upload, Send, Trash2, CheckCircle2, AlertCircle, Info, MessageSquare, Menu, X
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  
  const [metrics, setMetrics] = useState({ totalBookings: 0, pendingCount: 0, totalUsers: 0, unreadCount: 0 });
  const [posts, setPosts] = useState([]);
  const [formProgress, setFormProgress] = useState(40);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle state

  const fetchDashboardTelemetry = useCallback(async () => {
    try {
      const metricRes = await fetch('/api/admin/metrics');
      const metricData = await metricRes.json();
      if (metricData.success) setMetrics(metricData.metrics);

      const postsRes = await fetch('/api/admin/posts');
      const postsData = await postsRes.json();
      if (postsData.success) setPosts(postsData.posts || []);
    } catch (err) {
      console.error("Telemetry sync exception:", err);
    }
  }, []);

  useEffect(() => {
    fetchDashboardTelemetry();
    const interval = setInterval(fetchDashboardTelemetry, 10000);
    return () => clearInterval(interval);
  }, [fetchDashboardTelemetry]);

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/auth/admin-logout', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/login'); 
      }
    } catch (err) {
      console.error("Sign out failure:", err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/admin/posts', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        e.target.reset();
        setFormProgress(40);
        fetchDashboardTelemetry();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/admin/posts?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchDashboardTelemetry();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    try {
      const res = await fetch('/api/admin/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upload_id: postId, name: 'admin', comment: text }),
      });
      const data = await res.json();
      if (data.success) {
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        fetchDashboardTelemetry(); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Remove this comment?")) return;
    try {
      const res = await fetch(`/api/admin/comments?id=${commentId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchDashboardTelemetry();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf2]/40 text-[#334155] font-sans antialiased flex flex-col">
      
      {/* Top Banner Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#521956] text-white px-4 md:px-6 flex items-center justify-between z-50 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburguer Toggle Button */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-1 hover:bg-white/10 rounded-lg lg:hidden"
            aria-label="Toggle Navigation Sidebar"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-extrabold text-sm md:text-lg tracking-wide">GAD Inskedlator Portal</span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 bg-white/10 px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl text-xs font-semibold">
            <div className="w-5 h-5 rounded-full bg-amber-400 text-[#521956] font-black flex items-center justify-center text-[10px]">AD</div>
            <span className="hidden sm:inline">admin</span>
          </div>
          <button onClick={handleSignOut} className="p-2 hover:bg-white/10 rounded-xl transition-all text-purple-100" title="Sign Out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 pt-16 relative">
        
        {/* Navigation Sidebar Backdrop Overlay for Mobile Viewports */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)} 
            className="fixed inset-0 top-16 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          />
        )}
        
        {/* Fully Responsive Drawer Sidebar Layout */}
        <aside className={`
          w-64 fixed top-16 bottom-0 left-0 bg-white border-r border-slate-100 p-4 flex flex-col justify-between z-40 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}>
          <nav className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 block mb-2">Admin</span>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-purple-50 text-[#521956] border border-purple-100/50">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </a>
            <a href="/admin/bookings" className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
              <div className="flex items-center gap-3"><CalendarCheck className="w-4 h-4" /> Bookings</div>
              <span className="bg-[#521956] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{metrics.pendingCount}</span>
            </a>
            <a href="/admin/messages" className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
              <div className="flex items-center gap-3"><Mail className="w-4 h-4" /> Messages</div>
              <span className="bg-purple-900/40 text-[#521956] text-[10px] font-bold px-2 py-0.5 rounded-full">{metrics.unreadCount}</span>
            </a>
            <a href="/admin/evaluations" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
              <BarChart3 className="w-4 h-4" /> Evaluations
            </a>
          </nav>
          
          {/* Sidebar Sign Out Trigger Button Component */}
          <button 
            onClick={handleSignOut} 
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 w-full text-left mt-auto shadow-xs bg-rose-50/10"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </aside>

        {/* Primary Content Panel Fluid Grid Workspace */}
        <main className="flex-1 w-full lg:ml-64 p-4 sm:p-6 md:p-8 overflow-y-auto space-y-6 bg-[#f8fafc]">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Admin dashboard</h1>
            <p className="text-xs text-slate-400 mt-0.5">Post facility updates and manage the system.</p>
          </div>

          {/* Metric Adaptive Grid Panels Layout */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
            {[
              { label: "Total bookings", value: metrics.totalBookings, color: "border-l-[#521956]" },
              { label: "Pending approval", value: metrics.pendingCount, color: "border-l-amber-500" },
              { label: "Registered users", value: metrics.totalUsers, color: "border-l-emerald-600" },
              { label: "Unread messages", value: metrics.unreadCount, color: "border-l-rose-500" }
            ].map((card, idx) => (
              <div key={idx} className={`bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm border-l-4 ${card.color} flex flex-col justify-between h-24`}>
                <span className="text-xs font-medium text-slate-400">{card.label}</span>
                <span className="text-2xl font-bold text-slate-800 tracking-tight">{card.value}</span>
              </div>
            ))}
          </section>

          {/* Core App Responsive Workspace Layout Grid Splits */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Primary Center Action Columns Layout */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Facility Update Form Component */}
              <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-4 sm:p-6">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3.5 mb-5 uppercase tracking-wide">
                  <Upload className="w-3.5 h-3.5 text-[#521956]" /> Post a facility update
                </h3>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Title</label>
                    <input className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs outline-none focus:border-purple-600 transition-all text-slate-700" type="text" name="title" placeholder="Update title" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Description</label>
                    <textarea className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs outline-none focus:border-purple-600 transition-all text-slate-700" name="description" rows="4" placeholder="Describe the update..." required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Facility Type</label>
                    <select className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs outline-none focus:border-purple-600 transition-all text-slate-700" name="category">
                      <option value="Child-Minding">Child-Minding</option>
                      <option value="Lactation Room">Lactation Room Improvements</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Upload Photo / Video</label>
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
                      <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 border-r border-slate-200 cursor-pointer transition-all text-xs font-medium shrink-0">
                        Choose File
                        <input type="file" name="file" className="hidden" accept="image/*,video/*" />
                      </label>
                      <span className="text-xs text-slate-400 px-3 truncate">No file chosen</span>
                    </div>
                  </div>
                  <div className="space-y-2 pt-1">
                    <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-500">Progress — {formProgress}%</span>
                    <input className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#521956]" type="range" name="progress" min="0" max="100" value={formProgress} onChange={(e) => setFormProgress(parseInt(e.target.value))} />
                  </div>
                  <button className="w-full bg-[#521956] hover:bg-purple-900 text-white text-xs font-bold py-2.5 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2" type="submit" disabled={isSubmitting}>
                    <Send className="w-3.5 h-3.5" /> {isSubmitting ? "Uploading..." : "Post update"}
                  </button>
                </form>
              </div>

              {/* Exact Replicated Posted Updates Timeline Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-800 px-1 py-1">
                  <MessageSquare className="w-4 h-4 text-[#521956]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Posted updates</h3>
                </div>

                {posts.map((post) => (
                  <div key={post.id} className="bg-white border border-slate-200/70 rounded-xl shadow-sm p-4 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-1.5">
                        <h4 className="font-black text-rose-800 text-sm tracking-tight uppercase break-words">{post.title}</h4>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold tracking-wide inline-block">
                          {post.category}
                        </span>
                      </div>
                      <button onClick={() => handleDeletePost(post.id)} className="text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-lg font-bold border border-rose-200/40 transition-all flex items-center gap-1 self-start sm:self-auto">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-wrap break-words">{post.description}</p>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Progress: <strong className="text-slate-600">{post.progress}%</strong></span>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#521956] h-full transition-all duration-500" style={{ width: `${post.progress}%` }} />
                      </div>
                    </div>

                    {post.file_path && (
                      <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50 flex justify-center p-2 max-h-[420px]">
                        <img src={post.file_path} alt={post.title} className="object-contain rounded-lg max-h-[400px] w-full h-auto shadow-sm" />
                      </div>
                    )}

                    {/* Comments Node Segment */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Comments</span>
                      
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {post.comments && post.comments.map((comment) => (
                          <div key={comment.id} className="bg-slate-50/80 border border-slate-100 rounded-xl px-3 py-2 flex items-center justify-between group gap-2">
                            <div className="text-xs leading-relaxed break-words min-w-0 flex-1">
                              <strong className="text-purple-950 font-bold mr-1.5 shrink-0">{comment.name}:</strong>
                              <span className="text-slate-600 font-medium">{comment.comment}</span>
                            </div>
                            <button onClick={() => handleDeleteComment(comment.id)} className="text-[10px] text-rose-500 hover:underline font-bold lg:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              delete
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 pt-1">
                        <input 
                          type="text" 
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Write a comment..."
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs outline-none focus:border-purple-600 font-medium text-slate-700"
                        />
                        <button onClick={() => handleAddComment(post.id)} className="bg-[#521956] hover:bg-purple-900 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0">
                          <Send className="w-3 h-3" /> Post
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>

            {/* Right-Side Meta Informational Benchmarks Grid Blocks Layout */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#521956]" /> Facility focus
                </h3>
                <ul className="text-xs space-y-3 text-slate-600 font-medium">
                  <li>✓ Child-Minding Center Development</li>
                  <li>✓ Lactation Room Improvements</li>
                  <li>✓ Renovation & Equipment Updates</li>
                </ul>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-5 space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#521956]" /> Progress guide
                </h3>
                <div className="space-y-2 text-xs text-slate-600 font-medium">
                  <div>• <strong>0–30%</strong> Planning stage</div>
                  <div>• <strong>40–70%</strong> Implementation</div>
                  <div>• <strong>80–100%</strong> Completed</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-5 space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#521956]" /> Reminders
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Files must comply with company policies and data protection regulations. Content must be respectful and free from unauthorized confidential info.
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}