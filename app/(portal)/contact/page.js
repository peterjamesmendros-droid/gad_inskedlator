'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Mail, Phone, Clock, MapPin, Send, ClipboardList, BookOpen, Shield, AlertTriangle } from 'lucide-react';

const card = { background:'#fff', border:'0.5px solid #e2e0e7', borderRadius:12, overflow:'hidden', marginBottom:16 };
const cardHeader = { padding:'12px 16px', borderBottom:'0.5px solid #e2e0e7', display:'flex', alignItems:'center', gap:8 };
const cardTitle = { fontSize:13, fontWeight:600, color:'#1a1a2e', display:'flex', alignItems:'center', gap:7 };
const infoRow = { display:'flex', alignItems:'center', gap:11, padding:'10px 16px', borderBottom:'0.5px solid #e2e0e7', fontSize:13, color:'#4a4760' };
const listItem = { display:'flex', gap:10, padding:'8px 16px', borderBottom:'0.5px solid #e2e0e7', fontSize:13, color:'#4a4760', lineHeight:1.5 };
const sectionHeading = { fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'#8b8999', padding:'10px 16px 6px' };
const inputStyle = { width:'100%', border:'1.5px solid #e2e0e7', borderRadius:8, padding:'9px 12px', fontSize:13.5, fontFamily:'inherit', color:'#1a1a2e', background:'#f6f5f8', outline:'none', boxSizing:'border-box' };
const labelStyle = { display:'block', fontSize:10.5, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'#4a4760', marginBottom:6 };

export default function ContactPage() {
  const [form, setForm]       = useState({ name:'', email:'', subject:'', message:'' });
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('session_user');
    if (saved) try {
      const u = JSON.parse(saved);
      setForm(f => ({ ...f, name: u.fullname || '' }));
    } catch {}
  }, []);

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setSuccess(''); setError('');
    try {
      const res  = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
      const json = await res.json();
      if (json.success) { setSuccess(json.message); setForm(f => ({ ...f, subject:'', message:'' })); }
      else setError(json.message);
    } catch { setError('Error sending message. Please try again.'); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ padding:'26px 26px 40px' }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:18, fontWeight:700, color:'#1a1a2e' }}>Contact us</div>
        <div style={{ fontSize:12, color:'#8b8999', marginTop:3 }}>Inquiries, booking concerns, and feedback.</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:18, alignItems:'start' }}>

        {/* LEFT */}
        <div>
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}><Mail size={14} color="#5b1f6a" /> Send us a message</div>
            </div>
            <div style={{ padding:'16px 16px 20px' }}>
              {success && <div style={{ display:'flex', alignItems:'center', gap:8, background:'#e6f5ef', border:'0.5px solid #b7e0cc', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#2e7d5a', marginBottom:14 }}><CheckCircle2 size={16}/>{success}</div>}
              {error   && <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fdecea', border:'0.5px solid #f5b7b1', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#c0392b', marginBottom:14 }}><AlertCircle size={16}/>{error}</div>}
              <form onSubmit={submit}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                  <div><label style={labelStyle}>Full name</label><input style={inputStyle} name="name" value={form.name} onChange={handle} placeholder="Maria Santos" required /></div>
                  <div><label style={labelStyle}>Email address</label><input style={inputStyle} name="email" type="email" value={form.email} onChange={handle} placeholder="you@dict.gov.ph" required /></div>
                </div>
                <div style={{ marginBottom:12 }}><label style={labelStyle}>Subject</label><input style={inputStyle} name="subject" value={form.subject} onChange={handle} placeholder="Booking inquiry / Room concern" required /></div>
                <div style={{ marginBottom:16 }}><label style={labelStyle}>Message</label><textarea style={{ ...inputStyle, resize:'vertical', minHeight:90, padding:12 }} name="message" value={form.message} onChange={handle} rows={5} placeholder="Describe your concern or inquiry..." required /></div>
                <button type="submit" disabled={loading} style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'0 18px', height:38, background:'#5b1f6a', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                  <Send size={14} /> {loading ? 'Sending...' : 'Send message'}
                </button>
              </form>
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}><ClipboardList size={14} color="#5b1f6a" /> Booking guidelines & reminders</div>
            </div>
            <div>
              <div style={sectionHeading}>Guidelines</div>
              {['Submit requests at least 2 days in advance.','Provide complete and accurate information.','Wait for official confirmation before use.','Bring valid identification upon arrival.'].map(t => (
                <div key={t} style={listItem}><span style={{ color:'#5b1f6a', fontSize:16, flexShrink:0, marginTop:-1 }}>·</span><span>{t}</span></div>
              ))}
              <div style={sectionHeading}>Important reminders</div>
              {['Follow all facility rules and maintain cleanliness.','Respect assigned schedules and time slots.','Report any issues immediately to staff.'].map(t => (
                <div key={t} style={listItem}><span style={{ color:'#5b1f6a', fontSize:16, flexShrink:0, marginTop:-1 }}>·</span><span>{t}</span></div>
              ))}
              <div style={sectionHeading}>Safety protocols</div>
              {['Wear proper identification at all times.','Sanitize hands before and after using facilities.','Follow emergency exit routes and instructions.'].map((t,i,a) => (
                <div key={t} style={{ ...listItem, borderBottom: i===a.length-1 ? 'none' : '0.5px solid #e2e0e7' }}><span style={{ color:'#5b1f6a', fontSize:16, flexShrink:0, marginTop:-1 }}>·</span><span>{t}</span></div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div style={card}>
            <div style={cardHeader}><div style={cardTitle}><BookOpen size={14} color="#5b1f6a" /> Contact details</div></div>
            <div>
              <div style={infoRow}><Mail size={15} color="#5b1f6a" style={{ flexShrink:0 }} /> gad@dict.gov.ph</div>
              <div style={infoRow}><Phone size={15} color="#5b1f6a" style={{ flexShrink:0 }} /> (02) 123-4567</div>
              <div style={{ ...infoRow, borderBottom:'none' }}><Clock size={15} color="#5b1f6a" style={{ flexShrink:0 }} /> Mon–Fri, 8:00 AM – 5:00 PM</div>
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}><div style={cardTitle}><MapPin size={14} color="#5b1f6a" /> Location</div></div>
            <div style={{ overflow:'hidden', borderRadius:'0 0 12px 12px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.3466005379987!2d121.03938157487347!3d14.636256185854297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b7aedff02f6b%3A0x687a194ab0fa6d46!2sDepartment%20of%20Information%20and%20Communications%20Technology!5e0!3m2!1sen!2sph"
                width="100%" height="190" style={{ border:0, display:'block' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}><div style={cardTitle}><AlertTriangle size={14} color="#5b1f6a" /> Emergency contacts</div></div>
            <div>
              <div style={infoRow}><Shield size={15} color="#5b1f6a" style={{ flexShrink:0 }} /> Clinic: 0912-345-6789</div>
              <div style={{ ...infoRow, borderBottom:'none' }}><Shield size={15} color="#5b1f6a" style={{ flexShrink:0 }} /> Security: 0998-123-4567</div>
            </div>
          </div>

          <div style={{ ...card, marginBottom:0 }}>
            <div style={cardHeader}><div style={cardTitle}><Clock size={14} color="#5b1f6a" /> Response time</div></div>
            <div style={{ padding:'12px 16px', fontSize:13, color:'#4a4760', lineHeight:1.6 }}>
              Booking confirmations and inquiries are typically processed within <strong>24–48 working hours</strong>. For follow-ups, please allow 1 business day for a reply.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}