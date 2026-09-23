'use client';

import React from 'react';
import { Lock } from 'lucide-react';

export function WoxxPayTab() {
  return (
    <div className="max-w-2xl mx-auto pt-8">
      <div className="bg-white border-2 border-slate-900 rounded-3xl p-8 shadow-brutal text-center space-y-4">
        <div className="w-12 h-12 bg-slate-100 border-2 border-slate-900 rounded-2xl flex items-center justify-center mx-auto shadow-brutal-xs">
          <Lock className="w-6 h-6 text-slate-900" />
        </div>
        <h2 className="text-base font-black text-slate-900 tracking-tight">
          Configuration verrouillée
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Ce module est verrouillé.
        </p>
      </div>
    </div>
  );
}
