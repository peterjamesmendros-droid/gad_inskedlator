'use client';

import { useState } from 'react';
import { Building2, X } from 'lucide-react';

const CHILD_MINDING_FEATURES = [
  'Safe and supervised play area with trained personnel',
  'Age-appropriate toys and learning materials',
  'Clean and sanitized environment maintained daily',
  'Comfortable rest and feeding area for children',
  'Dedicated space for infants and toddlers',
  'CCTV monitored for child safety',
];

const LACTATION_FEATURES = [
  'Private, lockable room for breastfeeding and pumping',
  'Comfortable seating and nursing stations',
  'Refrigeration facility for breast milk storage',
  'Clean sink and sanitation supplies',
  'Electrical outlets for breast pump use',
  'Compliant with RA 10028 (Expanded Breastfeeding Promotion Act)',
];

export default function FacilitiesPage() {
  const [lightbox, setLightbox] = useState(null); // { src, caption }

  const openLightbox = (src, caption) => setLightbox({ src, caption });
  const closeLightbox = () => setLightbox(null);

  const FeatureList = ({ items }) => (
    <ul className="space-y-0 divide-y divide-slate-50">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 py-2.5 text-sm text-slate-600 leading-relaxed">
          <span className="text-purple-500 mt-0.5 shrink-0">✓</span>
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Facilities</h1>
        <p className="text-sm text-slate-500 mt-1">Child-Minding Centre and Lactation Room information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">

          {/* Child-Minding */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2 font-semibold text-slate-800 text-sm">
              <Building2 className="h-4 w-4 text-purple-600" /> Child-Minding Centre
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed text-justify">
                The Child-Minding Centre provides a safe, supervised, and nurturing environment for children of DICT employees during working hours. It is staffed by trained personnel and equipped with age-appropriate materials to support children's development and well-being while parents fulfill their professional responsibilities.
              </p>
              <FeatureList items={CHILD_MINDING_FEATURES} />
              <img
                src="/background/cb.png"
                alt="Child-Minding Centre"
                onClick={() => openLightbox('/background/cb.png', 'Child-Minding Centre — DICT MISS-DWAD')}
                className="w-full rounded-xl border border-slate-100 cursor-pointer hover:opacity-90 transition-opacity mt-2 object-cover max-h-52"
              />
            </div>
          </div>

          {/* Lactation Room */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2 font-semibold text-slate-800 text-sm">
              <Building2 className="h-4 w-4 text-purple-600" /> Lactation Room
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed text-justify">
                The Lactation Room is a private, clean, and dedicated space for breastfeeding and breast-milk expression. Established in compliance with Republic Act 10028 and DICT's Gender and Development program, it ensures the health and dignity of lactating employees are fully supported within the workplace.
              </p>
              <FeatureList items={LACTATION_FEATURES} />
              <img
                src="/background/lroom.png"
                alt="Lactation Room"
                onClick={() => openLightbox('/background/lroom.png', 'Lactation Room — DICT MISS-DWAD')}
                className="w-full rounded-xl border border-slate-100 cursor-pointer hover:opacity-90 transition-opacity mt-2 object-cover max-h-52"
              />
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Location</div>
            <div className="space-y-2 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">DICT MISS-DWAD Division</p>
              <p>Department of Information and Communications Technology</p>
              <p className="text-slate-400">Floor / building details per site</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Operating Hours</div>
            <div className="space-y-1.5 text-sm text-slate-600">
              <div className="flex justify-between"><span>Monday – Friday</span><span className="font-semibold">8:00 AM – 5:00 PM</span></div>
              <div className="flex justify-between text-slate-400"><span>Saturday – Sunday</span><span>Closed</span></div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-500 mb-2">Booking Required</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              All slots must be reserved in advance via the Booking module and are subject to admin approval. Each slot is 40 minutes.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Legal Basis</div>
            <div className="space-y-2 text-xs text-slate-500 leading-relaxed">
              <p><span className="font-semibold text-slate-700">RA 9710</span> — Magna Carta of Women</p>
              <p><span className="font-semibold text-slate-700">RA 10028</span> — Expanded Breastfeeding Promotion Act</p>
              <p><span className="font-semibold text-slate-700">GAD Budget Policy</span> — PCW & DBM Joint Circular</p>
            </div>
          </div>
        </div>

      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={closeLightbox}
              className="absolute -top-10 right-0 text-white text-3xl leading-none hover:opacity-70">
              <X className="h-8 w-8" />
            </button>
            <img src={lightbox.src} alt={lightbox.caption}
              className="w-full rounded-xl max-h-[80vh] object-contain" />
            {lightbox.caption && (
              <p className="text-white/70 text-sm mt-3">{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
