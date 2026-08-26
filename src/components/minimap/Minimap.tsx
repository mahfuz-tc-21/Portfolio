import React from 'react';
import { useStore } from '../../store/useStore';
import { locationsData } from '../../data/portfolioData';
import { Compass, MapPin, X } from 'lucide-react';

export const Minimap: React.FC = () => {
  const { 
    minimapOpen, 
    toggleMinimap, 
    activeLocationId, 
    setActiveLocationId, 
    playerPos 
  } = useStore();

  if (!minimapOpen) return null;

  // Coordinate mapping function from 3D coords [x, 0, z] to SVG map percentage (width/height 200px)
  // 3D grid size is roughly x: -15 to 15, z: -15 to 15
  // Map center is (100, 100).
  const mapCoords = (x: number, z: number) => {
    const scale = 5.5; // multiplier
    const cx = 100 + x * scale;
    const cy = 100 + z * scale;
    return { cx, cy };
  };

  const playerMapPos = mapCoords(playerPos[0], playerPos[2]);

  return (
    <div className="fixed bottom-20 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-premium border border-slate-100 w-[280px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5 text-brand-blue font-bold text-xs uppercase tracking-wider">
            <Compass size={14} className="animate-spin-slow" />
            <span>City Minimap</span>
          </div>
          <button 
            onClick={() => toggleMinimap(false)}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition"
          >
            <X size={14} />
          </button>
        </div>

        {/* Circular Map Body */}
        <div className="relative w-[200px] h-[200px] bg-slate-50 border border-slate-150 rounded-full mx-auto overflow-hidden shadow-inner">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {/* Water border */}
            <circle cx="100" cy="100" r="98" fill="none" stroke="#BFDBFE" strokeWidth="4" />
            
            {/* Roads */}
            <line x1="100" y1="10" x2="100" y2="190" stroke="#CBD5E1" strokeWidth="8" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="#CBD5E1" strokeWidth="8" />
            <circle cx="100" cy="100" r="30" fill="none" stroke="#CBD5E1" strokeWidth="12" />
            <line x1="60" y1="60" x2="140" y2="140" stroke="#CBD5E1" strokeWidth="6" />
            <line x1="140" y1="60" x2="60" y2="140" stroke="#CBD5E1" strokeWidth="6" />

            {/* Fountain Ring */}
            <circle cx="100" cy="100" r="14" fill="#93C5FD" stroke="#E2E8F0" strokeWidth="2" />
            
            {/* Location Hotspots */}
            {locationsData.map((loc) => {
              const { cx, cy } = mapCoords(loc.coordinates[0], loc.coordinates[2]);
              const isActive = activeLocationId === loc.id;
              
              return (
                <g key={loc.id} className="cursor-pointer" onClick={() => setActiveLocationId(loc.id)}>
                  {/* Outer Pulsing highlight */}
                  {isActive && (
                    <circle cx={cx} cy={cy} r="12" fill={loc.color} opacity="0.3" className="animate-ping" />
                  )}
                  {/* Pin Dot */}
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={isActive ? 6 : 5} 
                    fill={isActive ? '#FFFFFF' : loc.color} 
                    stroke={isActive ? loc.color : '#FFFFFF'} 
                    strokeWidth="2" 
                  />
                </g>
              );
            })}

            {/* Active Player position dot */}
            <circle 
              cx={playerMapPos.cx} 
              cy={playerMapPos.cy} 
              r="4.5" 
              fill="#EF4444" 
              stroke="#FFFFFF" 
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Legend / Quick Access */}
        <div className="grid grid-cols-2 gap-1.5 mt-3 text-[10px] text-slate-500 font-medium max-h-[110px] overflow-y-auto pr-1">
          {locationsData.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setActiveLocationId(loc.id)}
              className={`flex items-center gap-1 p-1 rounded-md text-left transition ${
                activeLocationId === loc.id 
                  ? 'bg-brand-blue-light text-brand-blue font-semibold' 
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <MapPin size={10} style={{ color: loc.color }} />
              <span className="truncate">{loc.district}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Minimap;
