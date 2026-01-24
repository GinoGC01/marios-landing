// src/components/3d/HeroScene.tsx
import { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { FloatingCube } from './FloatingCube';

function StarField() {
  const ref = useRef<THREE.Group>(null);
  
  const stars = useMemo(() => {
    return Array.from({ length: 80 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 40, 
        (Math.random() - 0.5) * 40, 
        Math.random() * -30
      ] as [number, number, number],
      speed: 0.05 + Math.random() * 0.1,
      color: new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 1, 0.7)
    }));
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        child.position.z += stars[i].speed;
        if (child.position.z > 5) child.position.z = -25;
      });
    }
  });

  return (
    <group ref={ref}>
      {stars.map((star, i) => (
        <mesh key={i} position={star.position}>
          <cylinderGeometry args={[0.015, 0.015, 1.5, 6]} />
          <meshBasicMaterial 
            color={star.color} 
            transparent 
            opacity={0.2} 
            blending={THREE.AdditiveBlending} 
          />
        </mesh>
      ))}
    </group>
  );
}

export const HeroSceneDesk = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // mobile
    const checkViewport = () => {
      setShouldRender(window.innerWidth >= 1024);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth >= 1024) {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: -(e.clientY / window.innerHeight) * 2 + 1,
        });
      }
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', checkViewport);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // GUARDIA CRÍTICO: Si no es desktop, salimos antes de cargar nada de Three.js
  if (!shouldRender) return null;

  return (
    <div className="absolute inset-0 z-0 bg-[#020205] overflow-hidden">
      <Canvas 
        // Configuración optimizada solo para Desktop
        camera={{ 
          position: [-2, -5, 5], 
          fov: 45 
        }} 
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance" 
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <StarField />
          
          <group position={[-2, -1, 0]}> 
            <FloatingCube mousePosition={mousePosition} />
          </group>
          
          <Environment preset="city" />
          <pointLight position={[5, 5, 5]} intensity={1.5} color="#00ffff" />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#a855f7" />
          <ambientLight intensity={0.3} />
        </Suspense>
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020205] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020205]/20 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};