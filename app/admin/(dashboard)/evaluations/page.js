'use client';

import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { BarChart3, ListTodo, Users, MessageSquare } from 'lucide-react';

export default function EvaluationsSummaryPage() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [data, setData] = useState({
    totalResponses: 3,
    overallRating: 4.2,
    highestCategory: 'Child-Minding Area',
    lowestCategory: 'Overall Experience',
    categoryAverages: [
      { name: 'Child-Minding Area', score: 4.3 },
      { name: 'Lactation Room', score: 4.3 },
      { name: 'Gender Sensitivity', score: 4.2 },
      { name: 'Overall Experience', score: 3.8 }
    ],
    roleDistribution: [
      { role: 'Parent', count: 1 },
      { role: 'Lactating Mother', count: 1 },
      { role: 'Visitor', count: 1 }
    ],
    individualResponses: [
      {
        id: 1,
        name: 'test',
        role: 'Parent',
        date: 'Jun 30, 2026 5:15 PM',
        score: 5,
        suggestions: 'test'
      },
      {
        id: 2,
        name: 'Anonymous',
        role: 'Lactating Mother',
        date: 'Jun 24, 2026 1:52 PM',
        score: 2.6,
        suggestions: 'TEST'
      },
      {
        id: 3,
        name: 'ASDASD',
        role: 'Visitor',
        date: 'Jun 24, 2026 1:51 PM',
        score: 5,
        suggestions: 'TESTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS'
      }
    ],
    rawMetrics: [4.3, 4.1, 4.5, 4.2, 4.4, 4.5, 4.2, 4.1, 4.3, 4.6, 4.2, 4.1, 4.3, 4.2, 3.9, 3.7]
  });

  useEffect(() => {
    if (!isMounted || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Child Cleanliness', 'Child Safety', 'Child Toys', 'Child Comfort', 'Child Supervision',
          'Lactating Privacy', 'Lactating Cleanliness', 'Lactating Comfort', 'Lactating Access', 'Lactating Equipment',
          'Gender Respect', 'Gender Equality', 'Gender Work-Life', 'No Discrimination',
          'Reduced Stress', 'Met Needs'
        ],
        datasets: [{
          label: 'Average Rating',
          data: data.rawMetrics,
          backgroundColor: 'rgba(118, 75, 122, 0.8)',
          borderColor: 'rgba(82, 25, 86, 1)',
          borderWidth: 1,
          borderRadius: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
            grid: { color: '#f1f5f9' },
            ticks: { font: { size: 10 }, color: '#64748b' }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 9 }, color: '#64748b', maxRotation: 15, minRotation: 15 }
          }
        },
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Evaluation Results by Category',
            font: { size: 12, weight: '600' },
            color: '#475569',
            padding: { bottom: 10 }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [isMounted, data]);

  if (!isMounted) return null;

  return (
    /* MATCHING WRAPPER ALIGNMENT:
       Using the exact layout configuration 'p-6 space-y-6 max-w-7xl w-full mx-auto' 
       from your AdminBookingsPage to guarantee aligned bounds.
    */
    <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
      
      {/* Page Header Layout Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4">
        <div className="border-b border-slate-100 pb-5">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Evaluation summary</h1>
          <p className="text-sm text-slate-500 mt-1">Analysis of all submitted feedback responses.</p>
        </div>
      </div>

      {/* Analytics Info Cards Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total responses", value: data.totalResponses, color: "border-l-[#521956]" },
          { label: "Average overall rating", value: <>{data.overallRating} <span className="text-xs text-slate-400 font-normal">/ 5</span></>, color: "border-l-emerald-600" },
          { label: "Highest category", value: data.highestCategory, color: "border-l-amber-500" },
          { label: "Lowest category", value: data.lowestCategory, color: "border-l-rose-500" }
        ].map((card, idx) => (
          <div key={idx} className={`bg-white p-5 rounded-2xl border border-slate-200 border-l-4 ${card.color} flex flex-col justify-center h-20 shadow-sm`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
            <span className="font-extrabold text-slate-800 text-lg mt-0.5 tracking-tight">{card.value}</span>
          </div>
        ))}
      </section>

      {/* Primary Graphic Splits: Chart Panel + Categories */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Interactive Evaluation Analytics Chart */}
        <div className="xl:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-[340px] relative w-full">
          <canvas ref={chartRef} id="evaluationChart" />
        </div>

        {/* Dynamic Category Summary Metric Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-[340px] flex flex-col">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category averages</h3>
          </div>
          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {data.categoryAverages.map((cat, idx) => (
              <div key={idx} className="flex justify-between items-center px-4 py-3.5 hover:bg-slate-50/50 transition-colors">
                <span className="text-xs text-slate-700 font-semibold">{cat.name}</span>
                <span className="text-xs font-bold text-slate-800 shrink-0">{cat.score} <span className="text-slate-400 font-normal">/ 5</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role Distribution Panel Block */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4 w-full">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
          <Users className="h-3.5 w-3.5" />
          <span>Respondents by role</span>
        </h3>
        <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
          {data.roleDistribution.map((role, idx) => (
            <div key={idx} className="flex justify-between items-center px-4 py-3 hover:bg-slate-50/50 transition-colors bg-white">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#521956]" />
                <span className="text-xs text-slate-700 font-semibold">{role.role}</span>
              </div>
              <span className="text-xs font-bold text-slate-800">{role.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Master Feedback Logs Block Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Individual responses</h3>
          </div>
          <span className="text-[10px] text-purple-900 font-bold bg-purple-100 px-2 py-0.5 rounded-full">{data.individualResponses.length} total</span>
        </div>
        
        <div className="divide-y divide-slate-100">
          {data.individualResponses.map((item) => (
            <div key={item.id} className="p-5 space-y-3 hover:bg-slate-50/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 text-xs font-bold text-[#521956] flex items-center justify-center shrink-0">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-full">
                        {item.role}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">· {item.date}</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {item.score} <span className="text-slate-400 font-normal">/ 5</span>
                </span>
              </div>

              {item.suggestions && (
                <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Suggestions & Feedback</span>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed break-words whitespace-pre-wrap">
                    {item.suggestions}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}