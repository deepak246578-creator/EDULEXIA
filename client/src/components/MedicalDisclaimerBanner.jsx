import React from 'react';
import { Info, ShieldAlert } from 'lucide-react';

export default function MedicalDisclaimerBanner({ compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 font-jakarta font-medium shadow-xs">
        <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Educational screening & learning support tool. Not a medical or clinical diagnosis.</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-4 bg-[#0d1611] border border-emerald-800/60 shadow-lg glow-emerald flex items-start gap-3.5 font-jakarta">
      <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
        <ShieldAlert className="w-5 h-5" />
      </div>
      <div className="text-sm">
        <h4 className="font-bold text-emerald-200 mb-0.5 flex items-center gap-1.5">
          <span>Educational Screening & Support System Notice</span>
        </h4>
        <p className="text-emerald-300/80 leading-relaxed text-xs sm:text-sm">
          This platform is designed to identify reading support indicators and guide personalized learning activities. 
          It <strong>does not provide medical diagnoses</strong> of dyslexia or learning disabilities. 
          Results reflect specific skill areas that may benefit from practice and multi-sensory reading exercises.
        </p>
      </div>
    </div>
  );
}
