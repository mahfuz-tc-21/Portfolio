import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import { ArrowLeft, RefreshCw, Trophy, Play, CheckCircle2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

// 10x10 Maze Grid layout (1 = Wall, 0 = Path, 2 = Start, 3 = Goal)
const mazeLayout = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 0, 0, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const startX = 1;
const startY = 1;

export const CityMaze: React.FC = () => {
  const { activeGameId, setActiveGameId, saveGameScore } = useStore();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'completed'>('idle');
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: startX, y: startY });
  const [timer, setTimer] = useState(0);

  const timerInterval = useRef<number | null>(null);
  // Use a ref so keyboard handler always sees latest pos without re-binding
  const playerPosRef = useRef<{ x: number; y: number }>({ x: startX, y: startY });
  const gameStateRef = useRef<'idle' | 'playing' | 'completed'>('idle');
  const timerRef = useRef(0);

  if (activeGameId !== 'city-maze') return null;

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, []);

  const handleStartGame = () => {
    const startPos = { x: startX, y: startY };
    playerPosRef.current = startPos;
    timerRef.current = 0;
    gameStateRef.current = 'playing';
    setPlayerPos(startPos);
    setTimer(0);
    setGameState('playing');
    
    if (timerInterval.current) clearInterval(timerInterval.current);
    timerInterval.current = window.setInterval(() => {
      timerRef.current++;
      setTimer(timerRef.current);
    }, 1000);
  };

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameStateRef.current !== 'playing') return;

    const cur = playerPosRef.current;
    const newX = cur.x + dx;
    const newY = cur.y + dy;

    if (
      newY >= 0 && newY < mazeLayout.length &&
      newX >= 0 && newX < mazeLayout[0].length &&
      mazeLayout[newY][newX] !== 1
    ) {
      const newPos = { x: newX, y: newY };
      playerPosRef.current = newPos;
      setPlayerPos(newPos);

      if (mazeLayout[newY][newX] === 3) {
        gameStateRef.current = 'completed';
        setGameState('completed');
        if (timerInterval.current) clearInterval(timerInterval.current);
        saveGameScore('cityMaze', timerRef.current);
        confetti({ particleCount: 50, spread: 45, origin: { y: 0.6 } });
      }
    }
  }, [saveGameScore]);

  // Bind keyboard inputs — stable handler via refs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) {
        e.preventDefault(); movePlayer(0, -1);
      } else if (['ArrowDown', 's', 'S'].includes(e.key)) {
        e.preventDefault(); movePlayer(0, 1);
      } else if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
        e.preventDefault(); movePlayer(-1, 0);
      } else if (['ArrowRight', 'd', 'D'].includes(e.key)) {
        e.preventDefault(); movePlayer(1, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm pointer-events-auto select-none">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-premium w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col">
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
            <h2 className="text-xs font-bold text-slate-800 tracking-wide uppercase">City Grid Maze</h2>
            <p className="text-[8px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">Time: {timer}s</p>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto flex flex-col justify-between">
          {gameState === 'idle' && (
            <div className="text-center py-6 space-y-5 flex-1 flex flex-col justify-center">
              <div className="w-14 h-14 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mx-auto shadow-soft">
                <Trophy size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-800 tracking-wide font-display">Reach the Goal</h3>
                <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs mx-auto font-medium">
                  Navigate the blue dot out of the block network to the orange AI Lab exit. Use arrow keys or touch buttons.
                </p>
              </div>
              <button
                onClick={handleStartGame}
                className="bg-brand-blue hover:bg-brand-blue-dark text-white text-[10px] font-bold py-2 px-6 rounded-xl shadow-soft transition flex items-center gap-1 mx-auto cursor-pointer"
              >
                <Play size={12} fill="currentColor" />
                <span>Start Maze</span>
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              {/* Map grid rendering */}
              <div className="grid grid-cols-10 gap-0.5 bg-slate-200 border-2 border-slate-300 rounded-xl p-1.5 max-w-[280px] mx-auto w-full aspect-square shadow-inner">
                {mazeLayout.map((row, y) =>
                  row.map((cell, x) => {
                    const isPlayer = playerPos.x === x && playerPos.y === y;
                    return (
                      <div
                        key={`${x}-${y}`}
                        className={`aspect-square rounded-[3px] transition-all duration-100 flex items-center justify-center ${
                          isPlayer
                            ? 'bg-brand-blue border border-white scale-95 shadow-soft'
                            : cell === 1
                            ? 'bg-slate-700 shadow-sm'
                            : cell === 3
                            ? 'bg-amber-500 border border-white animate-soft-pulse'
                            : 'bg-white'
                        }`}
                      >
                        {isPlayer && <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                        {!isPlayer && cell === 3 && <span className="text-[8px]">🎯</span>}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Touch controllers for mobile support */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => movePlayer(0, -1)}
                  className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer active:scale-95"
                >
                  <ChevronUp size={18} />
                </button>
                <div className="flex gap-10">
                  <button
                    onClick={() => movePlayer(-1, 0)}
                    className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer active:scale-95"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => movePlayer(1, 0)}
                    className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer active:scale-95"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
                <button
                  onClick={() => movePlayer(0, 1)}
                  className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer active:scale-95"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>
          )}

          {gameState === 'completed' && (
            <div className="text-center py-6 space-y-5 flex-1 flex flex-col justify-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-soft animate-bounce">
                <CheckCircle2 size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-800 tracking-wide font-display">Maze Escaped!</h3>
                <p className="text-[10px] text-slate-500 font-medium">You reached production in {timer} seconds.</p>
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
            MAHFUZ'S GRID MAZE • DEVELOPER LOGS
          </span>
        </div>
      </div>
    </div>
  );
};
export default CityMaze;
