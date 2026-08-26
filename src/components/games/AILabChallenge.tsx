import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { pipelineLevels } from '../../data/gamesData';
import type { PipelineStage, PipelineLevel } from '../../data/gamesData';
import { Brain, ArrowLeft, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AILabChallenge: React.FC = () => {
  const { activeGameId, setActiveGameId, saveGameScore } = useStore();
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [selectedStages, setSelectedStages] = useState<PipelineStage[]>([]);
  const [levelStatus, setLevelStatus] = useState<'playing' | 'completed'>('playing');

  if (activeGameId !== 'ai-challenge') return null;

  const currentLevel = pipelineLevels[currentLevelIdx];

  // Randomize blocks list for placement matching
  const getShuffledStages = (level: PipelineLevel) => {
    // Return stages, but not in correct order
    return [...level.stages].sort(() => Math.sin(level.stages.length) - 0.5);
  };

  const [shuffledStages, setShuffledStages] = useState<PipelineStage[]>(() => getShuffledStages(pipelineLevels[0]));

  const handleSelectStage = (stage: PipelineStage) => {
    if (levelStatus === 'completed' || selectedStages.find((s) => s.id === stage.id)) return;

    const newSelected = [...selectedStages, stage];
    setSelectedStages(newSelected);

    // Verify order
    const nextIdx = selectedStages.length;
    const targetStage = currentLevel.stages.find((s) => s.order === nextIdx + 1);

    if (targetStage && targetStage.id === stage.id) {
      // Correct stage! Check if full pipeline completed
      if (newSelected.length === currentLevel.stages.length) {
        setLevelStatus('completed');
        const nextLevelCompleted = currentLevelIdx + 1;
        saveGameScore('aiChallenge', nextLevelCompleted);

        // Confetti celebrate
        confetti({
          particleCount: 50,
          spread: 45,
          origin: { y: 0.6 }
        });
      }
    } else {
      // Wrong stage clicked! Reset selections for this level (non-punishing retry)
      setSelectedStages([]);
    }
  };

  const handleNextLevel = () => {
    if (currentLevelIdx + 1 < pipelineLevels.length) {
      const nextIdx = currentLevelIdx + 1;
      setCurrentLevelIdx(nextIdx);
      setSelectedStages([]);
      setLevelStatus('playing');
      setShuffledStages(getShuffledStages(pipelineLevels[nextIdx]));
    }
  };

  const handleResetLevel = () => {
    setSelectedStages([]);
    setLevelStatus('playing');
  };

  const handleResetAll = () => {
    setCurrentLevelIdx(0);
    setSelectedStages([]);
    setLevelStatus('playing');
    setShuffledStages(getShuffledStages(pipelineLevels[0]));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm pointer-events-auto select-none">
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
            <h2 className="text-xs font-bold text-slate-800 tracking-wide uppercase">AI Lab Challenge</h2>
            <p className="text-[8px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">Level {currentLevel.level} of {pipelineLevels.length}</p>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-5">
            {/* Mission banner */}
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5 flex items-start gap-3">
              <div className="w-7 h-7 bg-purple-100 rounded-lg text-purple-600 flex items-center justify-center shrink-0">
                <Brain size={14} />
              </div>
              <div className="text-[10px] font-medium text-slate-600 leading-relaxed">
                <strong className="text-purple-700 font-bold block mb-0.5">{currentLevel.title}</strong>
                Select the pipeline blocks at the bottom in the correct logical sequence (left-to-right).
              </div>
            </div>

            {/* Pipeline Stage Connector View */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 min-h-[110px] flex items-center justify-center flex-wrap gap-2.5 relative">
              {selectedStages.length > 0 ? (
                selectedStages.map((stg, i) => (
                  <React.Fragment key={stg.id}>
                    <div className="bg-brand-blue-dark border border-brand-blue/30 text-white font-bold text-[9px] px-3 py-2 rounded-lg shadow-soft flex items-center gap-1.5 animate-in slide-in-from-left-2">
                      <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[7px] font-black">{i + 1}</div>
                      <span>{stg.label}</span>
                    </div>
                    {i < selectedStages.length - 1 && (
                      <ArrowRight size={12} className="text-purple-400 shrink-0 animate-pulse" />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest animate-pulse">
                  &lt; pipeline empty. click blocks below to build &gt;
                </div>
              )}

              {levelStatus === 'completed' && (
                <div className="absolute inset-0 bg-emerald-950/80 rounded-xl flex items-center justify-center flex-col gap-1.5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-1 text-emerald-400 font-black tracking-widest text-xs uppercase">
                    <CheckCircle size={14} />
                    <span>Pipeline Complete ✓</span>
                  </div>
                  <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-wider">All connections validated</span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive choices blocks */}
          <div className="pt-6 border-t border-slate-100 mt-6 space-y-4">
            {levelStatus === 'playing' ? (
              <div className="space-y-3.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Available Pipeline Stages:</span>
                <div className="flex flex-wrap gap-2 justify-center">
                  {shuffledStages.map((stg) => {
                    const isSelected = selectedStages.find((s) => s.id === stg.id);
                    return (
                      <button
                        key={stg.id}
                        onClick={() => handleSelectStage(stg)}
                        disabled={!!isSelected}
                        className={`text-[9px] font-bold py-2.5 px-4 rounded-xl border transition cursor-pointer select-none ${
                          isSelected
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                            : 'bg-white border-slate-200 hover:border-purple-500/40 hover:shadow-soft text-slate-700 active:scale-95'
                        }`}
                      >
                        {stg.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleResetLevel}
                    className="flex items-center gap-1 text-[9px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider transition bg-slate-50 px-2.5 py-1.5 border border-slate-200 rounded-lg cursor-pointer"
                  >
                    <RefreshCw size={10} />
                    <span>Clear Stage</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center gap-3">
                {currentLevelIdx + 1 < pipelineLevels.length ? (
                  <button
                    onClick={handleNextLevel}
                    className="bg-brand-blue hover:bg-brand-blue-dark text-white text-[10px] font-bold py-2.5 px-6 rounded-xl shadow-soft transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next Level</span>
                    <ArrowRight size={12} />
                  </button>
                ) : (
                  <div className="text-center space-y-4 w-full">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">🎉 Congratulations! All AI/ML pipeline challenges completed.</p>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={handleResetAll}
                        className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[10px] font-bold py-2.5 px-5 rounded-xl shadow-soft transition flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw size={12} />
                        <span>Play Again</span>
                      </button>
                      <button
                        onClick={() => setActiveGameId(null)}
                        className="bg-brand-blue hover:bg-brand-blue-dark text-white text-[10px] font-bold py-2.5 px-6 rounded-xl shadow-soft transition cursor-pointer"
                      >
                        <span>Return to City</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AILabChallenge;
