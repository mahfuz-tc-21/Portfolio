import React from 'react';
import { useStore } from '../../store/useStore';
import { currentStatus } from '../../data/portfolioData';
import { Coffee, ArrowLeft, Play, Pause, X } from 'lucide-react';

export const CafeKiosk: React.FC = () => {
  const { 
    activeLocationId, 
    setActiveLocationId, 
    soundOn, 
    toggleSound 
  } = useStore();

  if (activeLocationId !== 'cafe') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm pointer-events-auto select-none">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-premium w-full max-w-md max-h-[80vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-soft">
              <Coffee size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">Developer Café</h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Coffee &amp; Code Atmosphere</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveLocationId(null)}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          {/* Ambient player banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-soft">
            <div className="space-y-0.5">
              <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Atmosphere Radio</span>
              <h4 className="text-[10px] font-bold text-emerald-400 tracking-wide">Developer Space Ambient Loop</h4>
              <p className="text-[8px] text-slate-400 font-medium">Programmatic Web Audio synth waves</p>
            </div>
            <button
              onClick={toggleSound}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition border ${
                soundOn
                  ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700 animate-soft-pulse'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              } cursor-pointer`}
            >
              {soundOn ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            </button>
          </div>

          {/* Currently learning/building logs */}
          <div className="space-y-3.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-1">Activity Log</span>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1">
                <span className="text-[8px] font-black text-brand-blue uppercase tracking-wider">🔨 Building</span>
                <p className="text-[10px] text-slate-600 font-bold leading-relaxed">{currentStatus.building}</p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1">
                <span className="text-[8px] font-black text-purple-500 uppercase tracking-wider">📚 Learning</span>
                <p className="text-[10px] text-slate-600 font-bold leading-relaxed">{currentStatus.learning}</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1">
              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-wider">🚀 Latest Production Project</span>
              <p className="text-[10px] text-slate-700 font-bold">{currentStatus.latestProject}</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1">
              <span className="text-[8px] font-black text-pink-500 uppercase tracking-wider">🧪 Active Experiment</span>
              <p className="text-[10px] text-slate-700 font-bold">{currentStatus.latestExperiment}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between rounded-b-2xl">
          <button 
            onClick={() => setActiveLocationId(null)}
            className="flex items-center gap-1 text-[9px] font-bold text-slate-500 hover:text-slate-800 transition uppercase tracking-wider"
          >
            <ArrowLeft size={10} />
            <span>Return to City</span>
          </button>
          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
            CAFÉ ATMOSPHERE • COFFEE &amp; CODE
          </span>
        </div>
      </div>
    </div>
  );
};
export default CafeKiosk;
