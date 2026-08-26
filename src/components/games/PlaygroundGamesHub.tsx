import React from 'react';
import { useStore } from '../../store/useStore';
import { Trophy, Play, X, Terminal, Cpu, Brain, Layers, GitFork } from 'lucide-react';

export const PlaygroundGamesHub: React.FC = () => {
  const { 
    activeLocationId, 
    setActiveLocationId, 
    activeGameId, 
    setActiveGameId, 
    gameScores 
  } = useStore();

  if (activeLocationId !== 'playground' || activeGameId !== null) return null;

  const games = [
    {
      id: 'debug-city',
      title: 'Debug the City',
      description: 'Fix broken servers, API nodes, and data streams around the city grid.',
      icon: <Terminal className="text-blue-500" size={20} />,
      highScoreLabel: 'Bugs Fixed',
      scoreKey: 'debugCity',
      maxScore: 5
    },
    {
      id: 'ai-challenge',
      title: 'AI Lab Challenge',
      description: 'Rearrange and connect building blocks to construct correct AI/ML pipelines.',
      icon: <Brain className="text-purple-500" size={20} />,
      highScoreLabel: 'Completed Levels',
      scoreKey: 'aiChallenge',
      maxScore: 3
    },
    {
      id: 'city-memory',
      title: 'City Memory Sequence',
      description: 'Remember and tap the sequence of highlighted city locations.',
      icon: <Layers className="text-emerald-500" size={20} />,
      highScoreLabel: 'Max Round',
      scoreKey: 'cityMemory',
      maxScore: 10
    },
    {
      id: 'city-maze',
      title: 'City Grid Maze',
      description: 'Find your way through a 3D grid layout maze to reach the AI Lab.',
      icon: <GitFork className="text-cyan-500" size={20} />,
      highScoreLabel: 'Shortest Time',
      scoreKey: 'cityMaze',
      suffix: 's'
    },
    {
      id: 'code-runner',
      title: 'Code Runner',
      description: 'Dodge bugs, variables, and compiler errors to reach production.',
      icon: <Cpu className="text-pink-500" size={20} />,
      highScoreLabel: 'High Score',
      scoreKey: 'codeRunner'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-premium w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-blue text-white flex items-center justify-center shadow-soft">
              <Trophy size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">Arcade Zone</h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Take a break and play something</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveLocationId(null)}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-4">
            {games.map((g) => {
              const bestScore = gameScores[g.scoreKey] || 0;
              return (
                <div 
                  key={g.id}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:border-brand-blue/30 transition shadow-sm hover:shadow-soft group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                        {g.icon}
                      </div>
                      <h3 className="text-xs font-bold text-slate-800 tracking-wide">{g.title}</h3>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{g.description}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="text-[9px] font-bold text-slate-400">
                      🏆 {g.highScoreLabel}: <span className="text-slate-600">{bestScore}{g.maxScore ? `/${g.maxScore}` : ''}{bestScore && g.suffix ? g.suffix : ''}</span>
                    </div>

                    <button
                      onClick={() => setActiveGameId(g.id)}
                      className="bg-brand-blue hover:bg-brand-blue-dark text-white text-[9px] font-bold px-3 py-1.5 rounded-lg shadow-soft group-hover:shadow transition flex items-center gap-1 cursor-pointer"
                    >
                      <Play size={10} fill="currentColor" />
                      <span>Play</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer branding */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center rounded-b-2xl">
          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
            MAHFUZ'S ARCADE • PURE HTML5 GENERATION • HAVE FUN
          </span>
        </div>
      </div>
    </div>
  );
};
export default PlaygroundGamesHub;
