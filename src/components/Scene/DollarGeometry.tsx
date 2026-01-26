import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

export type FloatingScaleConfig = {
  main: number;
  glow: number;
  inner: number;
  particles: number;
  trail: number;
};

type OrbitParticle = {
  radius: number;
  speed: number;
  size: number;
  phase: number;
  hueOffset: number;
};

export const FloatingDollar = ({
  mousePosition,
  scaleConfig
}: {
  mousePosition: { x: number; y: number };
  scaleConfig: FloatingScaleConfig;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerMeshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Group>(null);

  const [animProgress, setAnimProgress] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const sphereGeometry = useMemo(
    () => new THREE.SphereGeometry(1, 64, 64),
    []
  );

  /* Configuración de partículas orbitantes (15, tamaños distintos) */
  const orbitParticles = useMemo<OrbitParticle[]>(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      radius: 2 + Math.random() * 1.2,
      speed: 0.4 + Math.random() * 0.6,
      size: 0.6 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      hueOffset: Math.random()
    }));
  }, []);

  /* Mouse pulse */
  useEffect(() => {
    const delta = Math.hypot(
      mousePosition.x - lastMousePos.current.x,
      mousePosition.y - lastMousePos.current.y
    );
    if (delta > 0.01) setPulseIntensity(p => Math.min(p + 0.3, 1));
    lastMousePos.current = mousePosition;
  }, [mousePosition]);

  /* Entrada tipo cometa */
  useEffect(() => {
    const start = Date.now();
    const loop = () => {
      const t = Math.min((Date.now() - start - 200) / 2000, 1);
      const eased =
        t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setAnimProgress(Math.max(0, eased));
      if (t < 1) requestAnimationFrame(loop);
    };
    loop();
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    if (pulseIntensity > 0) {
      setPulseIntensity(p => Math.max(0, p - 0.015));
    }

    /* Movimiento principal */
    if (groupRef.current) {
      const start = { x: 8, y: -6, z: 2 };
      const end = { x: -2, y: 2, z: 0 };

      groupRef.current.position.set(
        THREE.MathUtils.lerp(start.x, end.x, animProgress),
        THREE.MathUtils.lerp(start.y, end.y, animProgress),
        THREE.MathUtils.lerp(start.z, end.z, animProgress)
      );

      groupRef.current.scale.setScalar(
        (0.15 + animProgress * 0.85) * (1 + pulseIntensity * 0.08)
      );
    }

    /* Esfera */
    if (meshRef.current) {
      meshRef.current.rotation.x =
        mousePosition.y * 0.25 * animProgress + Math.sin(t * 0.2) * 0.1;
      meshRef.current.rotation.y =
        mousePosition.x * 0.25 * animProgress + t * 0.12;

      meshRef.current.scale.setScalar(
        scaleConfig.main * (1 + pulseIntensity * 0.03)
      );
    }

    /* Núcleo */
    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.x = t * 0.7;
      innerMeshRef.current.rotation.y = t * 0.5;
      innerMeshRef.current.scale.setScalar(
        scaleConfig.inner * (1 + pulseIntensity * 0.1)
      );
    }

    /* Glow */
    if (glowRef.current) {
      glowRef.current.scale.setScalar(
        scaleConfig.glow *
          (1.2 + Math.sin(t * 2) * 0.15) *
          (1 + pulseIntensity * 0.15)
      );
    }

    /* Estela */
    if (trailRef.current) {
      trailRef.current.children.forEach((child, i) => {
        const delay = i * 0.06;
        const p = Math.max(0, animProgress - delay);
        const intensity = 1 - i * 0.12;

        child.scale.setScalar(p * scaleConfig.trail * intensity);

        const mat = (child as THREE.Mesh)
          .material as THREE.MeshBasicMaterial;
        mat.opacity = p * 0.85 * intensity;
        mat.color.setHSL(0.5 + animProgress * 0.15, 1, 0.65);
      });
    }

    /* 🌈 PARTÍCULAS ORBITANDO CON COLOR DINÁMICO */
    if (orbitRef.current) {
      orbitRef.current.children.forEach((child, i) => {
        const cfg = orbitParticles[i];
        const angle = t * cfg.speed + cfg.phase;

        const x = Math.cos(angle) * cfg.radius;
        const z = Math.sin(angle) * cfg.radius;
        const y = Math.sin(angle * 1.5) * 0.6;

        child.position.set(x, y, z);

        const scale =
          scaleConfig.particles *
          cfg.size *
          (1 + pulseIntensity * 0.1);

        child.scale.setScalar(scale);

        const mat = (child as THREE.Mesh)
          .material as THREE.MeshBasicMaterial;

        const hue =
          (cfg.hueOffset + t * 0.05 + animProgress * 0.1) % 1;

        mat.color.setHSL(hue, 1, 0.65);
        mat.opacity = 0.6 + Math.sin(t + i) * 0.2;
      });
    }
  });

  const baseOpacity = 0.3 + animProgress * 0.7;

  return (
    <Float speed={1.5} floatIntensity={1.5 * animProgress}>
      <group ref={groupRef}>
        {/* ESTELA */}
        <group ref={trailRef}>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh
              key={i}
              position={[-i * 0.9, i * 0.6, -i * 0.4]}
              scale={0}
            >
              <sphereGeometry args={[0.9, 24, 24]} />
              <meshBasicMaterial
                transparent
                opacity={0}
                color="#00ffff"
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>

        {/* GLOW */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            transparent
            opacity={0.05 * baseOpacity}
            color="#00ffff"
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>

        {/* ESFERA */}
        <mesh ref={meshRef}>
          <primitive object={sphereGeometry} />
          <MeshTransmissionMaterial
            transmission={0.98}
            roughness={0.05}
            thickness={1.2}
            ior={1.8}
            chromaticAberration={1.5}
            distortion={0.5}
          />

          <mesh ref={innerMeshRef}>
            <icosahedronGeometry args={[1, 1]} />
            <meshPhysicalMaterial
              emissive="#00e5ff"
              emissiveIntensity={2 * animProgress}
              metalness={1}
              roughness={0}
            />
          </mesh>
        </mesh>

        <group ref={orbitRef}>
          {orbitParticles.map((_, i) => (
            <mesh key={i}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshBasicMaterial
                transparent
                blending={THREE.AdditiveBlending}
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
};
