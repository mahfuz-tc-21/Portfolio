import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { locationsData } from '../../data/portfolioData';

export const CameraFocusController: React.FC = () => {
  const { camera, controls } = useThree();
  const { activeLocationId } = useStore();
  
  // Track desired camera target and position
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  const cameraPos = useRef(new THREE.Vector3(0, 15, 20));
  
  // Transition progress tracker (0 = start, 1 = completed)
  const transitionProgress = useRef<number>(1);
  const lastActiveId = useRef<string | null>(null);

  // Initial cinematic animation trigger on load
  const isInitialLoad = useRef(true);
  const initialTime = useRef(0);

  useEffect(() => {
    if (activeLocationId !== lastActiveId.current) {
      lastActiveId.current = activeLocationId;
      transitionProgress.current = 0; // Trigger transition animation
      
      if (activeLocationId) {
        const loc = locationsData.find(l => l.id === activeLocationId);
        if (loc) {
          const [x, y, z] = loc.coordinates;
          targetPos.current.set(x, y + 1.2, z);
          
          if (loc.id === 'city-center') {
            cameraPos.current.set(x + 3.5, y + 4.0, z + 6.0);
          } else if (loc.id === 'ai-lab') {
            cameraPos.current.set(x - 4.5, y + 3.0, z + 4.5);
          } else if (loc.id === 'developer-hq') {
            cameraPos.current.set(x - 4.5, y + 3.0, z - 4.5);
          } else if (loc.id === 'cpi-campus') {
            cameraPos.current.set(x + 5.0, y + 2.5, z - 4.5);
          } else if (loc.id === 'github-center') {
            cameraPos.current.set(x + 4.5, y + 2.5, z + 4.5);
          } else {
            cameraPos.current.set(x + 4.5, y + 2.8, z + 4.5);
          }
        }
      } else {
        // Return to wide overview
        targetPos.current.set(0, 0, 0);
        cameraPos.current.set(0, 16, 22);
      }
    }
  }, [activeLocationId]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // 1. Initial Load Cinematic Intro (Pan from high altitude towards City Center)
    if (isInitialLoad.current) {
      if (initialTime.current === 0) initialTime.current = t;
      const elapsed = t - initialTime.current;
      
      if (elapsed < 2.5) {
        camera.position.lerp(new THREE.Vector3(0, 12, 18), 0.05 * delta * 60);
        camera.lookAt(0, 1, 0);
        if (controls) {
          (controls as any).target.set(0, 1, 0);
        }
        return;
      } else {
        isInitialLoad.current = false;
        // set starting controls target
        if (controls) {
          (controls as any).target.set(0, 0, 0);
        }
      }
    }

    // 2. Smoothly LERP camera position and controls target during active focus transitions
    if (transitionProgress.current < 1) {
      transitionProgress.current += delta * 1.5; // transition takes ~0.66 seconds
      if (transitionProgress.current > 1) {
        transitionProgress.current = 1;
      }
      
      camera.position.lerp(cameraPos.current, 0.08 * delta * 60);
      
      if (controls) {
        (controls as any).target.lerp(targetPos.current, 0.08 * delta * 60);
      } else {
        // Fallback if controls are loading or disabled
        const currentLookTarget = new THREE.Vector3(0, 0, 0);
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        currentLookTarget.copy(camera.position).addScaledVector(dir, 10);
        currentLookTarget.lerp(targetPos.current, 0.08 * delta * 60);
        camera.lookAt(currentLookTarget);
      }
    }
  });

  return null;
};
export default CameraFocusController;
