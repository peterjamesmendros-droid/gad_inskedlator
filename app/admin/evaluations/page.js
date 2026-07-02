'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Users, MessageSquare } from 'lucide-react';

const ROLE_LABELS = {
  parent:'Parent', lactating_mother:'Lactating Mother', guardian:'Guardian', employee:'Employee', visitor:'Visitor'
};

export default function AdminEvaluationsPage() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/evaluations')
      .then(r => r.json())
      .then(json => { if (json.success) setData(json); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-sm text-slate-400">Loading...</div>;

  const avg = data?.averages;
  const totalResponses = avg ? parseInt(avg.total_responses) : 0;

  const categoryAvgs = avg ? {
    'Child-Minding Area': ((+avg.child_cleanliness + +avg.child_safety + +avg.child_toys + +avg.child_comfort + +avg.child_supervision) / 5).toFixed(1),
    'Lactation Room':     ((+avg.lact_privacy + +avg.lact_clean + +avg.lact_comfort + +avg.lact_access + +avg.lact_equipment) / 5).toFixed(1),
    'Gender Sensitivity': ((+avg.gender_respect + +avg.gender_equality + +avg.gender_worklife + +avg.gender_discrimination) / 4).toFixed(1),
    'Overall Experience': ((+avg.impact_stress + +avg.impact_needs) / 2).toFixed(1),
  } : {};

  const overallAvg = avg ? (Object.values(categoryAvgs).reduce((a,b) => a + +b, 0) / 4).toFixed(1) : 0;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Evaluation summary</h1>
        <p className="text-sm text-slate-500 mt-1">Analysis of all submitted feedback responses.</p>
      </div>

      {totalResponses === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <BarChart3 className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <h3 className="text-slate-700 font-semibold mb-1">No evaluation data yet</h3>
          <p className="text-sm text-slate-400">Submitted evaluations from employees will appear here once received.</p>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label:'Total responses',       value: totalResponses, color:'border-l-purple-500' },
              { label:'Average overall rating', value: overallAvg + ' / 5', color:'border-l-emerald-500' },
              { label:'Highest category', value: Object.keys(categoryAvgs).reduce((a,b) => +categoryAvgs[a] > +categoryAvgs[b] ? a : b), color:'border-l-amber-400' },
              { label:'Lowest category',  value: Object.keys(categoryAvgs).reduce((a,b) => +categoryAvgs[a] < +categoryAvgs[b] ? a : b), color:'border-l-red-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className={`bg-white rounded-xl border border-slate-200 border-l-4 ${color} p-4 shadow-sm`}>
                <div className="text-xs text-slate-400 mb-1">{label}</div>
                <div className="text-xl font-black text-slate-800">{value}</div>
              </div>
            ))}
          </div>

          {/* Category averages */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2 font-semibold text-slate-800 text-sm">
              <BarChart3 className="h-4 w-4 text-purple-600" /> Category averages
            </div>
            {Object.entries(categoryAvgs).map(([name, score]) => (
              <div key={name} className="px-5 py-3 flex items-center justify-between border-b border-slate-50 last:border-0">
                <span className="text-sm text-slate-700">{name}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-2 bg-purple-600 rounded-full" style={{ width: `${(+score/5)*100}%` }} />
                  </div>
                  <span className="text-sm font-bold text-purple-700 w-10 text-right">{score} / 5</span>
                </div>
              </div>
            ))}
          </div>

          {/* Role distribution */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2 font-semibold text-slate-800 text-sm">
              <Users className="h-4 w-4 text-purple-600" /> Respondents by role
            </div>
            {data?.roleCounts?.map(r => (
              <div key={r.role} className="px-5 py-3 flex items-center justify-between border-b border-slate-50 last:border-0 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                  <span className="text-slate-700">{ROLE_LABELS[r.role] ?? r.role}</span>
                </div>
                <span className="font-bold text-slate-800">{r.c}</span>
              </div>
            ))}
          </div>

          {/* Individual responses */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
                <MessageSquare className="h-4 w-4 text-purple-600" /> Individual responses
              </div>
              <span className="text-xs text-slate-400">{data?.responses?.length} total</span>
            </div>
            {data?.responses?.map(r => (
              <div key={r.evaluation_id} className="px-5 py-4 border-b border-slate-50 last:border-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 text-sm font-bold flex items-center justify-center shrink-0">
                      {r.name ? r.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{r.name || 'Anonymous'}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                          {ROLE_LABELS[r.role] ?? r.role}
                        </span>
                        <span className="text-xs text-slate-400">{r.date_fmt}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full shrink-0">
                    {r.overall_score} / 5
                  </span>
                </div>
                {r.suggestions && (
                  <div className="mt-2 bg-slate-50 rounded-lg px-3 py-2.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Suggestions & feedback</div>
                    <p className="text-sm text-slate-600 leading-relaxed">{r.suggestions}</p>
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
