import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// 1. City Center Tower (Mahfuz Uddin HQ)
export const CityCenterBuilding: React.FC = () => {
  return (
    <group>
      {/* Platform */}
      <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
        <cylinderGeometry args={[2.0, 2.2, 0.2, 8]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.7} />
      </mesh>
      
      {/* Tower Base */}
      <mesh castShadow receiveShadow position={[0, 1.1, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 1.8, 8]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.4} />
      </mesh>
      
      {/* Tower Middle Section */}
      <mesh castShadow position={[0, 2.7, 0]}>
        <cylinderGeometry args={[0.9, 1.1, 1.5, 8]} />
        <meshStandardMaterial color="#F1F5F9" roughness={0.4} />
      </mesh>
      
      {/* Blue Glass Core Columns (Stylized vertical windows) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4;
        const radius = 1.05;
        return (
          <mesh 
            key={i} 
            position={[Math.cos(angle) * radius, 2.0, Math.sin(angle) * radius]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[0.15, 3.2, 0.08]} />
            <meshStandardMaterial color="#3B82F6" roughness={0.2} metalness={0.8} />
          </mesh>
        );
      })}

      {/* Top Roof Deck */}
      <mesh castShadow position={[0, 3.5, 0]}>
        <cylinderGeometry args={[1.0, 0.9, 0.15, 8]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.6} />
      </mesh>
      
      {/* Glass Cap Dome */}
      <mesh position={[0, 3.8, 0]}>
        <sphereGeometry args={[0.6, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#60A5FA" opacity={0.6} transparent roughness={0.1} />
      </mesh>

      {/* Spire */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.06, 1.2, 4]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 5.1, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
};

// 2. AI / ML Lab (Research Facility with neural visualizations)
export const AiLabBuilding: React.FC = () => {
  const nodeRef = useRef<THREE.Group>(null);

  // Spin the neural network visualization above the roof
  useFrame((state) => {
    if (nodeRef.current) {
      nodeRef.current.rotation.y = state.clock.getElapsedTime() * 0.8;
      nodeRef.current.position.y = 2.4 + Math.sin(state.clock.getElapsedTime() * 2) * 0.08;
    }
  });

  return (
    <group>
      {/* Building Base */}
      <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
        <boxGeometry args={[2.5, 1.2, 2.2]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.4} />
      </mesh>

      {/* Slanted Glass Roof/Facade */}
      <mesh castShadow position={[0, 1.4, 0.1]}>
        <boxGeometry args={[2.3, 0.6, 1.8]} />
        <meshStandardMaterial color="#0F172A" roughness={0.1} metalness={0.9} />
      </mesh>
      
      {/* Glowing neon bands */}
      <mesh position={[0, 0.6, 1.11]}>
        <boxGeometry args={[2.0, 0.05, 0.05]} />
        <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[1.26, 0.6, 0]}>
        <boxGeometry args={[0.05, 0.05, 1.6]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.6} />
      </mesh>

      {/* Floating Neural Nodes Visualization */}
      <group ref={nodeRef} position={[0, 2.4, 0]}>
        {/* Core brain glow */}
        <mesh>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={1.2} />
        </mesh>
        
        {/* Outer floating atoms */}
        {Array.from({ length: 4 }).map((_, i) => {
          const angle = (i * Math.PI) / 2;
          return (
            <group key={i} rotation={[0, angle, Math.PI / 6]}>
              <mesh position={[0.7, 0, 0]}>
                <sphereGeometry args={[0.08, 6, 6]} />
                <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.8} />
              </mesh>
              {/* Connecting line */}
              <mesh position={[0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.01, 0.01, 0.7, 4]} />
                <meshBasicMaterial color="#8B5CF6" opacity={0.6} transparent />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

// 3. Developer HQ (Sleek office / workspace)
export const DeveloperHqBuilding: React.FC = () => {
  return (
    <group>
      {/* Base slab */}
      <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[2.6, 0.1, 2.6]} />
        <meshStandardMaterial color="#64748B" />
      </mesh>
      
      {/* Creative Angular Building block */}
      <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
        <boxGeometry args={[2.2, 1.4, 2.2]} />
        <meshStandardMaterial color="#F1F5F9" roughness={0.3} />
      </mesh>

      {/* Massive Ribbon Window representing a monitor/dashboard view */}
      <mesh position={[0, 0.9, 1.11]}>
        <boxGeometry args={[1.8, 0.5, 0.05]} />
        <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Screen contents glow inside ribbon window */}
      <mesh position={[0, 0.9, 1.14]}>
        <boxGeometry args={[1.6, 0.4, 0.01]} />
        <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.4} />
      </mesh>
      
      {/* Spire with radar rings */}
      <mesh position={[-0.8, 2.0, -0.8]} castShadow>
        <cylinderGeometry args={[0.03, 0.05, 1.0, 4]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[-0.8, 2.5, -0.8]}>
        <torusGeometry args={[0.2, 0.02, 4, 12]} />
        <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

// 4. Project Avenue (Storefronts representing projects)
export const ProjectAvenueBuilding: React.FC = () => {
  return (
    <group>
      {/* Multi-story modern gallery layout */}
      <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
        <boxGeometry args={[3.2, 1.2, 1.8]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
      </mesh>

      {/* Left tall pillar */}
      <mesh castShadow position={[-1.2, 1.1, 0]}>
        <boxGeometry args={[0.6, 2.2, 1.8]} />
        <meshStandardMaterial color="#0EA5E9" roughness={0.4} />
      </mesh>
      
      {/* Horizontal overhead sign block */}
      <mesh castShadow position={[0.4, 1.6, 0.4]}>
        <boxGeometry args={[2.0, 0.4, 0.8]} />
        <meshStandardMaterial color="#0F172A" roughness={0.2} />
      </mesh>

      {/* Decorative storefront windows */}
      <mesh position={[0.4, 0.6, 0.91]}>
        <boxGeometry args={[1.6, 0.6, 0.05]} />
        <meshStandardMaterial color="#38BDF8" opacity={0.7} transparent roughness={0.1} />
      </mesh>
    </group>
  );
};

// 5. CPI Campus (Traditional academic building)
export const CpiCampusBuilding: React.FC = () => {
  return (
    <group>
      {/* Main Hall */}
      <mesh castShadow receiveShadow position={[0, 0.7, 0]}>
        <boxGeometry args={[3.4, 1.4, 1.6]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.6} />
      </mesh>
      
      {/* Left Wing */}
      <mesh castShadow position={[-1.5, 0.7, 0.8]}>
        <boxGeometry args={[0.8, 1.4, 1.6]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.6} />
      </mesh>

      {/* Right Wing */}
      <mesh castShadow position={[1.5, 0.7, 0.8]}>
        <boxGeometry args={[0.8, 1.4, 1.6]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.6} />
      </mesh>
      
      {/* Center Entrance Gable Triangle Roof */}
      <mesh castShadow position={[0, 1.6, 0.6]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.8, 0.6, 4]} />
        <meshStandardMaterial color="#B45309" roughness={0.8} />
      </mesh>
      
      {/* Entrance Columns */}
      <mesh position={[-0.4, 0.4, 0.8]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 6]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.4, 0.4, 0.8]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 6]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
};

// 6. Tech Cluder (Community circular pavilion dome)
export const TechCluderBuilding: React.FC = () => {
  return (
    <group>
      {/* Circular base */}
      <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.8, 2.0, 0.2, 12]} />
        <meshStandardMaterial color="#64748B" />
      </mesh>
      
      {/* Curved Pavilion Pillars */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * Math.PI) / 3;
        const radius = 1.4;
        return (
          <mesh 
            key={i} 
            position={[Math.cos(angle) * radius, 0.9, Math.sin(angle) * radius]}
            castShadow
          >
            <cylinderGeometry args={[0.08, 0.08, 1.4, 6]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
          </mesh>
        );
      })}

      {/* Floating Ring Header */}
      <mesh castShadow position={[0, 1.7, 0]}>
        <torusGeometry args={[1.4, 0.15, 6, 24]} />
        <meshStandardMaterial color="#EF4444" roughness={0.4} />
      </mesh>
      
      {/* Inner green meeting lawn */}
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 0.02, 12]} />
        <meshStandardMaterial color="#34D399" roughness={0.8} />
      </mesh>

      {/* Open Dome Cap */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[1.4, 12, 12, 0, Math.PI * 2, 0, Math.PI / 3]} />
        <meshStandardMaterial color="#A7F3D0" opacity={0.4} transparent roughness={0.1} />
      </mesh>
    </group>
  );
};

