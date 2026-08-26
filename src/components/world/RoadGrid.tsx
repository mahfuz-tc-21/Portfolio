import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface VehicleProps {
  startPos: [number, number, number];
  endPos: [number, number, number];
  speed: number;
  color: string;
  horizontal?: boolean;
}

const LowPolyVehicle: React.FC<VehicleProps> = ({ startPos, endPos, speed, color, horizontal = false }) => {
  const meshRef = useRef<THREE.Group>(null);
  const directionRef = useRef(1); // 1 = forwards, -1 = backwards
  const progressRef = useRef(Math.random()); // start at random progress

  useFrame((_, delta) => {
    if (meshRef.current) {
      progressRef.current += speed * 0.05 * directionRef.current * delta * 60;
      
      if (progressRef.current >= 1) {
        progressRef.current = 1;
        directionRef.current = -1;
        // Turn around
        meshRef.current.rotation.y = horizontal ? Math.PI : Math.PI / 2;
      } else if (progressRef.current <= 0) {
        progressRef.current = 0;
        directionRef.current = 1;
        meshRef.current.rotation.y = horizontal ? 0 : -Math.PI / 2;
      }

      // Interpolate position
      meshRef.current.position.x = startPos[0] + (endPos[0] - startPos[0]) * progressRef.current;
      meshRef.current.position.z = startPos[2] + (endPos[2] - startPos[2]) * progressRef.current;
    }
  });

  return (
    <group ref={meshRef} position={startPos}>
      {/* Car body */}
      <mesh castShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[0.7, 0.25, 0.45]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Car roof */}
      <mesh castShadow position={[-0.05, 0.35, 0]}>
        <boxGeometry args={[0.35, 0.2, 0.38]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      {/* Wheels */}
      <mesh position={[-0.2, 0.08, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 8]} />
        <meshStandardMaterial color="#1E293B" roughness={0.9} />
      </mesh>
      <mesh position={[0.2, 0.08, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 8]} />
        <meshStandardMaterial color="#1E293B" roughness={0.9} />
      </mesh>
      <mesh position={[-0.2, 0.08, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 8]} />
        <meshStandardMaterial color="#1E293B" roughness={0.9} />
      </mesh>
      <mesh position={[0.2, 0.08, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 8]} />
        <meshStandardMaterial color="#1E293B" roughness={0.9} />
      </mesh>
    </group>
  );
};

export const RoadGrid: React.FC = () => {
  return (
    <group>
      {/* MAIN ROAD GRID (Dark slate gray plates) */}
      
      {/* North-South Central Avenue */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow>
        <planeGeometry args={[1.6, 32]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>
      
      {/* East-West Highway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[32, 1.6]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>

      {/* Ring Road around center */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]} receiveShadow>
        <ringGeometry args={[4, 5.4, 24]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>
      
      {/* Diagonal branch to AI Lab and CPI Campus */}
      <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 4]} position={[4, 0.0015, -4]} receiveShadow>
        <planeGeometry args={[1.2, 12]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[-4, 0.0015, 4]} receiveShadow>
        <planeGeometry args={[1.2, 12]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>

      {/* ROAD MARKINGS (White/Yellow overlays) */}
      {/* Roundabout center garden block */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.5, 2.5, 0.1, 24]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <cylinderGeometry args={[2.3, 2.3, 0.05, 24]} />
        <meshStandardMaterial color="#A7F3D0" roughness={0.8} />
      </mesh>
      
      {/* Fountain in center garden */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.4, 8]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#60A5FA" roughness={0.2} emissive="#3B82F6" emissiveIntensity={0.2} />
      </mesh>

      {/* Crosswalk Zebra lines (white planes) */}
      {/* North */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 5.8]} receiveShadow>
        <planeGeometry args={[1.6, 0.8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>
      {/* South */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -5.8]} receiveShadow>
        <planeGeometry args={[1.6, 0.8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>
      {/* East */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.8, 0.005, 0]} receiveShadow>
        <planeGeometry args={[0.8, 1.6]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>
      {/* West */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.8, 0.005, 0]} receiveShadow>
        <planeGeometry args={[0.8, 1.6]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>

      {/* Dynamic Animated Vehicles */}
      {/* N-S Highway Bus */}
      <LowPolyVehicle startPos={[0, 0.01, -12]} endPos={[0, 0.01, 10]} speed={0.12} color="#EF4444" />
      {/* E-W Highway Car 1 */}
      <LowPolyVehicle startPos={[-12, 0.01, 0]} endPos={[12, 0.01, 0]} speed={0.18} color="#3B82F6" horizontal />
      {/* Diagonal Lane Car 2 */}
      <LowPolyVehicle startPos={[2, 0.01, -2]} endPos={[9, 0.01, -9]} speed={0.15} color="#F59E0B" />
    </group>
  );
};
