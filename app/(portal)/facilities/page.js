'use client';

import { useState } from 'react';
import { Building2, Star, CheckCircle2, ShieldCheck, Users, X } from 'lucide-react';

const card = { background:'#fff', border:'0.5px solid #e2e0e7', borderRadius:12, overflow:'hidden', marginBottom:16 };
const cardHeader = { padding:'12px 16px', borderBottom:'0.5px solid #e2e0e7', display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:600, color:'#1a1a2e' };
const sectionText = { fontSize:13, color:'#4a4760', lineHeight:1.7, textAlign:'justify' };
const listItem = { display:'flex', gap:10, padding:'9px 0', borderBottom:'0.5px solid #e2e0e7', fontSize:13, lineHeight:1.55, color:'#4a4760' };

export default function FacilitiesPage() {
  const [lightbox, setLightbox] = useState(null);

  function openLightbox(src, caption) { setLightbox({ src, caption }); }
  function closeLightbox() { setLightbox(null); }

  return (
    <div style={{ padding:'26px 26px 40px' }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:18, fontWeight:700, color:'#1a1a2e' }}>Facilities</div>
        <div style={{ fontSize:12, color:'#8b8999', marginTop:3 }}>Child-Minding Centre and Lactation Room information.</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:18, alignItems:'start' }}>

        {/* LEFT */}
        <div>
          <div style={card}>
            <div style={cardHeader}><Building2 size={14} color="#5b1f6a" /> Child-Minding Centre</div>
            <div style={{ padding:'14px 16px' }}>
              <p style={sectionText}>The Child-Minding Centre is a dedicated facility that provides a safe, nurturing, and child-friendly environment for the children of employees and visiting clients while they are within the workplace. This initiative supports working parents by ensuring their children are cared for in a secure and supervised space.</p>
              <img src="/fsp/cmc.png" alt="Child-Minding Centre"
                onClick={() => openLightbox('/fsp/cmc.png', 'The Child-Minding Centre provides a safe, nurturing, and child-friendly environment for the children of employees while they are in the workplace.')}
                style={{ width:'100%', borderRadius:12, cursor:'pointer', border:'0.5px solid #e2e0e7', marginTop:12, display:'block' }}
                onMouseEnter={e=>e.target.style.opacity='0.88'} onMouseLeave={e=>e.target.style.opacity='1'} />
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}><Star size={14} color="#5b1f6a" /> Breastfeeding / Lactation Room</div>
            <div style={{ padding:'14px 16px' }}>
              <p style={sectionText}>The Breastfeeding or Lactation Room is a private, clean, and comfortable space designed to support nursing mothers in the workplace. This facility allows mothers to breastfeed or express milk in a dignified and secure environment, promoting maternal health, child nutrition, and women's rights.</p>
              <img src="/fsp/bfr.png" alt="Lactation Room"
                onClick={() => openLightbox('/fsp/bfr.png', 'The Lactation Room is a private, clean, and comfortable space designed to support nursing mothers in the workplace.')}
                style={{ width:'100%', borderRadius:12, cursor:'pointer', border:'0.5px solid #e2e0e7', marginTop:12, display:'block' }}
                onMouseEnter={e=>e.target.style.opacity='0.88'} onMouseLeave={e=>e.target.style.opacity='1'} />
            </div>
          </div>

          <div style={{ ...card, marginBottom:0 }}>
            <div style={cardHeader}><CheckCircle2 size={14} color="#5b1f6a" /> Why this matters</div>
            <div style={{ padding:'14px 16px' }}>
              <p style={sectionText}>These facilities reflect the organization's strong commitment to Gender and Development (GAD) and a family-responsive workplace culture. They help remove barriers that may limit the participation of women and parents in the workforce.</p>
              <img src="/fsp/wtm.png" alt="Why This Matters"
                onClick={() => openLightbox('/fsp/wtm.png', "These facilities reflect the organization's commitment to Gender and Development and a family-responsive workplace culture.")}
                style={{ width:'100%', borderRadius:12, cursor:'pointer', border:'0.5px solid #e2e0e7', marginTop:12, display:'block' }}
                onMouseEnter={e=>e.target.style.opacity='0.88'} onMouseLeave={e=>e.target.style.opacity='1'} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div>
          <div style={card}>
            <div style={cardHeader}><Star size={14} color="#5b1f6a" /> Objectives</div>
            <div style={{ padding:'4px 16px 8px' }}>
              {[
                'Provide a safe, secure space for employees\' children.',
                'Support working parents in balancing duties and caregiving.',
                'Promote gender equality aligned with GAD principles.',
                'Strengthen commitment to child protection and maternal support.',
              ].map((t, i, arr) => (
                <div key={t} style={{ ...listItem, borderBottom: i===arr.length-1 ? 'none' : '0.5px solid #e2e0e7' }}>
                  <span style={{ color:'#5b1f6a', flexShrink:0, marginTop:1 }}>•</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}><ShieldCheck size={14} color="#5b1f6a" /> Children's rights</div>
            <div style={{ padding:'14px 16px' }}>
              <p style={sectionText}>Every child has the fundamental right to education, protection, healthcare, and a safe environment. Upholding these rights ensures children grow in a nurturing space where their physical, emotional, and intellectual development is fully supported.</p>
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}><CheckCircle2 size={14} color="#5b1f6a" /> Mental health awareness</div>
            <div style={{ padding:'4px 16px 8px' }}>
              {[
                'Mental health is an essential part of overall well-being.',
                'A healthy workplace recognizes both physical and mental wellness are necessary for individuals to thrive.',
              ].map((t, i, arr) => (
                <div key={t} style={{ ...listItem, borderBottom: i===arr.length-1 ? 'none' : '0.5px solid #e2e0e7' }}>
                  <span style={{ color:'#5b1f6a', flexShrink:0, marginTop:1 }}>•</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...card, marginBottom:0 }}>
            <div style={cardHeader}><Users size={14} color="#5b1f6a" /> Inclusive workplace</div>
            <div style={{ padding:'14px 16px' }}>
              <p style={sectionText}>Creating an inclusive workplace means recognizing the diverse needs of employees and ensuring everyone has equal opportunities to thrive. Facilities that support childcare, maternal health, and mental well-being foster a culture of empathy and respect.</p>
            </div>
          </div>
        </div>

      </div>

      {/* LIGHTBOX */}
      {lightbox && (
        <div onClick={closeLightbox} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.80)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div onClick={e=>e.stopPropagation()} style={{ maxWidth:860, width:'92%', position:'relative' }}>
            <button onClick={closeLightbox} style={{ position:'absolute', top:-36, right:0, background:'none', border:'none', cursor:'pointer' }}>
              <X size={28} color="#fff" />
            </button>
            <img src={lightbox.src} alt="" style={{ width:'100%', borderRadius:12, maxHeight:'78vh', objectFit:'contain', display:'block' }} />
            {lightbox.caption && (
              <div style={{ color:'rgba(255,255,255,0.78)', fontSize:13, marginTop:14, lineHeight:1.6 }}>{lightbox.caption}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}