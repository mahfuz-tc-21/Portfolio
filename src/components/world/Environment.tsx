import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Simple low-poly tree component
export const LowPolyTree: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1 }) => {
  const trunkHeight = 1.2 * scale;
  const leavesRadius = 0.8 * scale;
  
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, trunkHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15 * scale, 0.25 * scale, trunkHeight, 5]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.9} flatShading />
      </mesh>
      {/* Lower Leaves */}
      <mesh position={[0, trunkHeight + 0.1 * scale, 0]} castShadow>
        <dodecahedronGeometry args={[leavesRadius, 1]} />
        <meshStandardMaterial color="#2E8B57" roughness={0.8} flatShading />
      </mesh>
      {/* Upper Leaves */}
      <mesh position={[0, trunkHeight + 0.6 * scale, 0]} castShadow>
        <dodecahedronGeometry args={[leavesRadius * 0.75, 1]} />
        <meshStandardMaterial color="#3CB371" roughness={0.8} flatShading />
      </mesh>
    </group>
  );
};

// Animated cloud component
export const Cloud: React.FC<{ position: [number, number, number]; speed?: number }> = ({ position, speed = 0.1 }) => {
  const cloudRef = useRef<THREE.Group>(null);
  const cloudSpeed = useRef(speed * (0.5 + Math.random()));
  
  useFrame(() => {
    if (cloudRef.current) {
      cloudRef.current.position.x += cloudSpeed.current * 0.05;
      if (cloudRef.current.position.x > 30) {
        cloudRef.current.position.x = -30;
      }
    }
  });

  return (
    <group ref={cloudRef} position={position}>
      <mesh castShadow>
        <dodecahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} opacity={0.85} transparent flatShading />
      </mesh>
      <mesh position={[1.2, -0.2, 0.4]}>
        <dodecahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} opacity={0.85} transparent flatShading />
      </mesh>
      <mesh position={[-1.2, -0.1, -0.2]}>
        <dodecahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} opacity={0.85} transparent flatShading />
      </mesh>
    </group>
  );
};

export const Environment: React.FC = () => {
  const waterRef = useRef<THREE.Mesh>(null);
  
  // Simple water wave animation
  useFrame((state) => {
    if (waterRef.current) {
      const time = state.clock.getElapsedTime();
      waterRef.current.position.y = -0.5 + Math.sin(time * 1.5) * 0.04;
    }
  });

  // Generative distribution of trees outside roads
  const trees = [
    // City Center surroundings
    { pos: [3.5, 0, -3.5] as [number, number, number], scale: 0.9 },
    { pos: [-3.5, 0, 3.5] as [number, number, number], scale: 1.1 },
    { pos: [-4, 0, -3] as [number, number, number], scale: 1.0 },
    // AI Lab park area
    { pos: [6, 0, -11] as [number, number, number], scale: 1.2 },
    { pos: [11, 0, -11] as [number, number, number], scale: 0.8 },
    { pos: [9, 0, -5] as [number, number, number], scale: 1.0 },
    // CPI Campus surroundings
    { pos: [-11, 0, 11] as [number, number, number], scale: 1.3 },
    { pos: [-6, 0, 11] as [number, number, number], scale: 1.0 },
    { pos: [-11, 0, 5] as [number, number, number], scale: 0.9 },
    // Tech Cluder park
    { pos: [11, 0, 3] as [number, number, number], scale: 1.1 },
    { pos: [13, 0, -3] as [number, number, number], scale: 1.2 },
    // Exit coast
    { pos: [-3, 0, 13] as [number, number, number], scale: 0.9 },
    { pos: [3, 0, 13] as [number, number, number], scale: 1.0 },
  ];

  return (
    <>
      {/* Sky backdrop */}
      <color attach="background" args={['#F1F5F9']} />
      
      {/* Soft Daytime Fog */}
      <fog attach="fog" args={['#F1F5F9', 20, 55]} />

      {/* Lights Setup */}
      <ambientLight intensity={0.9} color="#FFFFFF" />
      <directionalLight
        castShadow
        position={[25, 35, 10]}
        intensity={1.2}
        color="#F8FAFC"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={80}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0005}
      />

      {/* Grass Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.95} />
      </mesh>
      
      {/* Outer Green Grass areas */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#D1FAE5" roughness={0.9} />
      </mesh>

      {/* Blue Ocean / Water edges at the border of the city */}
      <mesh
        ref={waterRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#93C5FD" roughness={0.3} metalness={0.1} opacity={0.9} transparent />
      </mesh>

      {/* Floating Animated Clouds */}
      <Cloud position={[-15, 12, -15]} speed={0.08} />
      <Cloud position={[10, 15, -8]} speed={0.12} />
      <Cloud position={[-8, 14, 12]} speed={0.06} />
      <Cloud position={[18, 13, 10]} speed={0.1} />

      {/* Low-Poly Trees */}
      {trees.map((tree, i) => (
        <LowPolyTree key={i} position={tree.pos} scale={tree.scale} />
      ))}
    </>
  );
};
