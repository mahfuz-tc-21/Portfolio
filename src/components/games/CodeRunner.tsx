import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import { ArrowLeft, RefreshCw, Trophy, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Obstacle {
  id: number;
  lane: number; // 0, 1, 2
  y: number; // percentage from top
  type: 'bug' | 'bonus';
  label: string;
}

const bugLabels = ['BUG 🐛', 'NULL ❌', 'FATAL 🚨', 'CORS ⚠️', 'NaN 💥', 'ERR 🔴'];
const bonusLabels = ['API 🔗', 'AI 🤖', 'DEPLOY 🚀', 'VAR 📦', '+10 ✅', 'MERGE 🟢'];

export const CodeRunner: React.FC = () => {
  const { activeGameId, setActiveGameId, saveGameScore } = useStore();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [playerLane, setPlayerLane] = useState(1);
  const [score, setScore] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);

  const gameLoopRef = useRef<number | null>(null);
  const scoreRef = useRef(0);
  const playerLaneRef = useRef(1); // keep a ref to avoid stale closure
  const obstacleIdRef = useRef(0);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const gameActiveRef = useRef(false);

  if (activeGameId !== 'code-runner') return null;

  const stopLoop = useCallback(() => {
    gameActiveRef.current = false;
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
  }, []);

  useEffect(() => {
    return () => stopLoop();
  }, [stopLoop]);

  const handleStartGame = () => {
    stopLoop();
    playerLaneRef.current = 1;
    setPlayerLane(1);
    setScore(0);
    scoreRef.current = 0;
    setObstacles([]);
    obstaclesRef.current = [];
    obstacleIdRef.current = 0;
    setGameState('playing');
    gameActiveRef.current = true;

    // Delay to ensure state is set
    setTimeout(() => {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }, 50);
  };

  const gameLoop = () => {
    if (!gameActiveRef.current) return;

    // 1. Spawn
    const spawnChance = 0.025 + Math.min(scoreRef.current * 0.0004, 0.05);
    if (Math.random() < spawnChance) {
      const lane = Math.floor(Math.random() * 3);
      const isBug = Math.random() < 0.55;
      const label = isBug
        ? bugLabels[Math.floor(Math.random() * bugLabels.length)]
        : bonusLabels[Math.floor(Math.random() * bonusLabels.length)];

      obstaclesRef.current.push({
        id: obstacleIdRef.current++,
        lane,
        y: -12,
        type: isBug ? 'bug' : 'bonus',
        label
      });
    }

    // 2. Move & collision
    let hitBug = false;
    const currentLane = playerLaneRef.current;

    obstaclesRef.current = obstaclesRef.current
      .map(obs => ({ ...obs, y: obs.y + 1.6 + Math.min(scoreRef.current * 0.003, 1.5) }))
      .filter(obs => {
        // Collision zone
        if (obs.y >= 76 && obs.y <= 92 && obs.lane === currentLane) {
          if (obs.type === 'bug') {
            hitBug = true;
          } else {
            scoreRef.current += 10;
            setScore(scoreRef.current);
          }
          return false;
        }
        // Off screen — bonus dodge score
        if (obs.y > 102) {
          if (obs.type === 'bug') {
            scoreRef.current += 2;
            setScore(scoreRef.current);
          }
          return false;
        }
        return true;
      });

    setObstacles([...obstaclesRef.current]);

    if (hitBug) {
      gameActiveRef.current = false;
      setGameState('gameover');
      saveGameScore('codeRunner', scoreRef.current);
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.6 } });
      return;
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  const moveLeft = useCallback(() => {
    if (playerLaneRef.current > 0) {
      playerLaneRef.current--;
      setPlayerLane(playerLaneRef.current);
    }
  }, []);

  const moveRight = useCallback(() => {
    if (playerLaneRef.current < 2) {
      playerLaneRef.current++;
      setPlayerLane(playerLaneRef.current);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameActiveRef.current) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault(); moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault(); moveRight();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveLeft, moveRight]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm pointer-events-auto select-none">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-premium w-full max-w-md max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <button 
            onClick={() => { stopLoop(); setActiveGameId(null); }}
            className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 transition uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
          >
            <ArrowLeft size={12} />
            <span>Back</span>
          </button>
          <div className="text-center">
            <h2 className="text-xs font-bold text-slate-800 tracking-wide uppercase">🚀 Code Runner</h2>
            <p className="text-[8px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">Score: {score}</p>
          </div>
          <div className="w-16" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col p-4 gap-4 justify-between">

          {gameState === 'idle' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5">
              <div className="w-14 h-14 bg-pink-100 text-pink-500 rounded-2xl flex items-center justify-center shadow-soft">
                <Trophy size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-black text-slate-800">Reach Production!</h3>
                <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs mx-auto font-medium">
                  Switch lanes (← →) to dodge bugs & CORS errors. Collect Deploy and API bonuses for +10 pts each. Hit a bug = Game Over!
                </p>
              </div>
              <button
                onClick={handleStartGame}
                className="bg-pink-500 hover:bg-pink-600 text-white text-[10px] font-black py-2.5 px-8 rounded-xl shadow-soft transition flex items-center gap-2 mx-auto cursor-pointer"
              >
                <Play size={12} fill="currentColor" />
                <span>Start Runner</span>
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="flex-1 flex flex-col gap-4">
              {/* Track */}
              <div className="bg-slate-950 rounded-2xl h-[240px] relative overflow-hidden border-2 border-slate-800 shadow-inner flex-shrink-0">
                {/* Lane dividers */}
                <div className="absolute inset-y-0 left-1/3 w-px bg-slate-700/60 border-l border-dashed border-slate-700" />
                <div className="absolute inset-y-0 left-2/3 w-px bg-slate-700/60 border-l border-dashed border-slate-700" />

                {/* Ground line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-rose-900/80" />

                {/* Obstacles */}
                {obstacles.map(obs => (
                  <div
                    key={obs.id}
                    style={{ 
                      left: `${obs.lane * 33.3 + 16.6}%`, 
                      top: `${obs.y}%`, 
                      transform: 'translate(-50%, -50%)'
                    }}
                    className={`absolute text-[8px] font-bold px-2 py-1 rounded border whitespace-nowrap ${
                      obs.type === 'bug'
                        ? 'bg-rose-950/90 border-rose-600/80 text-rose-300 shadow-[0_0_8px_rgba(239,68,68,0.3)] animate-pulse'
                        : 'bg-emerald-950/90 border-emerald-600/80 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                    }`}
                  >
                    {obs.label}
                  </div>
                ))}

                {/* Player */}
                <div
                  style={{ 
                    left: `${playerLane * 33.3 + 16.6}%`, 
                    top: '82%', 
                    transform: 'translate(-50%, -50%)',
                    transition: 'left 0.1s ease-out'
                  }}
                  className="absolute w-8 h-8 bg-pink-500 border-2 border-white rounded-xl flex items-center justify-center shadow-lg text-sm"
                >
                  🚀
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center items-center gap-4">
                <button
                  onPointerDown={moveLeft}
                  className="w-16 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-200 active:scale-95 cursor-pointer transition shadow-sm"
                >
                  <ChevronLeft size={22} />
                </button>
                <div className="text-center">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Use ← → or tap</span>
                </div>
                <button
                  onPointerDown={moveRight}
                  className="w-16 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-200 active:scale-95 cursor-pointer transition shadow-sm"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5">
              <div className="w-14 h-14 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center shadow-soft animate-bounce">
                <span className="text-2xl">💥</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-black text-slate-800">Build Failed!</h3>
                <p className="text-[10px] text-slate-500 font-medium">Production crashed with score: <span className="font-black text-pink-500">{score} pts</span></p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleStartGame}
                  className="bg-pink-500 hover:bg-pink-600 text-white text-[10px] font-bold py-2 px-5 rounded-xl shadow-soft transition flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={11} />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={() => { stopLoop(); setActiveGameId(null); }}
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
            MAHFUZ'S CODE RUNNER • DODGE BUGS TO DEPLOY
          </span>
        </div>
      </div>
    </div>
  );
};
export default CodeRunner;
