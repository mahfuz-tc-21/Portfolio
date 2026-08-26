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
    const isMobile = window.innerWidth < 768;

    if (activeLocationId !== lastActiveId.current) {
      lastActiveId.current = activeLocationId;
      transitionProgress.current = 0; // Trigger transition animation
      
      if (activeLocationId) {
        const loc = locationsData.find(l => l.id === activeLocationId);
        if (loc) {
          const [x, y, z] = loc.coordinates;
          targetPos.current.set(x, y + 1.2, z);
          
          if (loc.id === 'city-center') {
            cameraPos.current.set(
              x + (isMobile ? 5.2 : 3.5), 
              y + (isMobile ? 5.5 : 4.0), 
              z + (isMobile ? 8.5 : 6.0)
            );
          } else if (loc.id === 'ai-lab') {
            cameraPos.current.set(
              x - (isMobile ? 6.2 : 4.5), 
              y + (isMobile ? 4.2 : 3.0), 
              z + (isMobile ? 6.2 : 4.5)
            );
          } else if (loc.id === 'developer-hq') {
            cameraPos.current.set(
              x - (isMobile ? 6.2 : 4.5), 
              y + (isMobile ? 4.2 : 3.0), 
              z - (isMobile ? 6.2 : 4.5)
            );
          } else if (loc.id === 'cpi-campus') {
            cameraPos.current.set(
              x + (isMobile ? 7.2 : 5.0), 
              y + (isMobile ? 3.8 : 2.5), 
              z - (isMobile ? 6.2 : 4.5)
            );
          } else if (loc.id === 'github-center') {
            cameraPos.current.set(
              x + (isMobile ? 6.2 : 4.5), 
              y + (isMobile ? 3.5 : 2.5), 
              z + (isMobile ? 6.2 : 4.5)
            );
          } else {
            cameraPos.current.set(
              x + (isMobile ? 6.2 : 4.5), 
              y + (isMobile ? 3.8 : 2.8), 
              z + (isMobile ? 6.2 : 4.5)
            );
          }
        }
      } else {
        // Return to wide overview - zoom out further on mobile screen sizes
        targetPos.current.set(0, 0, 0);
        cameraPos.current.set(0, isMobile ? 26 : 15, isMobile ? 33 : 20);
      }
    }
  }, [activeLocationId]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const isMobile = window.innerWidth < 768;

    // 1. Initial Load Cinematic Intro (Pan from high altitude towards City Center)
    if (isInitialLoad.current) {
      if (initialTime.current === 0) initialTime.current = t;
      const elapsed = t - initialTime.current;
      
      if (elapsed < 2.5) {
        // Adjust intro end altitude for mobile so it fits the viewport from start
        const targetIntroPos = new THREE.Vector3(0, isMobile ? 22 : 12, isMobile ? 28 : 18);
        camera.position.lerp(targetIntroPos, 0.05 * delta * 60);
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
