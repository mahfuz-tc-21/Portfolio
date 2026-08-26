import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { ArrowLeft, RefreshCw, Trophy, Play, AlertOctagon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MemoryLocation {
  id: string;
  name: string;
  color: string;
}

const memoryLocations: MemoryLocation[] = [
  { id: 'city-center', name: 'MAHFUZ HQ', color: '#0066FF' },
  { id: 'ai-lab', name: 'AI LAB', color: '#8B5CF6' },
  { id: 'developer-hq', name: 'DEVELOPER HQ', color: '#10B981' },
  { id: 'cpi-campus', name: 'CPI CAMPUS', color: '#F59E0B' },
  { id: 'tech-cluder', name: 'TECH CLUDER', color: '#EF4444' }
];

export const CityMemory: React.FC = () => {
  const { activeGameId, setActiveGameId, saveGameScore } = useStore();
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'gameover'>('idle');
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);

  const timeoutIds = useRef<number[]>([]);

  // Cleanup active timeouts when unmounting — MUST be before any conditional return
  useEffect(() => {
    return () => {
      timeoutIds.current.forEach(id => clearTimeout(id));
    };
  }, []);

  if (activeGameId !== 'city-memory') return null;

  const handleStartGame = () => {
    setCurrentRound(1);
    setUserSequence([]);
    const firstLoc = memoryLocations[Math.floor(Math.random() * memoryLocations.length)].id;
    const newSeq = [firstLoc];
    setSequence(newSeq);
    playSequence(newSeq);
  };

  const playSequence = (seq: string[]) => {
    setGameState('showing');
    timeoutIds.current.forEach(id => clearTimeout(id));
    timeoutIds.current = [];

    seq.forEach((id, index) => {
      // Highlight on
      const idOn = window.setTimeout(() => {
        setActiveHighlightId(id);
      }, (index + 0.5) * 800);

      // Highlight off
      const idOff = window.setTimeout(() => {
        setActiveHighlightId(null);
        if (index === seq.length - 1) {
          setGameState('playing');
        }
      }, (index + 1) * 800);

      timeoutIds.current.push(idOn, idOff);
    });
  };

  const handleLocationClick = (id: string) => {
    if (gameState !== 'playing') return;

    const newUserSequence = [...userSequence, id];
    setUserSequence(newUserSequence);

    // Verify click
    const clickIdx = newUserSequence.length - 1;
    if (newUserSequence[clickIdx] !== sequence[clickIdx]) {
      // Game over!
      setGameState('gameover');
      saveGameScore('cityMemory', currentRound - 1);
      return;
    }

    // Check if round is successfully completed
    if (newUserSequence.length === sequence.length) {
      // Celebrate round success
      if (currentRound % 3 === 0) {
        confetti({
          particleCount: 20,
          spread: 30,
          origin: { y: 0.6 }
        });
      }

      // Progress to next round
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      setUserSequence([]);
      
      // Append a random location to sequence
      const nextLoc = memoryLocations[Math.floor(Math.random() * memoryLocations.length)].id;
      const newSeq = [...sequence, nextLoc];
      setSequence(newSeq);

      // Brief delay before playing next round sequence
      const nextRoundTimer = window.setTimeout(() => {
        playSequence(newSeq);
      }, 1000);
      timeoutIds.current.push(nextRoundTimer);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm pointer-events-auto select-none">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-premium w-full max-w-md max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col">
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
            <h2 className="text-xs font-bold text-slate-800 tracking-wide uppercase">City Memory</h2>
            <p className="text-[8px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">Round: {currentRound}</p>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {gameState === 'idle' && (
            <div className="text-center py-6 space-y-5">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-soft">
                <Trophy size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-800 tracking-wide">Test Your Focus</h3>
                <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs mx-auto font-medium">
                  Watch the highlighted path sequences on the screen, remember the order, and repeat them correctly.
                </p>
              </div>
              <button
                onClick={handleStartGame}
                className="bg-brand-blue hover:bg-brand-blue-dark text-white text-[10px] font-bold py-2 px-6 rounded-xl shadow-soft transition flex items-center gap-1 mx-auto cursor-pointer"
              >
                <Play size={12} fill="currentColor" />
                <span>Start Game</span>
              </button>
            </div>
          )}

          {(gameState === 'showing' || gameState === 'playing') && (
            <div className="space-y-6">
              {/* Status display */}
              <div className="text-center">
                <div className={`inline-block border text-[10px] font-bold px-4 py-1.5 rounded-full ${
                  gameState === 'showing' 
                    ? 'bg-amber-50 border-amber-200 text-amber-600 animate-pulse'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                }`}>
                  {gameState === 'showing' ? '👀 WATCH THE SEQUENCE...' : '👉 REPEAT THE SEQUENCE'}
                </div>
              </div>

              {/* Grid representation of locations */}
              <div className="grid grid-cols-2 gap-3 max-w-[280px] mx-auto">
                {memoryLocations.map((loc) => {
                  const isHighlighted = activeHighlightId === loc.id;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => handleLocationClick(loc.id)}
                      disabled={gameState !== 'playing'}
                      style={{ 
                        backgroundColor: isHighlighted ? loc.color : '#F1F5F9',
                        color: isHighlighted ? '#FFFFFF' : '#334155',
                        borderColor: isHighlighted ? loc.color : '#E2E8F0',
                        boxShadow: isHighlighted ? `0 0 16px ${loc.color}80` : 'none'
                      }}
                      className="aspect-video border rounded-2xl font-bold text-[10px] uppercase tracking-wider transition duration-150 flex flex-col items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span className="text-[14px]">{isHighlighted ? '🌟' : '🏢'}</span>
                      <span>{loc.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Progress dots bar */}
              <div className="flex justify-center gap-1.5">
                {sequence.map((_, i) => {
                  const isFilled = userSequence.length > i;
                  return (
                    <div 
                      key={i}
                      className={`w-2 h-2 rounded-full border transition ${
                        isFilled ? 'bg-brand-blue border-brand-blue' : 'bg-slate-100 border-slate-300'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="text-center py-6 space-y-5">
              <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-soft animate-bounce">
                <AlertOctagon size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-800 tracking-wide">Sequence Failed!</h3>
                <p className="text-[10px] text-slate-500 font-medium">You reached Round {currentRound}. Keep training your memory!</p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleStartGame}
                  className="bg-brand-blue hover:bg-brand-blue-dark text-white text-[10px] font-bold py-2 px-5 rounded-xl shadow-soft transition flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={() => setGameState('idle')}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[10px] font-bold py-2 px-5 rounded-xl shadow-soft transition cursor-pointer"
                >
                  <span>MainMenu</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer branding */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center rounded-b-2xl">
          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
            MAHFUZ'S MEMORY CHALLENGE • TRAIN YOUR BRAIN
          </span>
        </div>
      </div>
    </div>
  );
};
export default CityMemory;
