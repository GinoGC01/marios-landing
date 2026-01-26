import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { FloatingDollar } from './DollarGeometry.tsx';

export const HeroSceneDesk = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const check = () => setEnabled(window.innerWidth >= 1024);

    const move = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };

    check();
    window.addEventListener('resize', check);
    window.addEventListener('mousemove', move);

    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('mousemove', move);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="absolute inset-0 bg-[#020205]">
      <Canvas
        camera={{ position: [-2, -5, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <FloatingDollar
            mousePosition={mousePosition}
            scaleConfig={{
              main: 2.6,
              glow: 3.4,
              inner: 0.35,
              particles: 0.12,
              trail: 1.6
            }}
          />

          <Environment preset="city" />
          <pointLight position={[5, 5, 5]} intensity={1.5} />
          <ambientLight intensity={0.3} />
        </Suspense>
      </Canvas>
    </div>
  );
};
