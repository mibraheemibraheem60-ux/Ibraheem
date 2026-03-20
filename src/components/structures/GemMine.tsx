import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

export function GemMine({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const crystalRef = useRef<THREE.Mesh>(null);
  const { addDiamonds } = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      addDiamonds(1);
    }, 10000); // 1 diamond every 10 seconds
    return () => clearInterval(interval);
  }, [addDiamonds]);

  useFrame((state) => {
    if (!crystalRef.current) return;
    crystalRef.current.rotation.y += 0.02;
    crystalRef.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Base */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1.5, 2, 1, 8]} />
        <meshStandardMaterial color="#424242" roughness={0.9} />
      </mesh>
      
      {/* Supports */}
      <mesh castShadow position={[-1, 1.5, -1]}>
        <boxGeometry args={[0.3, 2, 0.3]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      <mesh castShadow position={[1, 1.5, -1]}>
        <boxGeometry args={[0.3, 2, 0.3]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      <mesh castShadow position={[-1, 1.5, 1]}>
        <boxGeometry args={[0.3, 2, 0.3]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      <mesh castShadow position={[1, 1.5, 1]}>
        <boxGeometry args={[0.3, 2, 0.3]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>

      {/* Roof */}
      <mesh castShadow position={[0, 2.5, 0]}>
        <coneGeometry args={[2.2, 1.5, 4]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>

      {/* Crystal */}
      <mesh ref={crystalRef} castShadow position={[0, 1.5, 0]}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshPhysicalMaterial color="#E040FB" emissive="#AA00FF" emissiveIntensity={0.5} transmission={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}
