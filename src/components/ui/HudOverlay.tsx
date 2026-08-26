import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { locationsData } from '../../data/portfolioData';
import { audioSynth } from '../../lib/audioSynth';
import { Volume2, VolumeX, Menu, Map, CheckSquare, Square, X, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';

export const HudOverlay: React.FC = () => {
  const {
    activeLocationId,
    setActiveLocationId,
    soundOn,
    toggleSound,
    dayTime,
    setDayTime,
    minimapOpen,
    toggleMinimap,
    menuOpen,
    toggleMenu,
    quests,
    photoModeActive,
    setPhotoModeActive,
    activeGameId
  } = useStore();

  // When a game modal is open, hide most HUD chrome so games have a clean UI
  const isGameActive = !!activeGameId;

  // Local HUD panel visibility states
  const [brandOpen, setBrandOpen] = useState(true);
  const [questOpen, setQuestOpen] = useState(true);

  // Dynamic time ticks
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setDayTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(interval);
  }, [setDayTime]);

  // Handle ambient audio synth play/stop on sound toggle
  useEffect(() => {
    if (soundOn) {
      audioSynth.start();
    } else {
      audioSynth.stop();
    }
  }, [soundOn]);

  // Celebrate when all locations are visited
  useEffect(() => {
    const isCompleted = Object.values(quests.visitedLocations).every(v => v);
    if (isCompleted) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  }, [quests.visitedLocations]);

  if (photoModeActive) {
    return (
      <div className="absolute inset-0 pointer-events-none z-40 flex flex-col justify-between p-6 select-none">
        {/* Photo Mode corner guides */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/50" />
        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/50" />
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/50" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/50" />

        <div className="mx-auto bg-slate-900/80 backdrop-blur-xs border border-slate-700/30 text-white rounded-full py-1.5 px-4 shadow-premium flex items-center gap-2 pointer-events-auto text-[9px] font-black tracking-widest uppercase">
          📸 Photo Mode
        </div>

        <button
          onClick={() => setPhotoModeActive(false)}
          className="mx-auto mb-4 bg-brand-blue hover:bg-brand-blue-dark text-white text-[10px] font-bold py-2 px-6 rounded-xl shadow-premium pointer-events-auto transition cursor-pointer"
        >
          Exit Photo Mode
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none">
      
      {/* 1. TOP-LEFT BRAND CARD */}
      {brandOpen ? (
        <div className="absolute top-6 left-6 pointer-events-auto bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl py-2 px-3.5 shadow-soft flex items-center gap-3 animate-in fade-in slide-in-from-left-3 duration-200">
          <div>
            <h1 className="text-xs font-black tracking-widest text-slate-800 uppercase flex items-center gap-1.5 font-display leading-tight">
              <span className="w-2 h-2 rounded-full bg-brand-blue block animate-soft-pulse" />
              <span>Mahfuz Uddin</span>
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              3D Portfolio World
            </p>
          </div>
          <button
            onClick={() => setBrandOpen(false)}
            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition"
            title="Collapse logo"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setBrandOpen(true)}
          className="absolute top-6 left-6 pointer-events-auto w-9 h-9 bg-white/95 backdrop-blur-sm border border-slate-100 rounded-full flex items-center justify-center shadow-soft hover:shadow-premium transition text-brand-blue hover:text-brand-blue-dark font-bold text-xs"
          title="Show brand info"
        >
          M
        </button>
      )}

      {/* 2. TOP-RIGHT HUD CAPSULE & CONTROLS */}
      <div className="absolute top-6 right-6 flex items-center gap-3 pointer-events-auto">
        {/* Day / Time Capsule */}
        <div className="bg-white/95 backdrop-blur-sm border border-slate-100 rounded-full py-1.5 px-4 shadow-soft sm:flex hidden items-center gap-2 text-xs font-bold text-slate-700">
          <span className="text-yellow-500 font-black">☀</span>
          <span>Day</span>
          <span className="text-slate-300">|</span>
          <span className="font-mono text-[11px]">{dayTime}</span>
        </div>

        {/* Audio Synth Toggle */}
        <button
          onClick={toggleSound}
          className={`w-9 h-9 rounded-full flex items-center justify-center border shadow-soft transition ${
            soundOn 
              ? 'bg-brand-blue border-brand-blue text-white hover:bg-brand-blue-dark' 
              : 'bg-white/95 border-slate-100 text-slate-500 hover:bg-slate-50'
          }`}
          title="Toggle ambient audio"
        >
          {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Photo Mode Button */}
        <button
          onClick={() => setPhotoModeActive(true)}
          className="w-9 h-9 rounded-full flex items-center justify-center border shadow-soft transition bg-white/95 border-slate-100 text-slate-500 hover:bg-slate-50 cursor-pointer"
          title="Trigger Photo Mode"
        >
          <Camera size={16} />
        </button>

        {/* Menu Toggle */}
        <button
          onClick={() => toggleMenu(!menuOpen)}
          className={`w-9 h-9 rounded-full flex items-center justify-center border shadow-soft transition ${
            menuOpen 
              ? 'bg-slate-800 border-slate-800 text-white' 
              : 'bg-white/95 border-slate-100 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Menu size={16} />
        </button>
      </div>

      {/* 3. MENU OVERLAY (Hamburger slider) */}
      {menuOpen && (
        <div className="absolute top-20 right-6 pointer-events-auto bg-white border border-slate-100 rounded-2xl p-4 shadow-premium w-60 animate-in fade-in slide-in-from-top-3 duration-200">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
            About the Builder
          </h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
            Mahfuz Uddin is an AI Product Builder and Full-Stack Developer studying Computer Science &amp; Technology at Chattogram Polytechnic Institute.
          </p>
          <div className="border-t border-slate-100 pt-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Exploration guide
            </h4>
            <div className="space-y-1.5 text-[10px] font-semibold text-slate-500">
              <div>🖱 Drag mouse to rotate camera</div>
              <div>📜 Scroll wheel to zoom</div>
              <div>👉 Click locations to inspect details</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. BOTTOM-LEFT QUEST CHECKLIST (hidden when game is active) */}
      {!isGameActive && questOpen && (
        <div className="absolute bottom-6 left-6 pointer-events-auto bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 shadow-soft max-w-[280px] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between text-brand-blue font-bold text-xs uppercase tracking-wider mb-2.5">
            <div className="flex items-center gap-1.5">
              <CheckSquare size={13} />
              <span>Exploration Quest</span>
            </div>
            <button
              onClick={() => setQuestOpen(false)}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition"
              title="Hide quests"
            >
              <X size={12} />
            </button>
          </div>
          <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
            {locationsData.map((loc) => {
              const visited = quests.visitedLocations[loc.id];
              return (
                <button
                  key={loc.id}
                  onClick={() => setActiveLocationId(loc.id)}
                  className="flex items-center gap-2 text-left w-full text-[10px] font-medium text-slate-600 hover:text-brand-blue transition"
                >
                  {visited ? (
                    <CheckSquare size={12} className="text-green-500 flex-shrink-0" />
                  ) : (
                    <Square size={12} className="text-slate-300 flex-shrink-0" />
                  )}
                  <span className={visited ? 'line-through text-slate-400 font-medium' : 'font-bold'}>
                    Visit {loc.district}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      {!isGameActive && !questOpen && (
        <button
          onClick={() => setQuestOpen(true)}
          className="absolute bottom-6 left-6 pointer-events-auto bg-white/95 backdrop-blur-sm border border-slate-100 rounded-full p-3 shadow-soft hover:shadow-premium text-brand-blue hover:text-brand-blue-dark transition flex items-center gap-1.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-200"
          title="Show quests"
        >
          <CheckSquare size={16} />
          <span className="sm:inline hidden">Quests</span>
        </button>
      )}

      {/* 5. BOTTOM-CENTER QUICK ACCESS LOCATION BAR (hidden during games) */}
      {!isGameActive && (
        <div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-auto bg-white/95 backdrop-blur-sm border border-slate-100 rounded-full py-2 px-3.5 shadow-premium max-w-[calc(100vw-160px)] sm:max-w-max overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {locationsData.map((loc) => {
            const isActive = activeLocationId === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => setActiveLocationId(isActive ? null : loc.id)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition whitespace-nowrap ${
                  isActive 
                    ? 'bg-brand-blue text-white shadow-soft' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {loc.shortLabel}
              </button>
            );
          })}
        </div>
      )}

      {/* 6. BOTTOM-RIGHT MAP BUTTON (hidden during games) */}
      {!isGameActive && (
        <div className="absolute bottom-6 right-6 pointer-events-auto">
          <button
            onClick={() => toggleMinimap(!minimapOpen)}
            className={`w-11 h-11 rounded-full flex items-center justify-center border shadow-premium transition ${
              minimapOpen 
                ? 'bg-brand-blue border-brand-blue text-white' 
                : 'bg-white/95 border-slate-100 text-slate-600 hover:bg-slate-50'
            }`}
            title="Open city map"
          >
            <Map size={18} />
          </button>
        </div>
      )}

    </div>
  );
};
export default HudOverlay;
