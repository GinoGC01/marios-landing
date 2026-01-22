import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

export const FloatingCube = ({ mousePosition }: { mousePosition: { x: number, y: number } }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerMeshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [animProgress, setAnimProgress] = useState(0);
  const { viewport } = useThree();

  const isMobile = viewport.width < 5;

  const geometries = useMemo(() => {
    // El cubo base es de 1x1x1
    const roundedBoxGeometry = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
    const positionAttribute = roundedBoxGeometry.attributes.position;
    const vertex = new THREE.Vector3();
    const smoothRadius = 0.10; 
    
    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(positionAttribute, i);
      const absX = Math.abs(vertex.x), absY = Math.abs(vertex.y), absZ = Math.abs(vertex.z);
      
      if (absX > 0.5 - smoothRadius && absY > 0.5 - smoothRadius && absZ > 0.5 - smoothRadius) {
        const cornerDist = new THREE.Vector3(Math.sign(vertex.x) * (0.5 - smoothRadius), Math.sign(vertex.y) * (0.5 - smoothRadius), Math.sign(vertex.z) * (0.5 - smoothRadius));
        const toCorner = vertex.clone().sub(cornerDist);
        if (toCorner.length() > 0) vertex.copy(cornerDist.add(toCorner.normalize().multiplyScalar(smoothRadius)));
      } else if ((absX > 0.5 - smoothRadius && absY > 0.5 - smoothRadius) || (absY > 0.5 - smoothRadius && absZ > 0.5 - smoothRadius) || (absZ > 0.5 - smoothRadius && absX > 0.5 - smoothRadius)) {
        let edgeCenter = new THREE.Vector3(), tangent = new THREE.Vector3();
        if (absX > 0.5 - smoothRadius && absY > 0.5 - smoothRadius) {
          edgeCenter.set(Math.sign(vertex.x) * (0.5 - smoothRadius), Math.sign(vertex.y) * (0.5 - smoothRadius), vertex.z);
          tangent.set(vertex.x - edgeCenter.x, vertex.y - edgeCenter.y, 0);
        } else if (absY > 0.5 - smoothRadius && absZ > 0.5 - smoothRadius) {
          edgeCenter.set(vertex.x, Math.sign(vertex.y) * (0.5 - smoothRadius), Math.sign(vertex.z) * (0.5 - smoothRadius));
          tangent.set(0, vertex.y - edgeCenter.y, vertex.z - edgeCenter.z);
        } else {
          edgeCenter.set(Math.sign(vertex.x) * (0.5 - smoothRadius), vertex.y, Math.sign(vertex.z) * (0.5 - smoothRadius));
          tangent.set(vertex.x - edgeCenter.x, 0, vertex.z - edgeCenter.z);
        }
        if (tangent.length() > 0) vertex.copy(edgeCenter.add(tangent.normalize().multiplyScalar(smoothRadius)));
      }
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    roundedBoxGeometry.computeVertexNormals();
    return { roundedBox: roundedBoxGeometry };
  }, []);

  useEffect(() => {
    let startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime - 400;
      const progress = Math.min(Math.max(elapsed / 1800, 0), 1);
      setAnimProgress(progress < 0.5 ? 4 * progress ** 3 : 1 - Math.pow(-2 * progress + 2, 3) / 2);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.scale.setScalar(0.3 + animProgress * 0.7);
    }
    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mousePosition.y * 0.3 * animProgress + Math.sin(t * 0.2) * 0.1, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mousePosition.x * 0.3 * animProgress + t * 0.12, 0.05);
    }
    if (innerMeshRef.current) {
      const speed = 0.3 + animProgress * 0.7;
      innerMeshRef.current.rotation.x = t * 0.7 * speed;
      innerMeshRef.current.rotation.y = t * 0.5 * speed;
    }
    if (glowRef.current) {
      const pulse = Math.sin(t * 2) * 0.1 + 1.2;
      glowRef.current.scale.setScalar(pulse * (animProgress < 1 ? 1 + (1 - animProgress) * 0.5 : 1));
    }
  });

  const baseOpacity = 0.3 + animProgress * 0.7;

  return (
    <Float speed={1.5} rotationIntensity={0.8 * animProgress} floatIntensity={1.5 * animProgress}>
      <group ref={groupRef}>
        {/* BRILLO (Glow): Reducido un 20% (antes 2.8 -> ahora 2.24) */}
        <mesh ref={glowRef} scale={isMobile ? 1.2 : 2.24}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.05 * baseOpacity} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </mesh>

        {/* CUBO PRINCIPAL: Reducido un 20% (antes 2.2 -> ahora 1.76) */}
        <mesh ref={meshRef} scale={isMobile ? 0.88 : 1.76}>
          <primitive object={geometries.roundedBox} />
          <MeshTransmissionMaterial
            backside samples={10} resolution={512} transmission={0.98} roughness={0.05} 
            thickness={1.2} ior={1.8} chromaticAberration={1.5} anisotropy={1} distortion={0.5} color="#ffffff"
          />
          <mesh ref={innerMeshRef} scale={0.4}>
            <icosahedronGeometry args={[1, 1]} />
            <meshPhysicalMaterial color="#6000ff" emissive="#00e5ff" emissiveIntensity={2 * animProgress} metalness={1} roughness={0} iridescence={1} iridescenceIOR={2.8} />
          </mesh>
        </mesh>

        {/* --- SISTEMA DE PARTÍCULAS --- */}
        {/* Destellos Rainbow: Escala reducida a 0.11 (10% menos de 0.12 aproximado) */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh 
            key={`flare-${i}`}
            position={[
              Math.cos((i / 12) * Math.PI * 2 + animProgress * Math.PI) * 1.4, 
              (i % 3 - 1) * 0.6, 
              Math.sin((i / 12) * Math.PI * 2 + animProgress * Math.PI) * 1.4
            ]}
            scale={0.12} 
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial 
              color={new THREE.Color().setHSL((i / 12 + animProgress * 0.1) % 1, 1, 0.7)} 
              transparent opacity={0.5 * baseOpacity} blending={THREE.AdditiveBlending} 
            />
          </mesh>
        ))}

        {/* Partículas orbitantes: Escala inicial de 0.1 reducida a 0.09 (10% menos) */}
        {Array.from({ length: 8 }).map((_, i) => {
          const pProgress = Math.max(0, Math.min(1, (animProgress - (i * 0.05)) / (1 - (i * 0.05))));
          return (
            <mesh 
              key={`orbit-${i}`} 
              position={[
                Math.cos((i / 8) * Math.PI * 2) * 3, 
                Math.sin((i / 8) * Math.PI * 4) * 0.5, 
                Math.sin((i / 8) * Math.PI * 2) * 3
              ]}
              scale={0.09 * pProgress} 
            >
              <sphereGeometry args={[1, 16, 16]} />
              <meshBasicMaterial 
                color={new THREE.Color().setHSL(i / 8, 1, 0.6)} 
                transparent opacity={0.6 * baseOpacity * pProgress} 
                blending={THREE.AdditiveBlending} 
              />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
};