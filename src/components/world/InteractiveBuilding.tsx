import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import { MousePointerClick } from 'lucide-react';

interface InteractiveBuildingProps {
  id: string;
  name: string;
  subtitle: string;
  position: [number, number, number];
  children: React.ReactNode;
  labelOffset?: number;
}

export const InteractiveBuilding: React.FC<InteractiveBuildingProps> = ({
  id,
  name,
  subtitle,
  position,
  children,
  labelOffset = 4.5
}) => {
  const { 
    activeLocationId, 
    hoveredLocationId, 
    setActiveLocationId, 
    setHoveredLocationId,
    activeGameId
  } = useStore();

  const [hovered, setHovered] = useState(false);

  const isHovered = hoveredLocationId === id || hovered;
  const isActive = activeLocationId === id;

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    setHovered(true);
    setHoveredLocationId(id);
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
    setHovered(false);
    if (hoveredLocationId === id) {
      setHoveredLocationId(null);
    }
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    setActiveLocationId(id);
  };

  return (
    <group 
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Visual geometry container */}
      <group 
        scale={isHovered ? 1.03 : 1}
        position={[0, 0, 0]}
      >
        {children}
      </group>

      {/* Floating 3D/HTML Location Label - hide when any modal or game is open */}
      {!activeLocationId && !activeGameId && (
        <Html
          position={[0, labelOffset, 0]}
          center
          distanceFactor={12}
          style={{
            transition: 'all 0.3s ease',
            pointerEvents: 'none',
            opacity: isHovered || isActive ? 1 : 0.65,
            transform: `scale(${isHovered || isActive ? 1.05 : 0.95})`,
          }}
        >
          <div className="flex flex-col items-center select-none font-sans min-w-[160px]">
            {/* Pin pointer */}
            <div className="w-3 h-3 bg-brand-blue rounded-full mb-1 border-2 border-white shadow-soft animate-bounce" />
            
            {/* Text Box */}
            <div className="bg-white/95 backdrop-blur-sm border border-slate-100 rounded-lg p-2.5 shadow-premium text-center pointer-events-auto cursor-pointer select-none">
              <h3 className="text-xs font-bold text-slate-800 tracking-wider whitespace-nowrap">
                {name}
              </h3>
              <p className="text-[9px] text-slate-400 font-medium whitespace-nowrap mt-0.5">
                {subtitle}
              </p>
              
              {isHovered && !isActive && (
                <div className="flex items-center justify-center gap-1 mt-1 text-[8px] text-brand-blue font-bold animate-pulse">
                  <MousePointerClick size={8} />
                  <span>Click to Explore</span>
                </div>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};
