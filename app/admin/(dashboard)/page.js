'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Upload, Send, Trash2, CheckCircle2, MessageSquare, BarChart3, Image as ImageIcon
} from 'lucide-react';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({ totalBookings: 0, pendingCount: 0, totalUsers: 0, unreadCount: 0 });
  const [posts, setPosts] = useState([]);
  const [formProgress, setFormProgress] = useState(40);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('No file chosen');
  const [commentInputs, setCommentInputs] = useState({});

  const fetchDashboardTelemetry = useCallback(async () => {
    try {
      const metricRes = await fetch('/api/admin/metrics', { cache: 'no-store' });
      if (metricRes.ok) {
        const metricData = await metricRes.json();
        if (metricData.success) setMetrics(metricData.metrics);
      }

      const postsRes = await fetch('/api/admin/posts', { cache: 'no-store' });
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        if (postsData.success) setPosts(postsData.posts || []);
      }
    } catch (err) {
      console.error("Telemetry sync exception:", err);
    }
  }, []);

  useEffect(() => {
    fetchDashboardTelemetry();
    const interval = setInterval(fetchDashboardTelemetry, 10000);
    return () => clearInterval(interval);
  }, [fetchDashboardTelemetry]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFileName(file ? file.name : 'No file chosen');
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
        setSelectedFileName('No file chosen');
        fetchDashboardTelemetry();
      } else {
        alert(`Error posting update: ${data.error}`);
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
        body: JSON.stringify({ upload_id: Number(postId), name: 'Admin', comment: text }),
      });
      const data = await res.json();
      if (data.success) {
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        fetchDashboardTelemetry(); 
      } else {
        alert(`Comment Error: ${data.error}`);
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
    // FORCE HARDBOUND LAYOUT BOX WIDTH LIMITS
    <div className="w-full max-w-7xl mx-auto pt-6 pb-16 px-4 sm:px-6 lg:px-8 space-y-8 block clear-both">
      
      {/* Title Segment */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Post facility updates and manage the system.</p>
      </div>

      {/* Analytics Telemetry Block Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        {[
          { label: "Total bookings", value: metrics.totalBookings, color: "border-l-[#521956]" },
          { label: "Pending approval", value: metrics.pendingCount, color: "border-l-amber-500" },
          { label: "Registered users", value: metrics.totalUsers, color: "border-l-emerald-600" },
          { label: "Unread messages", value: metrics.unreadCount, color: "border-l-rose-500" }
        ].map((card, idx) => (
          <div key={idx} className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-xs border-l-4 ${card.color} flex flex-col justify-between h-24`}>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.label}</span>
            <span className="text-3xl font-black text-slate-800 tracking-tight">{card.value}</span>
          </div>
        ))}
      </section>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
        <div className="lg:col-span-2 space-y-6 w-full">
          
          {/* Main Submissions Form Container */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-4 sm:p-6">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3.5 mb-5 uppercase tracking-wide">
              <Upload className="w-3.5 h-3.5 text-[#521956]" /> Post a facility update
            </h3>
            <form onSubmit={handleCreatePost} className="space-y-4" encType="multipart/form-data">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Title</label>
                <input className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-purple-600 transition-all text-slate-700" type="text" name="title" placeholder="Update title" required />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Description</label>
                <textarea className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-purple-600 transition-all text-slate-700" name="description" rows="4" placeholder="Describe the update..." required />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Facility Type</label>
                <select className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-purple-600 transition-all text-slate-700" name="category">
                  <option value="Child-Minding">Child-Minding</option>
                  <option value="Lactation Room">Lactation Room Improvements</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Upload Photo / Video</label>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                  <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 border-r border-slate-200 cursor-pointer transition-all text-xs font-bold shrink-0">
                    Choose File
                    <input type="file" name="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                  </label>
                  <span className="text-xs text-slate-600 px-3 truncate font-medium">{selectedFileName}</span>
                </div>
              </div>

              {/* FIXED PROGRESS TRACK BAR ACCENTS AND STYLING OVERRIDES */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-500">Progress — {formProgress}%</span>
                </div>
                <input 
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#521956] bg-slate-100 outline-none block" 
                  type="range" 
                  name="progress" 
                  min="0" 
                  max="100" 
                  value={formProgress} 
                  onChange={(e) => setFormProgress(parseInt(e.target.value))} 
                  style={{
                    background: `linear-gradient(to right, #521956 0%, #521956 ${formProgress}%, #e2e8f0 ${formProgress}%, #e2e8f0 100%)`,
                    WebkitAppearance: 'none'
                  }}
                />
              </div>

              <button className="w-full bg-[#521956] hover:bg-purple-900 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2" type="submit" disabled={isSubmitting}>
                <Send className="w-3.5 h-3.5" /> {isSubmitting ? "Uploading..." : "Post update"}
              </button>
            </form>
          </div>

          {/* Timeline Feed Container */}
          <div className="space-y-4 w-full">
            <div className="flex items-center gap-2 text-slate-800 px-1 py-1">
              <MessageSquare className="w-4 h-4 text-[#521956]" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Posted updates</h3>
            </div>

            {posts.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-2">
                <ImageIcon className="w-8 h-8 text-slate-300" />
                <p className="text-xs font-medium text-slate-400">No updates posted yet. Fill out the form above to post your first update!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white border border-slate-200 rounded-2xl shadow-xs p-4 sm:p-6 space-y-4 w-full block">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 w-full">
                    <div className="space-y-1.5">
                      <h4 className="font-black text-rose-800 text-sm tracking-tight uppercase break-words">{post.title}</h4>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold tracking-wide inline-block">
                        {post.category}
                      </span>
                    </div>
                    <button onClick={() => handleDeletePost(post.id)} className="text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-xl font-bold border border-rose-200/40 transition-all flex items-center gap-1 self-start sm:self-auto">
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
                    <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 flex justify-center p-2 max-h-[420px]">
                      <img src={post.file_path} alt={post.title} className="object-contain rounded-xl max-h-[400px] w-full h-auto shadow-xs" />
                    </div>
                  )}

                  {/* Comment Thread Layout */}
                  <div className="pt-4 border-t border-slate-100 space-y-3 w-full">
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

                    <div className="flex flex-col sm:flex-row gap-2 pt-1 w-full">
                      <input 
                        type="text" 
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder="Write a comment..."
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-purple-600 font-medium text-slate-700 min-w-0"
                      />
                      <button onClick={() => handleAddComment(post.id)} className="bg-[#521956] hover:bg-purple-900 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0">
                        <Send className="w-3 h-3" /> Post
                      </button>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

        {/* Right Info Gutters */}
        <div className="space-y-6 w-full lg:sticky lg:top-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#521956]" /> Facility focus
            </h3>
            <ul className="text-xs space-y-3 text-slate-600 font-medium">
              <li>✓ Child-Minding Center Development</li>
              <li>✓ Lactation Room Improvements</li>
              <li>✓ Renovation & Equipment Updates</li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#521956]" /> Progress guide
            </h3>
            <div className="space-y-2 text-xs text-slate-600 font-medium">
              <div>• <strong>0–30%</strong> Planning stage</div>
              <div>• <strong>40–70%</strong> Implementation</div>
              <div>• <strong>80–100%</strong> Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}