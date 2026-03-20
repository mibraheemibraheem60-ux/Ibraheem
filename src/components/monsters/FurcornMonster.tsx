import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

export function FurcornMonster({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const { isPlaying } = useGameStore();

  useFrame((state) => {
    if (!groupRef.current) return;
    
    if (isPlaying) {
      // Swaying motion
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      groupRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
    } else {
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
      groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, 1, 0.1);
    }
  });

  return (
    <group ref={groupRef} position={[position[0], position[1] + 0.8, position[2]]}>
      {/* Body */}
      <mesh castShadow position={[0, 0, 0]}>
        <capsuleGeometry args={[0.5, 0.8, 16, 32]} />
        <meshStandardMaterial color="#81C784" roughness={0.9} />
      </mesh>

      {/* Eye */}
      <group position={[0, 0.4, 0.45]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>

      {/* Mouth */}
      <mesh position={[0, 0.1, 0.48]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.3, 0.05, 0.1]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>

      {/* Branch/Leaf on top */}
      <group position={[0, 0.9, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4]} />
          <meshStandardMaterial color="#5D4037" />
        </mesh>
        <mesh position={[0.1, 0.4, 0]} rotation={[0, 0, -0.5]}>
          <coneGeometry args={[0.15, 0.4, 16]} />
          <meshStandardMaterial color="#4CAF50" />
        </mesh>
      </group>

      {/* Legs */}
      <mesh position={[-0.2, -0.6, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      <mesh position={[0.2, -0.6, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      
      {/* Feet */}
      <mesh position={[-0.2, -0.9, 0.1]}>
        <boxGeometry args={[0.3, 0.1, 0.4]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      <mesh position={[0.2, -0.9, 0.1]}>
        <boxGeometry args={[0.3, 0.1, 0.4]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
    </group>
  );
}
