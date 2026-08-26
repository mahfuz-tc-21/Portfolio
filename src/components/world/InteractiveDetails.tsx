import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface NpcProps {
  position: [number, number, number];
  color: string;
  radius?: number;
  speed?: number;
}

// Simple walking NPC that moves in a circle
const LowPolyNpc: React.FC<NpcProps> = ({ position, color, radius = 2.0, speed = 0.8 }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime() * speed;
      // Circle walk loop
      meshRef.current.position.x = position[0] + Math.cos(t) * radius;
      meshRef.current.position.z = position[2] + Math.sin(t) * radius;
      
      // Face the walking direction (tangent of the circle)
      meshRef.current.rotation.y = -t + Math.PI / 2;
      
      // Bob up and down to simulate step steps
      const bob = Math.abs(Math.sin(t * 8)) * 0.05;
      meshRef.current.position.y = position[1] + bob;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Body */}
      <mesh castShadow position={[0, 0.45, 0]}>
        <capsuleGeometry args={[0.12, 0.4, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FFE4C4" roughness={0.7} />
      </mesh>
    </group>
  );
};

export const InteractiveDetails: React.FC = () => {
  return (
    <group>
      {/* NPCs Walking at CPI Campus courtyard */}
      <LowPolyNpc position={[-8, 0, 8]} color="#0EA5E9" radius={1.4} speed={0.9} />
      <LowPolyNpc position={[-9, 0, 7.5]} color="#EF4444" radius={1.1} speed={1.1} />

      {/* NPCs Gathering at Tech Cluder community dome */}
      <LowPolyNpc position={[12, 0, 0]} color="#10B981" radius={1.5} speed={0.7} />
      <LowPolyNpc position={[12.2, 0, 0.3]} color="#F59E0B" radius={1.0} speed={0.8} />

      {/* Bench details near roundabout */}
      <group position={[3.5, 0.1, 3.5]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh castShadow position={[0, 0.1, 0]}>
          <boxGeometry args={[1.2, 0.08, 0.3]} />
          <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[-0.5, 0.05, 0]}>
          <boxGeometry args={[0.08, 0.12, 0.25]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh castShadow position={[0.5, 0.05, 0]}>
          <boxGeometry args={[0.08, 0.12, 0.25]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>
      
      <group position={[-3.5, 0.1, -3.5]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh castShadow position={[0, 0.1, 0]}>
          <boxGeometry args={[1.2, 0.08, 0.3]} />
          <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[-0.5, 0.05, 0]}>
          <boxGeometry args={[0.08, 0.12, 0.25]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh castShadow position={[0.5, 0.05, 0]}>
          <boxGeometry args={[0.08, 0.12, 0.25]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>

      {/* Street lights along highways */}
      {[-12, -6, 6, 12].map((x, i) => (
        <group key={i} position={[x, 0, 1.1]}>
          {/* Light pole */}
          <mesh castShadow position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 2.4, 6]} />
            <meshStandardMaterial color="#64748B" />
          </mesh>
          {/* Light head */}
          <mesh position={[0.2, 2.4, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <boxGeometry args={[0.4, 0.08, 0.12]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Bulb */}
          <mesh position={[0.3, 2.36, 0]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
export default InteractiveDetails;
