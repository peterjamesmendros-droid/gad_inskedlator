import Lightbox from '@/components/Lightbox';
import { Info, Target, Heart, FileText } from 'lucide-react';

export const metadata = {
  title: 'Learn — GAD Inskedlator',
};

export default function LearnPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
      
      {/* Page Header (Perfect match with Admin Layout) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Learn</h1>
          <p className="text-sm text-slate-500 mt-1">Gender and Development — background, mission, and legal basis.</p>
        </div>
      </div>

      {/* Grid Content Layout (Matches Admin split grids) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: Core Content Cards (Takes 2/3 of space) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-4 bg-slate-50/70 flex items-center space-x-2 text-slate-800 font-bold text-sm">
              <Info className="h-4 w-4 text-purple-950" />
              <span>About the project</span>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed text-justify font-medium">
                The GAD Inskedlator is a scheduling system developed to manage the use of the Child-Minding Centre and Lactation Room within DICT. It ensures fair, organized, and convenient booking for employees who require these facilities.
              </p>
              <div className="rounded-xl overflow-hidden border border-slate-100">
                <Lightbox 
                  src="/lp/gad.png" 
                  alt="GAD Banner" 
                  caption="The GAD Inskedlator is a scheduling system developed to manage the use of the Child-Minding Centre and Lactation Room within DICT."
                />
              </div>
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-4 bg-slate-50/70 flex items-center space-x-2 text-slate-800 font-bold text-sm">
              <Target className="h-4 w-4 text-purple-950" />
              <span>Our mission</span>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed text-justify font-medium">
                Our mission is to promote gender equality and workplace inclusivity by providing accessible and efficient facilities that support working parents, especially mothers. This initiative aligns with national policies promoting women's rights and employee welfare.
              </p>
              <div className="rounded-xl overflow-hidden border border-slate-100">
                <Lightbox 
                  src="/lp/mission.png" 
                  alt="Mission" 
                  caption="Our mission is to promote gender equality and workplace inclusivity by providing accessible and efficient facilities that support working parents, especially mothers."
                />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sidebar Highlights */}
        <div className="space-y-6">
          
          {/* Why This Matters Sidebar Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-4 bg-slate-50/70 flex items-center space-x-2 text-slate-800 font-bold text-sm">
              <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
              <span>Why this matters</span>
            </div>
            <div className="p-5 divide-y divide-slate-100">
              <div className="flex items-start space-x-3 pb-3.5 text-xs text-slate-600 leading-relaxed font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-900 mt-1.5 shrink-0" />
                <span><strong className="text-slate-900 font-bold">Supports working parents</strong> — allows mothers to balance work and parenting loops.</span>
              </div>
              <div className="flex items-start space-x-3 pt-3.5 text-xs text-slate-600 leading-relaxed font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-900 mt-1.5 shrink-0" />
                <span><strong className="text-slate-900 font-bold">Encourages gender equality</strong> — women return to work confidently after childbirth.</span>
              </div>
            </div>
          </div>

          {/* Infographics Sidebar Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-4 bg-slate-50/70 flex items-center space-x-2 text-slate-800 font-bold text-sm">
              <FileText className="h-4 w-4 text-purple-950" />
              <span>Infographics</span>
            </div>
            <div className="p-5 space-y-3">
              <a href="/lp/infog.png" download="Infographics_RA10028" className="group block rounded-xl overflow-hidden border border-slate-200 transition-all shadow-sm">
                <img 
                  src="/lp/infog.png" 
                  alt="RA 10028 Infographic" 
                  className="w-full h-auto transition group-hover:opacity-90 object-contain" 
                />
              </a>
              <p className="text-[11px] text-slate-400 font-medium text-center select-none">
                Click the infographic image container block to download.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}