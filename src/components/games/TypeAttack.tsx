import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import { ArrowLeft, RefreshCw, Trophy, Play, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FallingWord {
  id: number;
  word: string;
  lane: number;   // 0-3 column
  y: number;      // percentage from top
  speed: number;
}

const devWords = [
  'useState', 'useEffect', 'Promise', 'async', 'await', 'forEach',
  'React', 'TypeScript', 'Python', 'MongoDB', 'useRef', 'fetch',
  'Array', 'Object', 'function', 'import', 'export', 'return',
  'const', 'interface', 'useStore', 'render', 'props', 'useState',
  'webpack', 'vite', 'npm', 'git', 'push', 'commit', 'branch',
  'debug', 'deploy', 'build', 'docker', 'api', 'router', 'schema'
];

export const TypeAttack: React.FC = () => {
  const { activeGameId, setActiveGameId, saveGameScore } = useStore();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);
  const [typedInput, setTypedInput] = useState('');
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [combo, setCombo] = useState(0);

  const gameLoopRef = useRef<number | null>(null);
  const scoreRef = useRef(0);
  const missedRef = useRef(0);
  const comboRef = useRef(0);
  const wordIdRef = useRef(0);
  const wordsRef = useRef<FallingWord[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  if (activeGameId !== 'type-attack') return null;

  const MAX_MISSES = 5;

  const stopGame = useCallback(() => {
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
  }, []);

  useEffect(() => {
    return () => stopGame();
  }, [stopGame]);

  const handleStartGame = () => {
    scoreRef.current = 0;
    missedRef.current = 0;
    comboRef.current = 0;
    wordIdRef.current = 0;
    wordsRef.current = [];
    setScore(0);
    setMissed(0);
    setCombo(0);
    setFallingWords([]);
    setTypedInput('');
    setGameState('playing');
    stopGame();
    setTimeout(() => {
      inputRef.current?.focus();
      gameLoopRef.current = requestAnimationFrame(loop);
    }, 100);
  };

  const loop = () => {
    // Spawn new word occasionally
    if (Math.random() < 0.018 + Math.min(scoreRef.current * 0.0005, 0.04)) {
      const word = devWords[Math.floor(Math.random() * devWords.length)];
      const lane = Math.floor(Math.random() * 4);
      wordsRef.current.push({
        id: wordIdRef.current++,
        word,
        lane,
        y: -8,
        speed: 0.35 + Math.random() * 0.25 + Math.min(scoreRef.current * 0.002, 0.3)
      });
    }

    // Move words down
    let newMisses = 0;
    wordsRef.current = wordsRef.current
      .map(w => ({ ...w, y: w.y + w.speed }))
      .filter(w => {
        if (w.y > 100) {
          newMisses++;
          return false;
        }
        return true;
      });

    if (newMisses > 0) {
      missedRef.current += newMisses;
      setMissed(missedRef.current);
      comboRef.current = 0;
      setCombo(0);

      if (missedRef.current >= MAX_MISSES) {
        setFallingWords([]);
        setGameState('gameover');
        saveGameScore('typeAttack', scoreRef.current);
        stopGame();
        return;
      }
    }

    setFallingWords([...wordsRef.current]);
    gameLoopRef.current = requestAnimationFrame(loop);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTypedInput(value);

    // Check if matches any word
    const hit = wordsRef.current.find(w => w.word === value.trim());
    if (hit) {
      wordsRef.current = wordsRef.current.filter(w => w.id !== hit.id);
      comboRef.current++;
      setCombo(comboRef.current);
      const pts = 10 + (comboRef.current > 2 ? comboRef.current * 5 : 0);
      scoreRef.current += pts;
      setScore(scoreRef.current);
      setFallingWords([...wordsRef.current]);
      setTypedInput('');

      if (comboRef.current >= 5) {
        confetti({ particleCount: 30, spread: 40, origin: { y: 0.6 } });
      }
    }
  };

  const laneColors = ['text-blue-400', 'text-emerald-400', 'text-purple-400', 'text-amber-400'];
  const laneBgs = ['bg-blue-950', 'bg-emerald-950', 'bg-purple-950', 'bg-amber-950'];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm pointer-events-auto select-none">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-premium w-full max-w-lg max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <button 
            onClick={() => { stopGame(); setActiveGameId(null); }}
            className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 transition uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
          >
            <ArrowLeft size={12} />
            <span>Back</span>
          </button>
          <div className="text-center">
            <h2 className="text-xs font-bold text-slate-800 tracking-wide uppercase">⚡ Type Attack</h2>
            <p className="text-[8px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">
              {gameState === 'playing' ? `Score: ${score} • Combo: x${combo} • Missed: ${missed}/${MAX_MISSES}` : 'Type Dev Keywords!'}
            </p>
          </div>
          <div className="w-16" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          
          {/* IDLE screen */}
          {gameState === 'idle' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 text-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center shadow-soft">
                <Zap size={28} fill="currentColor" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-800">Type Attack!</h3>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
                  Dev keywords rain from the top. Type them exactly and press nothing — just type to destroy them before they reach the ground!
                </p>
                <div className="flex justify-center gap-3 pt-1 text-[9px] font-bold">
                  <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full">+10 pts each</span>
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full">+5 combo bonus</span>
                  <span className="bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-full">5 misses = over</span>
                </div>
              </div>
              <button
                onClick={handleStartGame}
                className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black py-2.5 px-8 rounded-xl shadow-soft transition flex items-center gap-2 mx-auto cursor-pointer"
              >
                <Play size={12} fill="currentColor" />
                <span>Start Typing!</span>
              </button>
            </div>
          )}

          {/* PLAYING screen */}
          {gameState === 'playing' && (
            <div className="flex-1 flex flex-col">
              {/* Game area */}
              <div className="flex-1 bg-slate-950 relative overflow-hidden" style={{ minHeight: 240 }}>
                {/* Lane dividers */}
                <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-10">
                  {[0,1,2,3].map(i => (
                    <div key={i} className="border-r border-slate-600 last:border-r-0" />
                  ))}
                </div>

                {/* Missed bar at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-900/60">
                  <div 
                    className="h-full bg-rose-500 transition-all duration-300"
                    style={{ width: `${(missed / MAX_MISSES) * 100}%` }}
                  />
                </div>

                {/* Falling words */}
                {fallingWords.map(w => {
                  const isMatching = typedInput.length > 0 && w.word.startsWith(typedInput);
                  return (
                    <div
                      key={w.id}
                      className={`absolute font-mono font-bold text-[10px] px-2 py-0.5 rounded border transition-colors ${
                        isMatching 
                          ? 'bg-amber-500 border-amber-400 text-white scale-110 shadow-lg' 
                          : `${laneBgs[w.lane]} border-slate-700 ${laneColors[w.lane]}`
                      }`}
                      style={{
                        left: `${w.lane * 25 + 12.5}%`,
                        top: `${w.y}%`,
                        transform: 'translateX(-50%)',
                        transition: 'background-color 0.1s'
                      }}
                    >
                      {isMatching ? (
                        <>
                          <span className="text-white/50">{typedInput}</span>
                          <span>{w.word.slice(typedInput.length)}</span>
                        </>
                      ) : w.word}
                    </div>
                  );
                })}

                {/* Combo indicator */}
                {combo >= 3 && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-lg animate-pulse">
                    x{combo} COMBO!
                  </div>
                )}
              </div>

              {/* Input row */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                <span className="font-mono text-emerald-500 text-[10px] font-bold select-none">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={typedInput}
                  onChange={handleTyping}
                  className="flex-1 bg-transparent border-none outline-none font-mono text-[11px] text-white caret-amber-400 placeholder-slate-600"
                  placeholder="type words here…"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
                {typedInput && (
                  <button
                    onClick={() => setTypedInput('')}
                    className="text-slate-500 hover:text-slate-300 text-[9px] font-bold cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* GAMEOVER screen */}
          {gameState === 'gameover' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-5 text-center">
              <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shadow-soft animate-bounce">
                <Trophy size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-black text-slate-800">Game Over!</h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  You scored <span className="font-black text-brand-blue">{score} pts</span> with {missed} misses.
                </p>
                {score > 0 && (
                  <p className="text-[9px] text-amber-600 font-bold bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 inline-block">
                    🏆 High score saved!
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleStartGame}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold py-2 px-5 rounded-xl shadow-soft transition flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={11} />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={() => { stopGame(); setActiveGameId(null); }}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[10px] font-bold py-2 px-5 rounded-xl transition cursor-pointer"
                >
                  Back to Hub
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
            MAHFUZ'S TYPE ATTACK • DEV KEYBOARD WARFARE
          </span>
        </div>
      </div>
    </div>
  );
};
export default TypeAttack;
