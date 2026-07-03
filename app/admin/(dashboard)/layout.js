'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, CalendarCheck, Mail, BarChart3, LogOut } from 'lucide-react';

export default function AdminLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [counts, setCounts] = useState({ pending: 0, unread: 0 });

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [bRes, mRes] = await Promise.all([
          fetch('/api/admin/bookings'),
          fetch('/api/admin/messages'),
        ]);
        const bData = await bRes.json();
        const mData = await mRes.json();
        setCounts({
          pending: bData.bookings?.filter(b => b.status === 'pending').length ?? 0,
          unread:  mData.unreadCount ?? 0,
        });
      } catch {}
    }
    fetchCounts();
    const t = setInterval(fetchCounts, 15000);
    return () => clearInterval(t);
  }, []);

  const handleSignOut = async () => {
    await fetch('/api/auth/admin-logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard',   path: '/admin',             icon: LayoutDashboard, badge: null },
    { name: 'Bookings',    path: '/admin/bookings',    icon: CalendarCheck,   badge: counts.pending },
    { name: 'Messages',    path: '/admin/messages',    icon: Mail,            badge: counts.unread },
    { name: 'Evaluations', path: '/admin/evaluations', icon: BarChart3,       badge: null },
  ];

  const currentPage = navItems.find(i => i.path === pathname)?.name ?? 'Admin';
  const TOPBAR_H  = 52;
  const SIDEBAR_W = 210;

  return (
    <div style={{ fontFamily:"'Poppins','Segoe UI',system-ui,sans-serif", minHeight:'100vh', background:'#f5f4f7' }}>

      {/* TOPBAR — full width purple */}
      <div style={{ position:'fixed', top:0, left:0, right:0, height:TOPBAR_H, background:'#5b1f6a', display:'flex', alignItems:'center', padding:'0 20px', gap:16, zIndex:100 }}>
        <Link href="/admin" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', flexShrink:0 }}>
          <img src="/logo/dlogo.png" alt="DICT" style={{ width:32, height:32, objectFit:'contain', display:'block' }} />
          <span style={{ fontSize:14, fontWeight:700, color:'#fff', letterSpacing:'0.03em', whiteSpace:'nowrap' }}>GAD Inskedlator</span>
        </Link>
        <div style={{ width:1, height:20, background:'rgba(255,255,255,0.2)', flexShrink:0 }} />
        <span style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>{currentPage}</span>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.1)', border:'0.5px solid rgba(255,255,255,0.18)', borderRadius:20, padding:'4px 12px 4px 4px' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'#FFD700', color:'#5b1f6a', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>AD</div>
            <span style={{ fontSize:12.5, fontWeight:500, color:'rgba(255,255,255,0.9)' }}>Admin</span>
          </div>
          <button onClick={handleSignOut} title="Sign out" style={{ background:'none', border:'none', color:'rgba(255,255,255,0.65)', cursor:'pointer', display:'flex', alignItems:'center', padding:4, borderRadius:8 }}>
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* BODY WRAPPER */}
      <div style={{ display:'flex', marginTop:TOPBAR_H, minHeight:`calc(100vh - ${TOPBAR_H}px)` }}>

        {/* SIDEBAR */}
        <nav style={{ width:SIDEBAR_W, background:'#fff', borderRight:'0.5px solid #e2e0e7', position:'fixed', top:TOPBAR_H, bottom:0, left:0, zIndex:90, overflowY:'auto', display:'flex', flexDirection:'column' }}>
          <div style={{ flex:1, paddingTop:14, paddingBottom:8 }}>
            <span style={{ display:'block', fontSize:'9.5px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#8b8999', padding:'10px 16px 5px' }}>Admin</span>
            {navItems.map(item => {
              const Icon     = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 16px', fontSize:13, fontWeight: isActive ? 600 : 400, color: isActive ? '#5b1f6a' : '#4a4760', textDecoration:'none', borderLeft:`3px solid ${isActive ? '#5b1f6a' : 'transparent'}`, background: isActive ? '#f0e6f5' : 'transparent', transition:'background 0.12s', position:'relative' }}>
                  <Icon size={17} color={isActive ? '#5b1f6a' : '#8b8999'} style={{ flexShrink:0 }} />
                  <span style={{ flex:1 }}>{item.name}</span>
                  {item.badge > 0 && (
                    <span style={{ background:'#5b1f6a', color:'#fff', fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:10, minWidth:18, textAlign:'center' }}>{item.badge}</span>
                  )}
                </Link>
              );
            })}
            <div style={{ height:'0.5px', background:'#e2e0e7', margin:'6px 16px' }} />
            <button onClick={handleSignOut} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 16px', fontSize:13, color:'#4a4760', background:'none', border:'none', width:'100%', textAlign:'left', cursor:'pointer', borderLeft:'3px solid transparent' }}>
              <LogOut size={17} color="#8b8999" />
              <span>Sign out</span>
            </button>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main style={{ marginLeft:SIDEBAR_W, flex:1, minWidth:0, background:'#f5f4f7' }}>
          {children}
        </main>
      </div>
    </div>
  );
}