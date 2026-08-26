import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { debugSystems } from '../../data/gamesData';
import type { DebugSystem } from '../../data/gamesData';
import { Terminal, CheckCircle2, AlertTriangle, ArrowLeft, RefreshCw, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DebugCity: React.FC = () => {
  const { activeGameId, setActiveGameId, saveGameScore } = useStore();
  const [fixedSystems, setFixedSystems] = useState<Record<string, boolean>>({});
  const [selectedSystem, setSelectedSystem] = useState<DebugSystem | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);

  if (activeGameId !== 'debug-city') return null;

  const handleSystemClick = (sys: DebugSystem) => {
    if (fixedSystems[sys.id]) return;
    setSelectedSystem(sys);
    setSelectedOption(null);
    setShowResult(null);
  };

  const handleSubmitAnswer = () => {
    if (!selectedSystem || !selectedOption) return;

    if (selectedOption === selectedSystem.correctAnswer) {
      setShowResult('correct');
      const updatedFixed = {
        ...fixedSystems,
        [selectedSystem.id]: true
      };
      setFixedSystems(updatedFixed);

      // Save high score
      const fixedCount = Object.values(updatedFixed).filter(Boolean).length;
      saveGameScore('debugCity', fixedCount);

      // Confetti splash
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.6 }
      });
    } else {
      setShowResult('wrong');
    }
  };

  const handleCloseSystemModal = () => {
    setSelectedSystem(null);
    setSelectedOption(null);
    setShowResult(null);
  };

  const handleReset = () => {
    setFixedSystems({});
    setSelectedSystem(null);
    setSelectedOption(null);
    setShowResult(null);
  };

  const fixedCount = Object.values(fixedSystems).filter(Boolean).length;
  const isFinished = fixedCount === debugSystems.length;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm pointer-events-auto select-none">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-premium w-full max-w-xl max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <button 
            onClick={() => setActiveGameId(null)}
            className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 transition uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
          >
            <ArrowLeft size={12} />
            <span>Back to City</span>
          </button>
          <div className="text-right">
            <h2 className="text-xs font-bold text-slate-800 tracking-wide uppercase">Debug the City</h2>
            <p className="text-[8px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">Fixed: {fixedCount}/{debugSystems.length}</p>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {!isFinished ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-center text-[10px] font-semibold text-slate-600 leading-relaxed">
                🚨 System alerts detected! Click on a system node below, check the diagnostic console logs, and select the correct fix.
              </div>

              <div className="space-y-2.5">
                {debugSystems.map((sys) => {
                  const isFixed = fixedSystems[sys.id];
                  return (
                    <button
                      key={sys.id}
                      onClick={() => handleSystemClick(sys)}
                      className={`w-full border rounded-xl p-3.5 flex items-center justify-between transition text-left cursor-pointer ${
                        isFixed
                          ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
                          : 'bg-white border-slate-100 hover:border-brand-blue/30 hover:shadow-soft'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm border ${
                          isFixed 
                            ? 'bg-emerald-100 border-emerald-200 text-emerald-600' 
                            : 'bg-slate-100 border-slate-200 text-slate-500 animate-pulse'
                        }`}>
                          <Terminal size={14} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{sys.systemName}</h4>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                            Loc: {sys.buildingId.replace('-', ' ')}
                          </p>
                        </div>
                      </div>

                      <div>
                        {isFixed ? (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <CheckCircle2 size={12} />
                            <span>REPAIRED</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                            <AlertTriangle size={12} className="animate-bounce" />
                            <span>ATTENTION</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-soft animate-bounce">
                <Sparkles size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-800 tracking-wide">City Fully Repaired!</h3>
                <p className="text-xs text-slate-500 font-medium">All database nodes, APIs, routers, and pipeline stages are operational.</p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[10px] font-bold py-2 px-4 rounded-xl shadow-soft transition flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Play Again</span>
                </button>
                <button
                  onClick={() => setActiveGameId(null)}
                  className="bg-brand-blue hover:bg-brand-blue-dark text-white text-[10px] font-bold py-2 px-6 rounded-xl shadow-soft transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Return to City</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Diagnostic Question Modal */}
        {selectedSystem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs pointer-events-auto">
            <div className="bg-white border border-slate-100 shadow-premium rounded-2xl w-full max-w-md p-5 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Diagnostic Console</h3>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{selectedSystem.systemName}</p>
                </div>
                {showResult === null && (
                  <button 
                    onClick={handleCloseSystemModal}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Console log display */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-[9px] text-emerald-400 space-y-1">
                <div className="text-slate-500">&gt; running system diagnostic...</div>
                <div className="text-amber-400">&gt; diagnostic finished. status check:</div>
                <div className="text-rose-500 font-bold">{selectedSystem.problem}</div>
              </div>

              {/* Multiple choices */}
              {showResult === null ? (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select correct fix:</span>
                  <div className="space-y-2">
                    {selectedSystem.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedOption(opt)}
                        className={`w-full text-left p-3 rounded-xl border text-[10px] font-bold transition flex items-center justify-between cursor-pointer ${
                          selectedOption === opt
                            ? 'bg-brand-blue-light border-brand-blue text-brand-blue'
                            : 'bg-white border-slate-100 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <span>{opt}</span>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          selectedOption === opt ? 'border-brand-blue bg-brand-blue text-white' : 'border-slate-300'
                        }`}>
                          {selectedOption === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedOption}
                      className="bg-brand-blue hover:bg-brand-blue-dark disabled:opacity-50 text-white text-[10px] font-bold py-2 px-5 rounded-xl shadow-soft transition cursor-pointer"
                    >
                      Apply Patch
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center space-y-4">
                  {showResult === 'correct' ? (
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <CheckCircle2 size={24} />
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">Patch Applied Successfully!</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-medium">The node reports normal operation and connections are restored.</p>
                      <button
                        onClick={handleCloseSystemModal}
                        className="bg-brand-blue hover:bg-brand-blue-dark text-white text-[10px] font-bold py-1.5 px-4 rounded-xl shadow-soft transition cursor-pointer"
                      >
                        Confirm Diagnostics
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                        <AlertTriangle size={24} />
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">Patch Failed to Deploy</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{selectedSystem.hint}</p>
                      <button
                        onClick={() => setShowResult(null)}
                        className="bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold py-1.5 px-4 rounded-xl shadow-soft transition cursor-pointer"
                      >
                        Retry Diagnostic Fix
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default DebugCity;
