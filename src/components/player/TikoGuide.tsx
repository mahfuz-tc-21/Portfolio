import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import { Sparkles, Navigation2, X } from 'lucide-react';

export const TikoGuide: React.FC = () => {
  const { setActiveLocationId } = useStore();
  const [talkOpen, setTalkOpen] = useState(false);

  const handleTikoClick = (e: any) => {
    e.stopPropagation();
    setTalkOpen(!talkOpen);
  };

  const handleGuideSelect = (locId: string) => {
    setActiveLocationId(locId);
    setTalkOpen(false);
  };

  return (
    <group position={[2.5, 0.05, 2.5]}>
      {/* Tiko Base Pod */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.45, 0.1, 8]} />
        <meshStandardMaterial color="#64748B" roughness={0.7} />
      </mesh>

      {/* Floating Robot body */}
      <group position={[0, 0.6, 0]}>
        {/* Main Body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.18, 0.45, 8]} />
          <meshStandardMaterial color="#8B5CF6" metalness={0.6} roughness={0.2} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#A78BFA" metalness={0.6} roughness={0.2} />
        </mesh>

        {/* Visor screen */}
        <mesh position={[0, 0.38, 0.14]}>
          <boxGeometry args={[0.24, 0.08, 0.08]} />
          <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.8} roughness={0.1} />
        </mesh>

        {/* Little antenna */}
        <mesh position={[0, 0.58, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.25, 4]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <sphereGeometry args={[0.04, 4, 4]} />
          <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* In-world Click Target Hover indicator */}
      <Html position={[0, 1.4, 0]} center distanceFactor={8}>
        <button 
          onClick={handleTikoClick}
          className="bg-purple-600 hover:bg-purple-700 text-white font-black text-[7px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-premium transition border border-purple-400 flex items-center gap-1 cursor-pointer pointer-events-auto"
        >
          <Sparkles size={8} />
          <span>Talk to Tiko</span>
        </button>
      </Html>

      {/* Speach bubble UI */}
      {talkOpen && (
        <Html position={[0, 1.6, 0]} center distanceFactor={7} className="z-50">
          <div className="bg-slate-900 border border-purple-500/30 text-white p-3 rounded-2xl w-[190px] shadow-premium select-none font-sans relative pointer-events-auto">
            {/* Speach tail */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-purple-500/30 rotate-45" />

            <div className="flex items-center justify-between text-[7px] font-black uppercase tracking-wider text-purple-400 border-b border-slate-800 pb-1.5 mb-2">
              <span className="flex items-center gap-1">🤖 Tiko (City Guide)</span>
              <button 
                onClick={() => setTalkOpen(false)}
                className="hover:bg-slate-800 p-0.5 rounded text-slate-500 hover:text-white transition"
              >
                <X size={8} />
              </button>
            </div>

            <p className="text-[9px] text-slate-300 leading-normal font-medium mb-3">
              Hello! I am Tiko, your virtual assistant. Where would you like to travel today?
            </p>

            <div className="space-y-1">
              <button
                onClick={() => handleGuideSelect('ai-lab')}
                className="w-full text-left bg-slate-800 hover:bg-purple-950 border border-slate-700/50 hover:border-purple-500/50 text-white text-[8px] font-bold py-1 px-2 rounded-lg transition flex items-center justify-between"
              >
                <span>Where is the AI Lab?</span>
                <Navigation2 size={8} className="text-purple-400" />
              </button>

              <button
                onClick={() => handleGuideSelect('project-avenue')}
                className="w-full text-left bg-slate-800 hover:bg-purple-950 border border-slate-700/50 hover:border-purple-500/50 text-white text-[8px] font-bold py-1 px-2 rounded-lg transition flex items-center justify-between"
              >
                <span>Show me software projects</span>
                <Navigation2 size={8} className="text-purple-400" />
              </button>

              <button
                onClick={() => handleGuideSelect('playground')}
                className="w-full text-left bg-slate-800 hover:bg-purple-950 border border-slate-700/50 hover:border-purple-500/50 text-white text-[8px] font-bold py-1 px-2 rounded-lg transition flex items-center justify-between"
              >
                <span>Take me to the Playground!</span>
                <Navigation2 size={8} className="text-purple-400" />
              </button>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};
export default TikoGuide;
