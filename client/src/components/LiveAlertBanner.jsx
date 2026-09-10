import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function LiveAlertBanner() {
  const { liveBanner, setLiveBanner } = useApp();

  if (!liveBanner) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-md w-[calc(100%-2rem)] animate-bounce-in">
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/40 flex items-start gap-3 backdrop-blur-md">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
          <Bell className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Live Mandi Update
            </span>
          </div>
          <h4 className="font-bold text-sm text-white mt-0.5">
            {liveBanner.title}
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {liveBanner.message}
          </p>
        </div>
        <button
          onClick={() => setLiveBanner(null)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
