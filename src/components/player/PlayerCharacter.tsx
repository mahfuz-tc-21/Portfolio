import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../store/useStore';

export const PlayerCharacter: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const targetIndicatorRef = useRef<THREE.Mesh>(null);
  
  const { playerPos, playerTarget, setPlayerPos, setPlayerTarget } = useStore();

  // Handle keyboard movement in addition to click-to-move (WASD)
  useEffect(() => {
    const keysPressed: Record<string, boolean> = {};
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed[e.key.toLowerCase()] = true;
      // Clear target click indicator if moving via keyboard
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(e.key.toLowerCase())) {
        setPlayerTarget(null);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setPlayerTarget]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    let currentPos = new THREE.Vector3(playerPos[0], playerPos[1], playerPos[2]);
    let targetVec = playerTarget ? new THREE.Vector3(playerTarget[0], playerTarget[1], playerTarget[2]) : null;

    let moved = false;
    const speed = 6.5 * delta;

    // 1. Move to clicked target if set
    if (targetVec) {
      const dist = currentPos.distanceTo(targetVec);
      if (dist > 0.1) {
        const dir = new THREE.Vector3().subVectors(targetVec, currentPos).normalize();
        
        // Rotate character towards moving target direction
        const angle = Math.atan2(dir.x, dir.z);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, angle, 0.15);

        // Translate position
        currentPos.addScaledVector(dir, Math.min(speed, dist));
        moved = true;
      } else {
        setPlayerTarget(null); // reached target
      }
    }

    // 2. Animate Target click indicator ring
    if (targetIndicatorRef.current && playerTarget) {
      const time = state.clock.getElapsedTime();
      targetIndicatorRef.current.scale.setScalar(0.8 + Math.sin(time * 6) * 0.25);
      const mat = targetIndicatorRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = 0.6 + Math.sin(time * 6) * 0.2;
    }

    // 3. Simple head bobbing / limb movement simulation when moving
    if (moved) {
      const time = state.clock.getElapsedTime();
      const leftLeg = meshRef.current.getObjectByName('leftLeg');
      const rightLeg = meshRef.current.getObjectByName('rightLeg');
      const body = meshRef.current.getObjectByName('torso');
      
      if (leftLeg) leftLeg.rotation.x = Math.sin(time * 12) * 0.45;
      if (rightLeg) rightLeg.rotation.x = -Math.sin(time * 12) * 0.45;
      if (body) body.position.y = 0.65 + Math.sin(time * 15) * 0.04;
    } else {
      // Idle pose
      const leftLeg = meshRef.current.getObjectByName('leftLeg');
      const rightLeg = meshRef.current.getObjectByName('rightLeg');
      const body = meshRef.current.getObjectByName('torso');
      if (leftLeg) leftLeg.rotation.x = 0;
      if (rightLeg) rightLeg.rotation.x = 0;
      if (body) body.position.y = 0.65;
    }

    // Keep state in store updated
    if (moved || currentPos.x !== playerPos[0] || currentPos.z !== playerPos[2]) {
      setPlayerPos([currentPos.x, currentPos.y, currentPos.z]);
    }
  });

  return (
    <group>
      {/* Click movement target indicator ring on the ground */}
      {playerTarget && (
        <mesh 
          ref={targetIndicatorRef} 
          position={[playerTarget[0], 0.05, playerTarget[2]]} 
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.3, 0.4, 16]} />
          <meshBasicMaterial color="#3B82F6" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Stylized Character Group */}
      <group ref={meshRef} position={playerPos}>
        {/* Head */}
        <mesh name="head" position={[0, 1.25, 0]} castShadow>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#FFE4C4" roughness={0.7} />
        </mesh>
        
        {/* Hair / Cap (Stylized black box) */}
        <mesh name="hair" position={[0, 1.34, -0.02]} castShadow>
          <boxGeometry args={[0.26, 0.1, 0.26]} />
          <meshStandardMaterial color="#1E293B" roughness={0.9} />
        </mesh>

        {/* Torso (Developer Hoodie) */}
        <mesh name="torso" position={[0, 0.65, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.15, 0.7, 8]} />
          <meshStandardMaterial color="#0F172A" roughness={0.6} /> {/* Sleek dark hoodie */}
        </mesh>

        {/* Left Leg */}
        <mesh name="leftLeg" position={[-0.1, 0.2, 0]} castShadow>
          <boxGeometry args={[0.08, 0.4, 0.08]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} /> {/* Blue jeans */}
        </mesh>

        {/* Right Leg */}
        <mesh name="rightLeg" position={[0.1, 0.2, 0]} castShadow>
          <boxGeometry args={[0.08, 0.4, 0.08]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};
export default PlayerCharacter;
