'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, CalendarCheck, Mail, BarChart3, 
  LogOut, Menu, X 
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [metrics, setMetrics] = useState({ pendingCount: 1, unreadCount: 0 }); 

const fetchSidebarTelemetry = useCallback(async () => {
  try {
    // Hit the dedicated metrics endpoint directly
    const res = await fetch('/api/admin/metrics', { cache: 'no-store' });
    const data = await res.json();
    
    if (data.success && data.metrics) {
      setMetrics({
        pendingCount: data.metrics.pendingCount,
        unreadCount: data.metrics.unreadCount
      });
    }
  } catch (err) {
    console.error("Sidebar metrics failure:", err);
  }
}, []);

  useEffect(() => {
    fetchSidebarTelemetry();
    const interval = setInterval(fetchSidebarTelemetry, 10000);
    return () => clearInterval(interval);
  }, [fetchSidebarTelemetry]);

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

  return (
    <div className="min-h-screen bg-[#fdfaf2]/40 text-[#334155] font-sans antialiased flex flex-col">
      
      {/* Top Banner Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#521956] text-white px-4 md:px-6 flex items-center justify-between z-50 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Toggle Button */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-1 hover:bg-white/10 rounded-lg lg:hidden"
            aria-label="Toggle Navigation Sidebar"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-extrabold text-sm md:text-lg tracking-wide">GAD Inskedlator Portal</span>
        </div>
        
        {/* Header Right Content: Admin Avatar Profile Badge + Sign Out */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 bg-white/10 px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl text-xs font-semibold">
            <div className="w-5 h-5 rounded-full bg-amber-400 text-[#521956] font-black flex items-center justify-center text-[10px]">AD</div>
            <span className="hidden sm:inline">Admin</span>
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
            
            {/* Dashboard Link */}
            <Link 
              href="/admin" 
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                pathname === '/admin' 
                  ? 'bg-purple-50 text-[#521956] border border-purple-100/50' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            
            {/* Bookings Link with Pending Count Badge */}
            <Link 
              href="/admin/bookings" 
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                pathname === '/admin/bookings' 
                  ? 'bg-purple-50 text-[#521956] border border-purple-100/50' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3"><CalendarCheck className="w-4 h-4" /> Bookings</div>
              <span className="bg-[#521956] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{metrics.pendingCount}</span>
            </Link>
            
            {/* Messages Link with Unread Count Badge */}
            <Link 
              href="/admin/messages" 
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                pathname === '/admin/messages' 
                  ? 'bg-purple-50 text-[#521956] border border-purple-100/50' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3"><Mail className="w-4 h-4" /> Messages</div>
              <span className="bg-purple-900/40 text-[#521956] text-[10px] font-bold px-2 py-0.5 rounded-full">{metrics.unreadCount}</span>
            </Link>
            
            {/* Evaluations Link */}
            <Link 
              href="/admin/evaluations" 
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                pathname === '/admin/evaluations' 
                  ? 'bg-purple-50 text-[#521956] border border-purple-100/50' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Evaluations
            </Link>
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
          {children}
        </main>
      </div>
    </div>
  );
}