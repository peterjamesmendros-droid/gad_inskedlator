'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, CalendarDays, BookOpen, Bell,
  Building2, Phone, BarChart3, LogOut, Menu, X
} from 'lucide-react';

function getInitials(name = '') {
  const parts = name.trim().split(' ');
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

export default function PortalLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState({ fullname: 'Guest' });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('session_user');
    if (saved) try { setUser(JSON.parse(saved)); } catch {}
  }, []);

  useEffect(() => { setIsMobileOpen(false); }, [pathname]);

  const handleSignOut = () => {
    localStorage.removeItem('session_user');
    router.push('/');
  };

  const navSections = [
    {
      label: 'Main',
      items: [
        { name: 'Dashboard',   path: '/dashboard', icon: LayoutDashboard },
        { name: 'Book a room', path: '/bookings',  icon: CalendarDays },
      ]
    },
    {
      label: 'Info',
      items: [
        { name: 'Learn',      path: '/learn',      icon: BookOpen },
        { name: 'Updates',    path: '/updates',    icon: Bell },
        { name: 'Facilities', path: '/facilities', icon: Building2 },
        { name: 'Contact',    path: '/contact',    icon: Phone },
        { name: 'Evaluation', path: '/evaluation', icon: BarChart3 },
      ]
    },
  ];

  const initials    = getInitials(user.fullname);
  const currentPage = navSections.flatMap(s => s.items).find(i => i.path === pathname)?.name ?? 'Portal';

  const TOPBAR_H  = 52;
  const SIDEBAR_W = 210;

  return (
    <div style={{ fontFamily:"'Poppins','Segoe UI',system-ui,sans-serif", minHeight:'100vh', background:'#f5f4f7' }}>

      {/* ══════════════════════════════════════════
          TOPBAR — full width, fixed, purple
          Exactly matches PHP .topbar
      ══════════════════════════════════════════ */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: TOPBAR_H,
        background: '#5b1f6a',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 16,
        zIndex: 100,
      }}>
        {/* Mobile hamburger */}
        <button
          className="mobile-hamburger"
          onClick={() => setIsMobileOpen(true)}
          style={{ background:'none', border:'none', color:'rgba(255,255,255,0.75)', cursor:'pointer', display:'none', padding:4, flexShrink:0 }}
        >
          <Menu size={20} />
        </button>

        {/* Brand — logo + name, same as PHP .topbar-brand */}
        <Link href="/dashboard" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', flexShrink:0 }}>
          <img src="/logo/dlogo.png" alt="DICT"
            style={{ width:32, height:32, objectFit:'contain', display:'block' }} />
          <span style={{ fontSize:14, fontWeight:700, color:'#fff', letterSpacing:'0.03em', whiteSpace:'nowrap' }}>
            GAD Inskedlator
          </span>
        </Link>

        {/* Divider */}
        <div style={{ width:1, height:20, background:'rgba(255,255,255,0.2)', flexShrink:0 }} />

        {/* Current page name */}
        <span style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>
          {currentPage}
        </span>

        {/* Right: user pill + logout */}
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:14 }}>
          <div style={{
            display:'flex', alignItems:'center', gap:8,
            background:'rgba(255,255,255,0.1)',
            border:'0.5px solid rgba(255,255,255,0.18)',
            borderRadius:20, padding:'4px 12px 4px 4px',
          }}>
            <div style={{
              width:28, height:28, borderRadius:'50%',
              background:'#FFD700', color:'#5b1f6a',
              fontSize:11, fontWeight:700,
              display:'flex', alignItems:'center', justifyContent:'center',
              textTransform:'uppercase', flexShrink:0,
            }}>
              {initials}
            </div>
            <span style={{ fontSize:12.5, fontWeight:500, color:'rgba(255,255,255,0.9)', whiteSpace:'nowrap' }}>
              {user.fullname}
            </span>
          </div>
          <button onClick={handleSignOut} title="Sign out" style={{
            background:'none', border:'none',
            color:'rgba(255,255,255,0.65)', cursor:'pointer',
            display:'flex', alignItems:'center', padding:4, borderRadius:8,
          }}>
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          BODY WRAPPER — sits below topbar
          Exactly matches PHP .body-wrapper
      ══════════════════════════════════════════ */}
      <div style={{
        display: 'flex',
        marginTop: TOPBAR_H,
        minHeight: `calc(100vh - ${TOPBAR_H}px)`,
      }}>

        {/* ── DESKTOP SIDEBAR — fixed, below topbar ── */}
        <nav
          className="desktop-sidebar"
          style={{
            width: SIDEBAR_W,
            background: '#fff',
            borderRight: '0.5px solid #e2e0e7',
            position: 'fixed',
            top: TOPBAR_H,
            bottom: 0,
            left: 0,
            zIndex: 90,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ flex:1, paddingTop:14, paddingBottom:8 }}>
            {navSections.map(section => (
              <div key={section.label}>
                <span style={{
                  display:'block', fontSize:'9.5px', fontWeight:700,
                  letterSpacing:'0.1em', textTransform:'uppercase',
                  color:'#8b8999', padding:'10px 16px 5px', display:'block',
                }}>
                  {section.label}
                </span>
                {section.items.map(item => {
                  const Icon     = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link key={item.path} href={item.path} style={{
                      display:'flex', alignItems:'center', gap:10,
                      padding:'9px 16px', fontSize:13,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#5b1f6a' : '#4a4760',
                      textDecoration: 'none',
                      borderLeft: `3px solid ${isActive ? '#5b1f6a' : 'transparent'}`,
                      background: isActive ? '#f0e6f5' : 'transparent',
                      transition: 'background 0.12s',
                    }}>
                      <Icon size={17} color={isActive ? '#5b1f6a' : '#8b8999'} style={{ flexShrink:0 }} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}

            <div style={{ height:'0.5px', background:'#e2e0e7', margin:'6px 16px' }} />

            <button onClick={handleSignOut} style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'9px 16px', fontSize:13, color:'#4a4760',
              background:'none', border:'none', width:'100%',
              textAlign:'left', cursor:'pointer',
              borderLeft:'3px solid transparent',
            }}>
              <LogOut size={17} color="#8b8999" />
              <span>Sign out</span>
            </button>
          </div>

          {/* User pill at bottom of sidebar */}
          <div style={{
            padding:'12px 14px',
            borderTop:'0.5px solid #e2e0e7',
            display:'flex', alignItems:'center', gap:9,
          }}>
            <div style={{
              width:28, height:28, borderRadius:'50%',
              background:'#5b1f6a', color:'#FFD700',
              fontSize:11, fontWeight:700,
              display:'flex', alignItems:'center', justifyContent:'center',
              flexShrink:0, textTransform:'uppercase',
            }}>
              {initials}
            </div>
            <div style={{ overflow:'hidden', minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:600, color:'#1a1a2e', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {user.fullname}
              </div>
              <div style={{ fontSize:10.5, color:'#8b8999', textTransform:'uppercase', letterSpacing:'0.04em' }}>
                Employee
              </div>
            </div>
          </div>
        </nav>

        {/* ── MOBILE OVERLAY ── */}
        {isMobileOpen && (
          <div onClick={() => setIsMobileOpen(false)} style={{
            position:'fixed', inset:0,
            background:'rgba(0,0,0,0.45)', zIndex:110,
          }} />
        )}

        {/* ── MOBILE DRAWER ── */}
        <nav style={{
          position:'fixed', top:TOPBAR_H, bottom:0, left:0,
          width:SIDEBAR_W, background:'#fff', zIndex:120,
          transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition:'transform 0.25s ease',
          boxShadow:'4px 0 20px rgba(0,0,0,0.15)',
          overflowY:'auto',
        }}>
          {navSections.map(section => (
            <div key={section.label}>
              <span style={{
                display:'block', fontSize:'9.5px', fontWeight:700,
                letterSpacing:'0.1em', textTransform:'uppercase',
                color:'#8b8999', padding:'10px 16px 5px', display:'block',
              }}>
                {section.label}
              </span>
              {section.items.map(item => {
                const Icon     = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link key={item.path} href={item.path} style={{
                    display:'flex', alignItems:'center', gap:10,
                    padding:'9px 16px', fontSize:13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#5b1f6a' : '#4a4760',
                    textDecoration:'none',
                    borderLeft:`3px solid ${isActive ? '#5b1f6a' : 'transparent'}`,
                    background: isActive ? '#f0e6f5' : 'transparent',
                  }}>
                    <Icon size={17} color={isActive ? '#5b1f6a' : '#8b8999'} style={{ flexShrink:0 }} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
          <div style={{ height:'0.5px', background:'#e2e0e7', margin:'6px 16px' }} />
          <button onClick={handleSignOut} style={{
            display:'flex', alignItems:'center', gap:10,
            padding:'9px 16px', fontSize:13, color:'#4a4760',
            background:'none', border:'none', width:'100%',
            textAlign:'left', cursor:'pointer',
            borderLeft:'3px solid transparent',
          }}>
            <LogOut size={17} color="#8b8999" />
            <span>Sign out</span>
          </button>
        </nav>

        {/* ── MAIN CONTENT — offset by sidebar ── */}
        <main style={{
          marginLeft: SIDEBAR_W,
          flex: 1,
          minWidth: 0,
          background: '#f5f4f7',
        }} className="main-content-area">
          {children}
        </main>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .desktop-sidebar { display: none !important; }
          .main-content-area { margin-left: 0 !important; }
          .mobile-hamburger { display: flex !important; }
        }
      `}</style>

    </div>
  );
}