'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, CalendarDays, BookOpen, Bell, 
  Building2, Phone, BarChart3, LogOut, Menu, X 
} from 'lucide-react';
// 1. Import your newly refactored Next.js Chatbot component
import Chatbot from '@/components/Chatbot';

export default function PortalLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState({ fullname: 'Guest' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load identity values upon state mount safely
  useEffect(() => {
    const savedUser = localStorage.getItem('session_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to parse user session info:", err);
      }
    }
  }, []);

  // Structural Safeguard: Close the sliding mobile menu whenever a link is selected
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = () => {
    localStorage.removeItem('session_user');
    router.push('/');
  };

  // Automated layout linkage matrix array
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Main' },
    { name: 'Book a room', path: '/bookings', icon: CalendarDays, category: 'Main' },
    { name: 'Learn', path: '/learn', icon: BookOpen, category: 'Info' },
    { name: 'Updates', path: '/updates', icon: Bell, category: 'Info' },
    { name: 'Facilities', path: '/facilities', icon: Building2, category: 'Info' },
    { name: 'Contact', path: '/contact', icon: Phone, category: 'Info' },
    { name: 'Evaluation', path: '/evaluation', icon: BarChart3, category: 'Info' },
  ];

  // Navigation Links View Helper Matrix
  const NavigationLinks = () => (
    <nav className="space-y-4">
      {['Main', 'Info'].map((category) => (
        <div key={category} className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1">
            {category}
          </p>
          {navItems
            .filter((item) => item.category === category)
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-50 text-purple-900 font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-purple-700' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-800 relative">
      
      {/* =========================================================
          1. DESKTOP PERMANENT NAVIGATION SIDEBAR PANEL
         ========================================================= */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between shrink-0 fixed top-0 bottom-0 left-0 z-30">
        <div className="p-4 space-y-6">
          <div className="text-indigo-950 font-black text-xl tracking-wide px-2 uppercase">
            GAD Inskedlator
          </div>
          <NavigationLinks />
        </div>

        {/* Desktop User Profile Capsule Element */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="h-9 w-9 bg-purple-900 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase ring-2 ring-purple-100 shrink-0">
              {user.fullname.charAt(0)}
            </div>
            <div className="truncate min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{user.fullname}</p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Employee</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut} 
            title="Sign Out"
            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md transition-all shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* =========================================================
          2. MOBILE SIDEBAR DRAWER WITH BACKGROUND BLUR OVERLAY
         ========================================================= */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}
      <aside className={`
        fixed top-0 bottom-0 left-0 w-64 bg-white z-50 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out lg:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between px-2">
            <span className="text-indigo-950 font-black text-xl tracking-wide uppercase">GAD Inskedlator</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
          <NavigationLinks />
        </div>

        {/* Mobile Sidebar Sign Out Trigger Capsule */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="h-9 w-9 bg-purple-900 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase ring-2 ring-purple-100 shrink-0">
              {user.fullname.charAt(0)}
            </div>
            <div className="truncate min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{user.fullname}</p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Employee</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut} 
            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" /> Exit
          </button>
        </div>
      </aside>

      {/* =========================================================
          3. DYNAMIC CONTENT WORKSPACE TRACK LAYOUT
         ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        
        {/* Universal Top Fixed Header Panel */}
        <header className="h-16 bg-purple-900 flex items-center justify-between px-4 sm:px-6 shadow-md text-white fixed top-0 left-0 right-0 z-20 lg:left-64">
          <div className="flex items-center gap-3 min-w-0">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 hover:bg-white/10 rounded-lg lg:hidden transition-colors shrink-0"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="text-xs sm:text-sm font-semibold tracking-wide uppercase truncate">
              {navItems.find((item) => item.path === pathname)?.name || 'Portal'}
            </div>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
            <div className="flex items-center space-x-2 bg-white/10 pl-1.5 pr-3 py-1 rounded-full text-xs font-semibold select-none max-w-[140px] sm:max-w-xs">
              <div className="h-6 w-6 bg-amber-500 rounded-full flex items-center justify-center text-indigo-950 font-bold uppercase shadow-inner shrink-0 text-[10px]">
                {user.fullname.charAt(0)}
              </div>
              <span className="truncate hidden sm:inline">{user.fullname}</span>
            </div>
            <button 
              onClick={handleSignOut} 
              title="Sign Out"
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-200 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Main Sub-Page Workspace view container */}
        <main className="flex-1 h-screen pt-16 overflow-y-auto bg-slate-50">
          {children}
        </main>

      </div>

      {/* =========================================================
          4. GLOBAL ASSISTANT COMPONENT
         ========================================================= */}
      {/* Mounted globally at root base layer to safely clear nested overflow tracking vectors */}
      <Chatbot />
    </div>
  );
}