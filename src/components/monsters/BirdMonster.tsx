import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

export function BirdMonster({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const wingsRef = useRef<THREE.Group>(null);
  const { isPlaying } = useGameStore();

  useFrame((state) => {
    if (!groupRef.current || !wingsRef.current) return;
    
    if (isPlaying) {
      // Bobbing motion
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.2 + 0.5;
      // Flapping wings
      wingsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * 0.5;
    } else {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, position[1] + 0.5, 0.1);
      wingsRef.current.rotation.z = THREE.MathUtils.lerp(wingsRef.current.rotation.z, 0, 0.1);
    }
  });

  return (
    <group ref={groupRef} position={[position[0], position[1] + 0.5, position[2]]}>
      {/* Body */}
      <mesh castShadow position={[0, 0, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#F48FB1" roughness={0.6} />
      </mesh>

      {/* Eyes */}
      <group position={[0, 0.2, 0.5]}>
        <mesh position={[-0.2, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[-0.2, 0, 0.1]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[0.2, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0.2, 0, 0.1]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>

      {/* Beak */}
      <mesh position={[0, -0.1, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.15, 0.4, 16]} />
        <meshStandardMaterial color="#FFB300" />
      </mesh>

      {/* Wings */}
      <group ref={wingsRef}>
        <mesh position={[-0.7, 0, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.8, 0.1, 0.4]} />
          <meshStandardMaterial color="#F06292" />
        </mesh>
        <mesh position={[0.7, 0, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.8, 0.1, 0.4]} />
          <meshStandardMaterial color="#F06292" />
        </mesh>
      </group>
      
      {/* Legs */}
      <mesh position={[-0.2, -0.7, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4]} />
        <meshStandardMaterial color="#FFB300" />
      </mesh>
      <mesh position={[0.2, -0.7, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4]} />
        <meshStandardMaterial color="#FFB300" />
      </mesh>
    </group>
  );
}
