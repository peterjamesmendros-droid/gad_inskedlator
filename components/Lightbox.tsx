'use client'; 

import { useState } from 'react';

interface LightboxProps {
  src: string;
  alt: string;
  caption: string;
}

export default function Lightbox({ src, alt, caption }: LightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img 
        src={src} 
        alt={alt} 
        onClick={() => setIsOpen(true)}
        className="w-full border border-slate-200 rounded-xl cursor-pointer transition hover:opacity-85 mt-3 block object-cover"
      />

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <div className="max-w-4xl w-full relative" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute -top-10 right-0 text-white text-3xl hover:text-slate-300 cursor-pointer bg-transparent border-none"
            >
              &times;
            </button>
            <img src={src} alt={alt} className="w-full rounded-xl max-h-[75vh] object-contain mx-auto" />
            <p className="text-white/80 text-sm mt-4 text-left leading-relaxed">{caption}</p>
          </div>
        </div>
      )}
    </>
  );
}