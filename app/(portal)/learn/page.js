'use client';

import { useState } from 'react';
import { AlertCircle, Star, BookOpen, Heart, X } from 'lucide-react';

const card = { background:'#fff', border:'0.5px solid #e2e0e7', borderRadius:12, overflow:'hidden' };
const cardHeader = { padding:'12px 16px', borderBottom:'0.5px solid #e2e0e7', display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:600, color:'#1a1a2e' };
const cardBody = { padding:'14px 16px' };
const sectionText = { fontSize:13, color:'#4a4760', lineHeight:1.7, textAlign:'justify', margin:0 };
const sectionImg = { width:'100%', borderRadius:12, cursor:'pointer', display:'block', border:'0.5px solid #e2e0e7', marginTop:12 };
const listItem = (last) => ({ display:'flex', gap:10, padding:'9px 0', borderBottom: last ? 'none' : '0.5px solid #e2e0e7', fontSize:13, lineHeight:1.55, color:'#4a4760' });

export default function LearnPage() {
  const [lightbox, setLightbox] = useState(null);

  const openImg = (src, caption) => setLightbox({ src, caption });
  const closeImg = () => setLightbox(null);

  return (
    <div style={{ padding:'26px 26px 40px' }}>

      {/* PAGE HEADER */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:18, fontWeight:700, color:'#1a1a2e' }}>Learn</div>
        <div style={{ fontSize:12, color:'#8b8999', marginTop:3 }}>Gender and Development — background, mission, and legal basis.</div>
      </div>

      {/* TWO-COLUMN GRID: 1fr + 300px sidebar — matching PHP .content-grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:18, alignItems:'start' }}>

        {/* LEFT: 3 main content cards stacked */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* About the project */}
          <div style={card}>
            <div style={cardHeader}>
              <AlertCircle size={14} color="#5b1f6a" /> About the project
            </div>
            <div style={cardBody}>
              <p style={sectionText}>The GAD Inskedlator is a scheduling system developed to manage the use of the Child-Minding Centre and Lactation Room within DICT. It ensures fair, organized, and convenient booking for employees who require these facilities.</p>
              <img
                src="/lp/gad.png"
                alt="GAD Banner"
                style={sectionImg}
                onClick={() => openImg('/lp/gad.png', 'The GAD Inskedlator is a scheduling system developed to manage the use of the Child-Minding Centre and Lactation Room within DICT. It ensures fair, organized, and convenient booking for employees who require these facilities.')}
                onMouseEnter={e => e.target.style.opacity = '0.88'}
                onMouseLeave={e => e.target.style.opacity = '1'}
              />
            </div>
          </div>

          {/* Our mission */}
          <div style={card}>
            <div style={cardHeader}>
              <Star size={14} color="#5b1f6a" /> Our mission
            </div>
            <div style={cardBody}>
              <p style={sectionText}>Our mission is to promote gender equality and workplace inclusivity by providing accessible and efficient facilities that support working parents, especially mothers. This initiative aligns with national policies promoting women's rights and employee welfare.</p>
              <img
                src="/lp/mission.png"
                alt="Mission"
                style={sectionImg}
                onClick={() => openImg('/lp/mission.png', 'Our mission is to promote gender equality and workplace inclusivity by providing accessible and efficient facilities that support working parents, especially mothers.')}
                onMouseEnter={e => e.target.style.opacity = '0.88'}
                onMouseLeave={e => e.target.style.opacity = '1'}
              />
            </div>
          </div>

          {/* Legal basis */}
          <div style={card}>
            <div style={cardHeader}>
              <BookOpen size={14} color="#5b1f6a" /> Legal basis
            </div>
            <div style={cardBody}>
              <p style={sectionText}>This project supports the <strong>Magna Carta of Women (RA 9710)</strong> and the <strong>Expanded Breastfeeding Promotion Act (RA 10028)</strong>, which mandate the establishment of child-minding centers and lactation stations in workplaces.</p>
              <img
                src="/lp/legal.png"
                alt="Legal Basis"
                style={sectionImg}
                onClick={() => openImg('/lp/legal.png', 'This project supports RA 9710 and RA 10028, mandating child-minding centers and lactation stations in workplaces.')}
                onMouseEnter={e => e.target.style.opacity = '0.88'}
                onMouseLeave={e => e.target.style.opacity = '1'}
              />
            </div>
          </div>

        </div>

        {/* RIGHT: sidebar — 300px, 2 cards stacked */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Why this matters */}
          <div style={card}>
            <div style={cardHeader}>
              <Heart size={14} color="#5b1f6a" /> Why this matters
            </div>
            <div style={{ padding:'4px 16px 8px' }}>
              {[
                ['Supports working parents', 'allows mothers to balance work and parenting.'],
                ['Encourages gender equality', 'women return to work confidently after childbirth.'],
                ['Promotes mental health', 'reduces anxiety and fatigue for parents.'],
                ['Boosts productivity', 'less stressed employees are more focused at work.'],
                ['Enhances reputation', 'demonstrates the organization values employee welfare.'],
              ].map(([bold, rest], i, arr) => (
                <div key={bold} style={listItem(i === arr.length - 1)}>
                  <span style={{ color:'#5b1f6a', fontSize:16, flexShrink:0, marginTop:-1 }}>•</span>
                  <span><strong>{bold}</strong> — {rest}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Infographics */}
          <div style={card}>
            <div style={cardHeader}>
              <BookOpen size={14} color="#5b1f6a" /> Infographics
            </div>
            <div style={cardBody}>
              <a href="/lp/infog.png" download="Infographics_RA10028">
                <img
                  src="/lp/infog.png"
                  alt="RA 10028 Infographic"
                  style={{ ...sectionImg, marginTop:0, marginBottom:8 }}
                  onMouseEnter={e => e.target.style.opacity = '0.88'}
                  onMouseLeave={e => e.target.style.opacity = '1'}
                />
              </a>
              <p style={{ fontSize:11.5, color:'#8b8999', margin:0 }}>Click the infographic to download.</p>
            </div>
          </div>

        </div>
      </div>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          onClick={closeImg}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.80)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center' }}
        >
          <div onClick={e => e.stopPropagation()} style={{ maxWidth:860, width:'92%', textAlign:'center', position:'relative' }}>
            <button onClick={closeImg} style={{ position:'absolute', top:-36, right:0, background:'none', border:'none', cursor:'pointer' }}>
              <X size={28} color="#fff" />
            </button>
            <img src={lightbox.src} alt="" style={{ width:'100%', borderRadius:12, maxHeight:'78vh', objectFit:'contain', display:'block' }} />
            {lightbox.caption && (
              <div style={{ color:'rgba(255,255,255,0.78)', fontSize:13, marginTop:14, lineHeight:1.6, textAlign:'left' }}>
                {lightbox.caption}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}