// 7. GitHub Center (Server racks block)
export const GithubCenterBuilding: React.FC = () => {
  return (
    <group>
      {/* Server Chassis Base */}
      <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
        <boxGeometry args={[2.2, 1.6, 2.2]} />
        <meshStandardMaterial color="#1E293B" roughness={0.7} metalness={0.7} />
      </mesh>

      {/* Octocat silhouette decal box (procedural low-poly symbol) */}
      <mesh position={[0, 0.8, 1.11]} castShadow>
        <boxGeometry args={[1.0, 0.8, 0.05]} />
        <meshStandardMaterial color="#000000" roughness={0.1} />
      </mesh>
      
      {/* Glowing ports / code branch indicators */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={i} position={[-0.7 + i * 0.45, 0.8, 1.14]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? "#10B981" : "#F59E0B"} 
            emissive={i % 2 === 0 ? "#10B981" : "#F59E0B"} 
            emissiveIntensity={1} 
          />
        </mesh>
      ))}

      {/* Diagonal cables on roof */}
      <mesh position={[0, 1.65, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1.4, 0.1, 1.4]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
};

// 8. City Exit (Plaza pier overlooking the water)
export const CityExitBuilding: React.FC = () => {
  return (
    <group>
      {/* Boardwalk Pier extends into water */}
      <mesh receiveShadow position={[0, 0.05, 1.2]} castShadow>
        <boxGeometry args={[2.4, 0.1, 4.0]} />
        <meshStandardMaterial color="#D1DBE5" roughness={0.8} />
      </mesh>
      
      {/* Archway Column Left */}
      <mesh position={[-1.0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 2.0, 6]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
      </mesh>
      
      {/* Archway Column Right */}
      <mesh position={[1.0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 2.0, 6]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
      </mesh>

      {/* Top Arch lintel beam */}
      <mesh position={[0, 2.1, 0]} castShadow>
        <boxGeometry args={[2.4, 0.25, 0.4]} />
        <meshStandardMaterial color="#EC4899" roughness={0.4} />
      </mesh>

      {/* Small floating beacon orb */}
      <mesh position={[0, 2.7, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#EC4899" emissive="#EC4899" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
};
