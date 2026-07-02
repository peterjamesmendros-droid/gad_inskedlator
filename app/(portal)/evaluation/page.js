'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle, Bell, Lock, Send, ClipboardCheck, Building2, Star, Users } from 'lucide-react';

const SECTIONS = [
  { icon: Building2, title:'Child-Minding Area', fields:[
    { key:'child_cleanliness', label:'The child minding area is clean and well-maintained.' },
    { key:'child_safety',      label:'The child minding area feels safe and secure.' },
    { key:'child_toys',        label:'Toys and learning materials are sufficient and appropriate.' },
    { key:'child_comfort',     label:'The area is comfortable for children and guardians.' },
    { key:'child_supervision', label:'Staff or personnel provide proper supervision when needed.' },
  ]},
  { icon: Star, title:'Lactation Room', fields:[
    { key:'lact_privacy',   label:'The lactating room provides enough privacy.' },
    { key:'lact_clean',     label:'The lactating room is clean and hygienic.' },
    { key:'lact_comfort',   label:'The room is comfortable and relaxing to use.' },
    { key:'lact_access',    label:'The lactating room is accessible and easy to locate.' },
    { key:'lact_equipment', label:'The room has adequate facilities and equipment.' },
  ]},
  { icon: Users, title:'Gender Sensitivity & Inclusivity', fields:[
    { key:'gender_respect',        label:'Staff treat all individuals with respect and fairness.' },
    { key:'gender_equality',       label:'The environment promotes gender equality and inclusivity.' },
    { key:'gender_worklife',       label:'The programs and services support work-life balance.' },
    { key:'gender_discrimination', label:'I did not experience discrimination during my visit.' },
  ]},
  { icon: Star, title:'Overall Experience', fields:[
    { key:'impact_stress', label:'The facilities and services helped reduce stress and improve comfort.' },
    { key:'impact_needs',  label:'The services provided met my needs and expectations.' },
  ]},
];

const INIT = { name:'', role:'', child_cleanliness:0, child_safety:0, child_toys:0, child_comfort:0, child_supervision:0, lact_privacy:0, lact_clean:0, lact_comfort:0, lact_access:0, lact_equipment:0, gender_respect:0, gender_equality:0, gender_worklife:0, gender_discrimination:0, impact_stress:0, impact_needs:0, suggestions:'' };

const inputStyle = { width:'100%', border:'1.5px solid #e2e0e7', borderRadius:8, padding:'9px 12px', fontSize:13.5, fontFamily:'inherit', color:'#1a1a2e', background:'#f6f5f8', outline:'none', boxSizing:'border-box' };
const labelStyle = { display:'block', fontSize:10.5, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'#4a4760', marginBottom:6 };

