import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useStore } from './store/useStore';

// 3D Components
import { Environment } from './components/world/Environment';
import { RoadGrid } from './components/world/RoadGrid';
import { InteractiveBuilding } from './components/world/InteractiveBuilding';
import { CameraFocusController } from './components/world/CameraFocusController';
import { PlayerCharacter } from './components/player/PlayerCharacter';
import { InteractiveDetails } from './components/world/InteractiveDetails';
import {
  CityCenterBuilding,
  AiLabBuilding,
  DeveloperHqBuilding,
  ProjectAvenueBuilding,
  CpiCampusBuilding,
  TechCluderBuilding,
  GithubCenterBuilding,
  CityExitBuilding
} from './components/world/Buildings';

// UI HUD Components
import { HudOverlay } from './components/ui/HudOverlay';
import { InfoPanel } from './components/panels/InfoPanel';
import { Minimap } from './components/minimap/Minimap';
import { FallbackPortfolio } from './components/ui/FallbackPortfolio';
import { Loader, Play, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [entered, setEntered] = useState<boolean>(false);
  const { setPlayerTarget } = useStore();

  // 1. Detect WebGL support
  useEffect(() => {
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch (e) {
        return false;
      }
    };
    setHasWebGL(checkWebGL());
    
    // Simulate loading asset prep
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!hasWebGL) {
    return <FallbackPortfolio />;
  }

  // Ground pointer click-vs-drag detectors
  const pointerDownPos = useRef({ x: 0, y: 0 });

  const handleGroundPointerDown = (e: any) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleGroundPointerUp = (e: any) => {
    e.stopPropagation();
    const dx = e.clientX - pointerDownPos.current.x;
    const dy = e.clientY - pointerDownPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Set target only if it was a quick click, not a camera drag
    if (dist < 5 && e.point) {
      setPlayerTarget([e.point.x, 0, e.point.z]);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-100 select-none">
      
      {/* A. LOADING SCREEN */}
      {loading && (
        <div className="absolute inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center text-white select-none">
          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-bold tracking-widest text-brand-blue animate-pulse">
              MAHFUZ'S CITY
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Synthesizing 3D Portfolio World...
            </p>
            <div className="flex justify-center pt-4">
              <Loader className="animate-spin text-brand-blue" size={24} />
            </div>
          </div>
        </div>
      )}

      {/* B. WELCOME ENTER SPLASH SCREEN */}
      {!loading && !entered && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-6">
          <div className="max-w-md space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-brand-blue-light text-brand-blue rounded-3xl flex items-center justify-center shadow-soft animate-soft-pulse">
                <Sparkles size={32} />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-800 tracking-wide font-display">
                Welcome to Mahfuz's City
              </h1>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                An Immersive 3D Portfolio World
              </p>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Explore my software engineering workspace, AI models, academic milestones, and open-source contributions. Move the character using ground clicks or drag the mouse to look around.
            </p>
            
            <div className="pt-2">
              <button
                onClick={() => setEntered(true)}
                className="bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-bold py-3 px-8 rounded-full shadow-premium hover:shadow-soft transition flex items-center gap-1.5 mx-auto"
              >
                <Play size={14} fill="currentColor" />
                <span>Enter 3D City</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* C. THREE.JS 3D CANVAS */}
      {entered && (
        <Suspense fallback={null}>
          <Canvas
            shadows
            camera={{ position: [0, 16, 22], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, preserveDrawingBuffer: true }}
          >
            {/* Environment lighting & scenery */}
            <Environment />

            {/* Cinematic intro and focus controller */}
            <CameraFocusController />

            {/* Click-to-Move Player Character */}
            <PlayerCharacter />

            {/* Roads & Roundabout */}
            <RoadGrid />

            {/* Custom interactive props & NPCs */}
            <InteractiveDetails />

            {/* Ground helper grid for raycasting clicks */}
            <mesh 
              rotation={[-Math.PI / 2, 0, 0]} 
              position={[0, 0, 0]} 
              onPointerDown={handleGroundPointerDown}
              onPointerUp={handleGroundPointerUp}
              receiveShadow
            >
              <planeGeometry args={[100, 100]} />
              {/* Invisible mesh standard material to capture raycasts but let grass show */}
              <meshStandardMaterial color="#D1FAE5" opacity={0} transparent roughness={0.9} />
            </mesh>

            {/* LANDMARK BUILDINGS */}
            
            {/* 1. City Center (Mahfuz Uddin HQ) */}
            <InteractiveBuilding
              id="city-center"
              name="MAHFUZ UDDIN HQ"
              subtitle="My Digital Headquarters"
              position={[0, 0.05, 0]}
              labelOffset={5.4}
            >
              <CityCenterBuilding />
            </InteractiveBuilding>

            {/* 2. AI / ML Lab */}
            <InteractiveBuilding
              id="ai-lab"
              name="AI / ML LAB"
              subtitle="AI & Machine Learning Research"
              position={[8, 0.05, -8]}
              labelOffset={3.2}
            >
              <AiLabBuilding />
            </InteractiveBuilding>

            {/* 3. Developer HQ */}
            <InteractiveBuilding
              id="developer-hq"
              name="DEVELOPER HQ"
              subtitle="Skills, Stack & Workspace"
              position={[6, 0.05, 8]}
              labelOffset={2.8}
            >
              <DeveloperHqBuilding />
            </InteractiveBuilding>

            {/* 4. Project Avenue */}
            <InteractiveBuilding
              id="project-avenue"
              name="PROJECT AVENUE"
              subtitle="Things I've Built"
              position={[-10, 0.05, -6]}
              labelOffset={2.8}
            >
              <ProjectAvenueBuilding />
            </InteractiveBuilding>

            {/* 5. CPI Campus */}
            <InteractiveBuilding
              id="cpi-campus"
              name="CPI CAMPUS"
              subtitle="My Education Journey"
              position={[-8, 0.05, 8]}
              labelOffset={2.2}
            >
              <CpiCampusBuilding />
            </InteractiveBuilding>

            {/* 6. Tech Cluder */}
            <InteractiveBuilding
              id="tech-cluder"
              name="TECH CLUDER"
              subtitle="Community & Initiatives"
              position={[12, 0.05, 0]}
              labelOffset={2.6}
            >
              <TechCluderBuilding />
            </InteractiveBuilding>

            {/* 7. GitHub Center */}
            <InteractiveBuilding
              id="github-center"
              name="GITHUB CENTER"
              subtitle="Open Source & Contributions"
              position={[-12, 0.05, 2]}
              labelOffset={2.4}
            >
              <GithubCenterBuilding />
            </InteractiveBuilding>

            {/* 8. City Exit */}
            <InteractiveBuilding
              id="city-exit"
              name="CITY EXIT"
              subtitle="Let's Build Together"
              position={[0, 0.05, 14]}
              labelOffset={3.4}
            >
              <CityExitBuilding />
            </InteractiveBuilding>

            {/* Orbit controls active at all times */}
            <OrbitControls
              makeDefault
              enableDamping
              dampingFactor={0.05}
              maxPolarAngle={Math.PI / 2.3} // limit tilting underground
              minDistance={3}
              maxDistance={60}
            />
          </Canvas>
        </Suspense>
      )}

      {/* D. HUD OVERLAYS & SLIDERS */}
      {entered && (
        <>
          <HudOverlay />
          <InfoPanel />
          <Minimap />
        </>
      )}

    </div>
  );
};
export default App;
