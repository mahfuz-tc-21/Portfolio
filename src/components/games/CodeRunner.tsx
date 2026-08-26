import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { ArrowLeft, RefreshCw, Trophy, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Obstacle {
  id: number;
  lane: number; // 0, 1, 2
  y: number; // percentage from top (0 to 100)
  type: 'bug' | 'code';
  label: string;
}

export const CodeRunner: React.FC = () => {
  const { activeGameId, setActiveGameId, saveGameScore } = useStore();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [playerLane, setPlayerLane] = useState(1); // 0 = left, 1 = center, 2 = right
  const [score, setScore] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);

  const gameLoopRef = useRef<number | null>(null);
  const scoreRef = useRef(0);
  const obstacleIdRef = useRef(0);
  const obstaclesRef = useRef<Obstacle[]>([]);

  if (activeGameId !== 'code-runner') return null;

  useEffect(() => {
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, []);

  const handleStartGame = () => {
    setPlayerLane(1);
    setScore(0);
    scoreRef.current = 0;
    setObstacles([]);
    obstaclesRef.current = [];
    obstacleIdRef.current = 0;
    setGameState('playing');

    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  const gameLoop = () => {
    // 1. Spawning logic
    if (Math.random() < 0.03) {
      const lane = Math.floor(Math.random() * 3);
      const isBug = Math.random() < 0.6;
      const label = isBug 
        ? ['BUG 🐛', 'NULL ❌', 'FATAL 🚨', 'CORS ⚠️'][Math.floor(Math.random() * 4)]
        : ['API 🔗', 'AI 🤖', 'DEPLOY 🚀', 'VAR 📦'][Math.floor(Math.random() * 4)];

      const newObstacle: Obstacle = {
        id: obstacleIdRef.current++,
        lane,
        y: -10,
        type: isBug ? 'bug' : 'code',
        label
      };
      obstaclesRef.current.push(newObstacle);
    }

    // 2. Movement & Collision logic
    let hitBug = false;
    const updatedObstacles = obstaclesRef.current
      .map((obs) => ({
        ...obs,
        y: obs.y + 1.8 // falling speed
      }))
      .filter((obs) => {
        // Check collision at player's y level (roughly y = 80 to 90)
        if (obs.y >= 75 && obs.y <= 88 && obs.lane === playerLane) {
          if (obs.type === 'bug') {
            hitBug = true;
          } else {
            // Collected deploy bonus!
            scoreRef.current += 10;
            setScore(scoreRef.current);
          }
          return false; // remove obstacle
        }

        // Add score for clean dodges when falling past bottom
        if (obs.y > 100) {
          if (obs.type === 'bug') {
            scoreRef.current += 1;
            setScore(scoreRef.current);
          }
          return false; // remove
        }
        return true;
      });

    obstaclesRef.current = updatedObstacles;
    setObstacles(updatedObstacles);

    if (hitBug) {
      // Game over!
      setGameState('gameover');
      saveGameScore('codeRunner', scoreRef.current);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      
      confetti({
        particleCount: 20,
        spread: 30,
        origin: { y: 0.6 }
      });
      return;
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  // Sync player lane changes to the loops
  const moveLeft = () => {
    if (playerLane > 0) setPlayerLane((prev) => prev - 1);
  };

  const moveRight = () => {
    if (playerLane < 2) setPlayerLane((prev) => prev + 1);
  };

  // Bind keyboard arrow controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveRight();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, playerLane]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm pointer-events-auto select-none">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-premium w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <button 
            onClick={() => {
              if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
              setActiveGameId(null);
            }}
            className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 transition uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
          >
            <ArrowLeft size={12} />
            <span>Back to City</span>
          </button>
          <div className="text-right">
            <h2 className="text-xs font-bold text-slate-800 tracking-wide uppercase">Code Runner</h2>
            <p className="text-[8px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">Score: {score}</p>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto flex flex-col justify-between">
          {gameState === 'idle' && (
            <div className="text-center py-6 space-y-5 flex-1 flex flex-col justify-center">
              <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto shadow-soft">
                <Trophy size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-800 tracking-wide font-display">Reach Production</h3>
                <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs mx-auto font-medium">
                  Switch lanes (Left/Right) to collect Deploys/APIs (+10 pts) and dodge Bugs, Cors warnings, and Fatal crashes (Game Over!).
                </p>
              </div>
              <button
                onClick={handleStartGame}
                className="bg-brand-blue hover:bg-brand-blue-dark text-white text-[10px] font-bold py-2 px-6 rounded-xl shadow-soft transition flex items-center gap-1 mx-auto cursor-pointer"
              >
                <Play size={12} fill="currentColor" />
                <span>Start Runner</span>
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              {/* Scrolling track zone */}
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl h-[240px] relative overflow-hidden flex shadow-inner">
                {/* 3 Lanes split markers */}
                <div className="absolute inset-y-0 left-1/3 border-l border-dashed border-slate-800/80" />
                <div className="absolute inset-y-0 left-2/3 border-l border-dashed border-slate-800/80" />

                {/* Draw obstacles */}
                {obstacles.map((obs) => (
                  <div
                    key={obs.id}
                    style={{ 
                      left: `${obs.lane * 33.3 + 16.6}%`, 
                      top: `${obs.y}%`, 
                      transform: 'translate(-50%, -50%)' 
                    }}
                    className={`absolute text-[8px] font-bold px-2 py-1 rounded shadow-soft border whitespace-nowrap transition-all duration-100 ${
                      obs.type === 'bug'
                        ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse'
                        : 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    }`}
                  >
                    {obs.label}
                  </div>
                ))}

                {/* Draw player avatar cursor */}
                <div
                  style={{ 
                    left: `${playerLane * 33.3 + 16.6}%`, 
                    top: '82%', 
                    transform: 'translate(-50%, -50%)' 
                  }}
                  className="absolute w-6 h-6 bg-brand-blue border-2 border-white rounded-lg flex items-center justify-center shadow-soft text-white font-extrabold text-[9px] transition-all duration-150 animate-bounce"
                >
                  🚀
                </div>
              </div>

              {/* Touch controllers */}
              <div className="flex justify-center gap-6">
                <button
                  onClick={moveLeft}
                  className="w-16 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer active:scale-95"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={moveRight}
                  className="w-16 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer active:scale-95"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="text-center py-6 space-y-5 flex-1 flex flex-col justify-center">
              <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-soft animate-bounce">
                <AlertCircle2 size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-800 tracking-wide font-display">System Crash!</h3>
                <p className="text-[10px] text-slate-500 font-medium">Production failed with a score of {score}.</p>
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
            MAHFUZ'S CODE RUNNER • BUG EVASION DEPLOYER
          </span>
        </div>
      </div>
    </div>
  );
};

// Quick helper component to bypass lucide import issues
const AlertCircle2 = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default CodeRunner;
