'use client';

import { useState, useEffect, useRef } from 'react';
import { BarChart3, Users, MessageSquare } from 'lucide-react';

const ROLE_LABELS = { parent:'Parent', lactating_mother:'Lactating Mother', guardian:'Guardian', employee:'Employee', visitor:'Visitor' };
const card = { background:'#fff', border:'0.5px solid #e2e0e7', borderRadius:12, overflow:'hidden', marginBottom:16 };
const cardHeader = { padding:'12px 16px', borderBottom:'0.5px solid #e2e0e7', display:'flex', alignItems:'center', justifyContent:'space-between' };
const cardTitle = { fontSize:13, fontWeight:600, color:'#1a1a2e', display:'flex', alignItems:'center', gap:8 };

export default function AdminEvaluationsPage() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const chartRef              = useRef(null);
  const chartInst             = useRef(null);

  useEffect(() => {
    fetch('/api/evaluations')
      .then(r => r.json())
      .then(json => { if (json.success) setData(json); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!data || !chartRef.current) return;
    const avg = data.averages;
    if (!avg || parseInt(avg.total_responses) === 0) return;

    import('chart.js/auto').then(({ default: Chart }) => {
      if (chartInst.current) chartInst.current.destroy();
      chartInst.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: ['Child Cleanliness','Child Safety','Child Toys','Child Comfort','Child Supervision','Lactating Privacy','Lactating Cleanliness','Lactating Comfort','Lactating Access','Lactating Equipment','Gender Respect','Gender Equality','Gender Work-Life','No Discrimination','Reduced Stress','Met Needs'],
          datasets: [{
            label: 'Average Rating',
            data: [avg.child_cleanliness, avg.child_safety, avg.child_toys, avg.child_comfort, avg.child_supervision, avg.lact_privacy, avg.lact_clean, avg.lact_comfort, avg.lact_access, avg.lact_equipment, avg.gender_respect, avg.gender_equality, avg.gender_worklife, avg.gender_discrimination, avg.impact_stress, avg.impact_needs],
            backgroundColor: 'rgba(91,31,106,0.75)',
            borderColor: 'rgba(91,31,106,1)',
            borderWidth: 1, borderRadius: 4,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          scales: { y: { beginAtZero:true, max:5, title:{ display:true, text:'Rating (1–5)' } } },
          plugins: { legend:{ display:false }, title:{ display:true, text:'Evaluation Results by Category', font:{ size:14 } } }
        }
      });
    });

    return () => { if (chartInst.current) chartInst.current.destroy(); };
  }, [data]);

  if (loading) return <div style={{ padding:26, fontSize:13, color:'#8b8999' }}>Loading...</div>;

  const avg  = data?.averages;
  const total = avg ? parseInt(avg.total_responses) : 0;

  const categoryAvgs = avg ? {
    'Child-Minding Area': (((+avg.child_cleanliness)+(+avg.child_safety)+(+avg.child_toys)+(+avg.child_comfort)+(+avg.child_supervision))/5).toFixed(1),
    'Lactation Room':     (((+avg.lact_privacy)+(+avg.lact_clean)+(+avg.lact_comfort)+(+avg.lact_access)+(+avg.lact_equipment))/5).toFixed(1),
    'Gender Sensitivity': (((+avg.gender_respect)+(+avg.gender_equality)+(+avg.gender_worklife)+(+avg.gender_discrimination))/4).toFixed(1),
    'Overall Experience': (((+avg.impact_stress)+(+avg.impact_needs))/2).toFixed(1),
  } : {};

  const overallAvg = Object.values(categoryAvgs).length
    ? (Object.values(categoryAvgs).reduce((a,b) => a + +b, 0) / 4).toFixed(1)
    : 0;

  const badgeStyle = (color) => ({ display:'inline-block', fontSize:10.5, fontWeight:600, padding:'2px 9px', borderRadius:20, background:'#f0e6f5', color:'#5b1f6a' });

  return (
    <div style={{ padding:'26px 26px 40px' }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:18, fontWeight:700, color:'#1a1a2e' }}>Evaluation summary</div>
        <div style={{ fontSize:12, color:'#8b8999', marginTop:3 }}>Analysis of all submitted feedback responses.</div>
      </div>

      {total === 0 ? (
        <div style={{ ...card, padding:48, textAlign:'center' }}>
          <BarChart3 size={40} color="#e2e0e7" style={{ margin:'0 auto 12px', display:'block' }} />
          <div style={{ fontSize:15, fontWeight:600, color:'#1a1a2e', marginBottom:6 }}>No evaluation data yet</div>
          <div style={{ fontSize:13, color:'#8b8999' }}>Submitted evaluations from employees will appear here once received.</div>
        </div>
      ) : (
        <>
          {/* STAT CARDS */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }}>
            {[
              { label:'Total responses',       value: total,                 color:'#5b1f6a' },
              { label:'Average overall rating', value: `${overallAvg} / 5`, color:'#2e7d5a' },
              { label:'Highest category',       value: Object.keys(categoryAvgs).reduce((a,b) => +categoryAvgs[a] >= +categoryAvgs[b] ? a : b, Object.keys(categoryAvgs)[0]), color:'#b7791f' },
              { label:'Lowest category',        value: Object.keys(categoryAvgs).reduce((a,b) => +categoryAvgs[a] <= +categoryAvgs[b] ? a : b, Object.keys(categoryAvgs)[0]), color:'#c0392b' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background:'#fff', border:'0.5px solid #e2e0e7', borderRadius:12, padding:'14px 16px', borderLeft:`3px solid ${color}`, transition:'transform 0.18s,box-shadow 0.18s' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 20px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}>
                <div style={{ fontSize:11, color:'#8b8999', marginBottom:4 }}>{label}</div>
                <div style={{ fontSize:16, fontWeight:700, color:'#1a1a2e', lineHeight:1.2 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* CHART + CATEGORY AVERAGES */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:18, marginBottom:16 }}>
            <div style={{ ...card, padding:20, marginBottom:0 }}>
              <div style={{ height:420 }}>
                <canvas ref={chartRef} />
              </div>
            </div>
            <div style={{ ...card, marginBottom:0 }}>
              <div style={cardHeader}>
                <div style={cardTitle}><BarChart3 size={14} color="#5b1f6a" /> Category averages</div>
              </div>
              {Object.entries(categoryAvgs).map(([name, score]) => (
                <div key={name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 16px', borderBottom:'0.5px solid #e2e0e7' }}>
                  <span style={{ fontSize:13, fontWeight:500, color:'#1a1a2e' }}>{name}</span>
                  <span style={{ fontSize:14, fontWeight:700, color:'#5b1f6a' }}>{score} / 5</span>
                </div>
              ))}
            </div>
          </div>

          {/* ROLE DISTRIBUTION */}
          <div style={{ ...card }}>
            <div style={cardHeader}>
              <div style={cardTitle}><Users size={14} color="#5b1f6a" /> Respondents by role</div>
            </div>
            {data?.roleCounts?.map(r => (
              <div key={r.role} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', borderBottom:'0.5px solid #e2e0e7' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:'#5b1f6a', display:'inline-block', flexShrink:0 }} />
                  <span style={{ fontSize:13, color:'#4a4760' }}>{ROLE_LABELS[r.role] ?? r.role}</span>
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:'#1a1a2e' }}>{r.c}</span>
              </div>
            ))}
          </div>

          {/* INDIVIDUAL RESPONSES */}
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}><MessageSquare size={14} color="#5b1f6a" /> Individual responses</div>
              <span style={{ fontSize:12, color:'#8b8999', cursor:'default' }}>{data?.responses?.length} total</span>
            </div>
            {data?.responses?.map(r => (
              <div key={r.evaluation_id} style={{ padding:'16px 18px', borderBottom:'0.5px solid #e2e0e7' }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:8, flexWrap:'wrap' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:'50%', background:'#f0e6f5', color:'#5b1f6a', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      {r.name ? r.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <div style={{ fontSize:13.5, fontWeight:600, color:'#1a1a2e' }}>{r.name || 'Anonymous'}</div>
                      <div style={{ fontSize:11.5, color:'#8b8999', marginTop:2, display:'flex', alignItems:'center', gap:6 }}>
                        <span style={badgeStyle()}>{ROLE_LABELS[r.role] ?? r.role}</span>
                        <span>· {r.date_fmt}</span>
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize:13, fontWeight:700, color:'#5b1f6a', background:'#f0e6f5', padding:'4px 12px', borderRadius:20, flexShrink:0 }}>{r.overall_score} / 5</span>
                </div>
                {r.suggestions && (
                  <div style={{ background:'#f8f7fa', borderRadius:8, padding:'10px 14px', marginTop:6 }}>
                    <div style={{ fontSize:10.5, fontWeight:700, color:'#8b8999', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Suggestions & feedback</div>
                    <div style={{ fontSize:13, color:'#4a4760', lineHeight:1.6 }}>{r.suggestions}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}