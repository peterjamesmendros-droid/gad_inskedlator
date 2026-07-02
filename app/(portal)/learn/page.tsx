import Lightbox from '@/components/Lightbox';

export const metadata = {
  title: 'Learn — GAD Inskedlator',
};

export default function LearnPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Learn</h1>
        <p className="text-sm text-slate-500 mt-1">Gender and Development — background, mission, and legal basis.</p>
      </div>

      {/* Grid Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: Core Content Cards */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4 bg-slate-50/50 flex items-center space-x-2 text-slate-800 font-semibold">
              <i className="ti ti-info-circle text-lg text-indigo-600" />
              <span>About the project</span>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-600 leading-relaxed text-justify">
                The GAD Inskedlator is a scheduling system developed to manage the use of the Child-Minding Centre and Lactation Room within DICT. It ensures fair, organized, and convenient booking for employees who require these facilities.
              </p>
              <Lightbox 
                src="/lp/gad.png" 
                alt="GAD Banner" 
                caption="The GAD Inskedlator is a scheduling system developed to manage the use of the Child-Minding Centre and Lactation Room within DICT."
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4 bg-slate-50/50 flex items-center space-x-2 text-slate-800 font-semibold">
              <i className="ti ti-target text-lg text-indigo-600" />
              <span>Our mission</span>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-600 leading-relaxed text-justify">
                Our mission is to promote gender equality and workplace inclusivity by providing accessible and efficient facilities that support working parents, especially mothers. This initiative aligns with national policies promoting women's rights and employee welfare.
              </p>
              <Lightbox 
                src="/lp/mission.png" 
                alt="Mission" 
                caption="Our mission is to promote gender equality and workplace inclusivity by providing accessible and efficient facilities that support working parents, especially mothers."
              />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sidebar Highlights */}
        <div className="space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4 bg-slate-50/50 flex items-center space-x-2 text-slate-800 font-semibold">
              <i className="ti ti-heart text-lg text-rose-500" />
              <span>Why this matters</span>
            </div>
            <div className="p-4 divide-y divide-slate-100">
              <div className="flex items-start space-x-3 py-2.5 text-xs text-slate-600 leading-relaxed">
                <i className="ti ti-point-filled text-indigo-600 mt-0.5" />
                <span><strong>Supports working parents</strong> — allows mothers to balance work and parenting.</span>
              </div>
              <div className="flex items-start space-x-3 py-2.5 text-xs text-slate-600 leading-relaxed">
                <i className="ti ti-point-filled text-indigo-600 mt-0.5" />
                <span><strong>Encourages gender equality</strong> — women return to work confidently after childbirth.</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4 bg-slate-50/50 flex items-center space-x-2 text-slate-800 font-semibold">
              <i className="ti ti-file-description text-lg text-indigo-600" />
              <span>Infographics</span>
            </div>
            <div className="p-4">
              <a href="/lp/infog.png" download="Infographics_RA10028" className="group block">
                <img src="/lp/infog.png" alt="RA 10028 Infographic" className="w-full rounded-lg border border-slate-200 transition group-hover:opacity-90 mb-2" />
              </a>
              <p className="text-[11px] text-slate-400">Click the infographic to download.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}