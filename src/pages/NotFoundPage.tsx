import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-2">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-white">404 — Stumps Called</h1>
      <p className="text-xs text-slate-400 leading-relaxed">
        The ball seems to have gone over the ropes into the grandstand. The page or match you requested cannot be located.
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B8FF4D] text-[#080D1B] font-bold text-xs hover:bg-[#a6ec3c] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Pitch (Home)</span>
        </Link>
      </div>
    </div>
  );
};
