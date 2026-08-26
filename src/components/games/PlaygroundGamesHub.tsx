import React from 'react';
import { useStore } from '../../store/useStore';
import { Trophy, Play, X, Terminal, Cpu, Brain, Layers, GitFork, Zap, Star } from 'lucide-react';

export const PlaygroundGamesHub: React.FC = () => {
  const { 
    activeLocationId, 
    setActiveLocationId, 
    activeGameId, 
    setActiveGameId, 
    gameScores 
  } = useStore();

  // Only render when playground is active AND no specific game is running
  if (activeLocationId !== 'playground') return null;
  if (activeGameId !== null) return null;

  const games = [
    {
      id: 'debug-city',
      title: 'Debug the City',
      description: 'Fix broken servers, API nodes, and data streams. Diagnose errors using real dev logic.',
      icon: <Terminal className="text-blue-500" size={20} />,
      color: '#3B82F6',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      highScoreLabel: 'Bugs Fixed',
      scoreKey: 'debugCity',
      maxScore: 5,
      badge: '🔧',
      difficulty: 'Easy'
    },
    {
      id: 'ai-challenge',
      title: 'AI Lab Challenge',
      description: 'Connect ML pipeline stages in the correct order. 3 escalating difficulty levels.',
      icon: <Brain className="text-purple-500" size={20} />,
      color: '#8B5CF6',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      highScoreLabel: 'Levels Done',
      scoreKey: 'aiChallenge',
      maxScore: 3,
      badge: '🧠',
      difficulty: 'Medium'
    },
    {
      id: 'city-memory',
      title: 'City Memory',
      description: 'Watch the city light up. Remember the sequence and tap the correct order.',
      icon: <Layers className="text-emerald-500" size={20} />,
      color: '#10B981',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      highScoreLabel: 'Max Round',
      scoreKey: 'cityMemory',
      maxScore: undefined,
      badge: '🧩',
      difficulty: 'Medium'
    },
    {
      id: 'city-maze',
      title: 'Grid Maze Escape',
      description: 'Navigate through the city block maze to reach the AI Lab exit using arrow keys.',
      icon: <GitFork className="text-cyan-500" size={20} />,
      color: '#06B6D4',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-100',
      highScoreLabel: 'Best Time',
      scoreKey: 'cityMaze',
      suffix: 's',
      badge: '🗺️',
      difficulty: 'Easy'
    },
    {
      id: 'code-runner',
      title: 'Code Runner',
      description: 'Switch lanes to dodge bugs and CORS errors. Collect deployments to score points!',
      icon: <Cpu className="text-pink-500" size={20} />,
      color: '#EC4899',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-100',
      highScoreLabel: 'High Score',
      scoreKey: 'codeRunner',
      badge: '🚀',
      difficulty: 'Hard'
    },
    {
      id: 'type-attack',
      title: 'Type Attack',
      description: 'Type the falling dev keywords before they reach the bottom! Speed is your weapon.',
      icon: <Zap className="text-amber-500" size={20} />,
      color: '#F59E0B',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      highScoreLabel: 'Words Typed',
      scoreKey: 'typeAttack',
      badge: '⚡',
      difficulty: 'Hard'
    }
  ];

  const totalScore = Object.values(gameScores).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md pointer-events-auto">
      <div className="bg-white/98 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-2xl w-full max-w-2xl max-h-[88vh] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-blue text-white flex items-center justify-center shadow-soft">
              <Trophy size={18} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-800 tracking-wide uppercase">Mahfuz's Arcade</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Playground District • 6 Games</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Global Score badge */}
            {totalScore > 0 && (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
                <Star size={10} className="text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-black text-amber-700">{totalScore} XP</span>
              </div>
            )}
            <button 
              onClick={() => setActiveLocationId(null)}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Game Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid sm:grid-cols-2 gap-3">
            {games.map((g) => {
              const bestScore = gameScores[g.scoreKey as keyof typeof gameScores] || 0;
              const hasScore = bestScore > 0;
              const difficultyColor = g.difficulty === 'Easy' 
                ? 'text-emerald-600 bg-emerald-50 border-emerald-200' 
                : g.difficulty === 'Medium' 
                ? 'text-amber-600 bg-amber-50 border-amber-200' 
                : 'text-rose-600 bg-rose-50 border-rose-200';

              return (
                <div 
                  key={g.id}
                  className={`relative ${g.bgColor} border ${g.borderColor} rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all duration-200 group cursor-pointer`}
                  onClick={() => setActiveGameId(g.id)}
                >
                  {/* Top row */}
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-xl bg-white border border-white/60 flex items-center justify-center shadow-sm">
                        {g.icon}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${difficultyColor}`}>
                          {g.difficulty}
                        </span>
                        {hasScore && (
                          <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
                            <Star size={10} className="text-white fill-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-800 tracking-wide leading-tight">{g.badge} {g.title}</h3>
                      <p className="text-[9px] text-slate-500 font-medium leading-relaxed mt-0.5">{g.description}</p>
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div className="mt-4 flex items-center justify-between border-t border-white/60 pt-3">
                    <div className="text-[9px] font-bold text-slate-400">
                      🏆 {g.highScoreLabel}:{' '}
                      <span className="text-slate-700">
                        {hasScore ? `${bestScore}${g.maxScore ? `/${g.maxScore}` : ''}${bestScore && (g as any).suffix ? (g as any).suffix : ''}` : '—'}
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveGameId(g.id); }}
                      className="bg-white hover:bg-brand-blue hover:text-white border border-slate-200 hover:border-brand-blue text-slate-700 text-[9px] font-bold px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1 shadow-sm group-hover:bg-brand-blue group-hover:text-white group-hover:border-brand-blue"
                      style={{ color: 'inherit' }}
                    >
                      <Play size={9} fill="currentColor" />
                      <span>Play</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center rounded-b-3xl">
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
            MAHFUZ'S ARCADE • {games.length} GAMES • PURE HTML5
          </span>
        </div>
      </div>
    </div>
  );
};
export default PlaygroundGamesHub;