export default function EvaluationPage() {
  const [form, setForm]       = useState(INIT);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    const allKeys = SECTIONS.flatMap(s => s.fields.map(f => f.key));
    if (allKeys.some(k => !form[k])) { setError('Please rate all questions before submitting.'); return; }
    setLoading(true);
    try {
      const res  = await fetch('/api/evaluations', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
      const json = await res.json();
      if (json.success) setSuccess(json.message);
      else setError(json.message);
    } catch { setError('Submission failed. Please try again.'); }
    finally { setLoading(false); }
  }

  if (success) return (
    <div style={{ padding:26 }}>
      <div style={{ background:'#fff', border:'0.5px solid #e2e0e7', borderRadius:12, padding:48, textAlign:'center' }}>
        <CheckCircle2 size={48} color="#2e7d5a" style={{ margin:'0 auto 12px', display:'block' }} />
        <div style={{ fontSize:16, fontWeight:700, color:'#1a1a2e', marginBottom:6 }}>Thank you!</div>
        <div style={{ fontSize:13, color:'#8b8999' }}>{success}</div>
      </div>
    </div>
  );

  return (
    <div style={{ padding:'26px 26px 40px' }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:18, fontWeight:700, color:'#1a1a2e' }}>Evaluation form</div>
        <div style={{ fontSize:12, color:'#8b8999', marginTop:3 }}>Feedback on facilities, services, and overall experience.</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:20, alignItems:'start' }}>

        {/* FORM */}
        <div style={{ background:'#fff', border:'0.5px solid #e2e0e7', borderRadius:12, overflow:'hidden' }}>
          <div style={{ padding:'14px 18px', borderBottom:'0.5px solid #e2e0e7', display:'flex', alignItems:'center', gap:8 }}>
            <ClipboardCheck size={15} color="#5b1f6a" />
            <span style={{ fontSize:14, fontWeight:700, color:'#1a1a2e' }}>Evaluation form</span>
          </div>
          <div style={{ padding:'18px 18px 22px' }}>
            <form onSubmit={submit}>

              {/* Name + Role */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:20, paddingBottom:20, borderBottom:'0.5px solid #e2e0e7' }}>
                <div>
                  <label style={labelStyle}>Name <span style={{ fontWeight:400, textTransform:'none', color:'#8b8999' }}>(optional)</span></label>
                  <input style={inputStyle} value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Leave blank to remain anonymous" />
                </div>
                <div>
                  <label style={labelStyle}>Role <span style={{ color:'#c0392b' }}>*</span></label>
                  <select style={inputStyle} value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} required>
                    <option value="">— Select your role —</option>
                    <option value="parent">Parent</option>
                    <option value="lactating_mother">Lactating Mother</option>
                    <option value="guardian">Guardian</option>
                    <option value="employee">Employee</option>
                    <option value="visitor">Visitor</option>
                  </select>
                </div>
              </div>

              {/* Rating scale legend */}
              <div style={{ display:'flex', alignItems:'center', gap:10, background:'#f0e6f5', border:'0.5px solid #d9c6e8', borderRadius:8, padding:'10px 16px', marginBottom:22, flexWrap:'wrap' }}>
                <AlertCircle size={15} color="#5b1f6a" style={{ flexShrink:0 }} />
                <span style={{ fontSize:12, fontWeight:600, color:'#5b1f6a', marginRight:4 }}>Rating scale:</span>
                {[['1','Strongly Disagree'],['2','Disagree'],['3','Neutral'],['4','Agree'],['5','Strongly Agree']].map(([n,l]) => (
                  <span key={n} style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, color:'#4a4760', padding:'3px 10px', background:'#fff', border:'0.5px solid #e2e0e7', borderRadius:20 }}>
                    <span style={{ width:20, height:20, borderRadius:'50%', background:'#5b1f6a', color:'#fff', fontSize:11, fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>{n}</span>
                    {l}
                  </span>
                ))}
              </div>

              {error && <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fdecea', border:'0.5px solid #f5b7b1', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#c0392b', marginBottom:16 }}><AlertCircle size={15}/>{error}</div>}

              {/* Sections */}
              {SECTIONS.map(section => {
                const Icon = section.icon;
                return (
                  <div key={section.title} style={{ marginBottom:24 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'#f0e6f5', borderRadius:8, marginBottom:4 }}>
                      <Icon size={16} color="#5b1f6a" />
                      <span style={{ fontSize:13, fontWeight:700, color:'#5b1f6a' }}>{section.title}</span>
                    </div>
                    <div style={{ background:'#fff', border:'0.5px solid #e2e0e7', borderRadius:'0 0 8px 8px', overflow:'hidden' }}>
                      {section.fields.map((f, i, arr) => (
                        <div key={f.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, padding:'11px 14px', borderBottom: i<arr.length-1 ? '0.5px solid #e2e0e7' : 'none' }}>
                          <div style={{ fontSize:13, color:'#4a4760', flex:1, lineHeight:1.5 }}>{f.label}</div>
                          <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                            {[1,2,3,4,5].map(n => (
                              <button key={n} type="button" onClick={() => setForm(p=>({...p,[f.key]:n}))} style={{
                                width:32, height:32, borderRadius:'50%',
                                border:`1.5px solid ${form[f.key]===n ? '#5b1f6a' : '#e2e0e7'}`,
                                background: form[f.key]===n ? '#5b1f6a' : '#fff',
                                color: form[f.key]===n ? '#fff' : '#8b8999',
                                fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s',
                              }}>{n}</button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Suggestions */}
              <div style={{ marginTop:20, paddingTop:20, borderTop:'0.5px solid #e2e0e7' }}>
                <label style={labelStyle}>Suggestions and feedback <span style={{ fontWeight:400, textTransform:'none', color:'#8b8999' }}>(optional)</span></label>
                <textarea style={{ ...inputStyle, resize:'vertical', minHeight:90, padding:12 }} value={form.suggestions} onChange={e=>setForm(p=>({...p,suggestions:e.target.value}))} rows={4} placeholder="Please share your suggestions, comments, or recommendations for improvement..." />
              </div>

              <button type="submit" disabled={loading} style={{ width:'100%', height:46, background:'#5b1f6a', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:'inherit', marginTop:18 }}>
                <Send size={16} /> {loading ? 'Submitting...' : 'Submit evaluation'}
              </button>
            </form>
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{ position:'sticky', top:72 }}>
          <div style={{ background:'#fff', border:'0.5px solid #e2e0e7', borderRadius:12, overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:'0.5px solid #e2e0e7', display:'flex', alignItems:'center', gap:7, fontSize:13, fontWeight:600, color:'#1a1a2e' }}>
              <Bell size={14} color="#5b1f6a" /> Reminders
            </div>
            <div>
              {[
                { Icon: Lock,          text:'All responses are treated with utmost confidentiality.' },
                { Icon: ClipboardCheck,text:'Please provide candid and thoughtful answers.' },
                { Icon: CheckCircle2,  text:'Completion of this evaluation is entirely voluntary.' },
                { Icon: Star,          text:'Information collected will be used exclusively for program improvement.' },
              ].map((item, i, arr) => (
                <div key={i} style={{ display:'flex', gap:10, padding:'9px 16px', borderBottom: i<arr.length-1 ? '0.5px solid #e2e0e7' : 'none', fontSize:13, color:'#4a4760', lineHeight:1.5 }}>
                  <item.Icon size={14} color="#5b1f6a" style={{ flexShrink:0, marginTop:2 }} />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}