import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audioManager } from '../../audio/AudioManager';
import { MonsterInstance } from '../../store/useGameStore';

export function RockMonster({ id, position, rotation }: MonsterInstance) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftHandRef = useRef<THREE.Mesh>(null);
  const rightHandRef = useRef<THREE.Mesh>(null);
  const leftFootRef = useRef<THREE.Mesh>(null);
  const rightFootRef = useRef<THREE.Mesh>(null);
  const [hit, setHit] = useState(0);

  useEffect(() => {
    const unsubscribe = audioManager.subscribe('rock', (time, note, velocity) => {
      setHit(1);
    });
    return unsubscribe;
  }, []);

  useFrame((state, delta) => {
    if (hit > 0) {
      setHit((h) => Math.max(0, h - delta * 6));
    }

    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Subtle idle breathing
      groupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.02;
    }

    if (headRef.current) {
      // Squash and stretch on hit
      headRef.current.scale.y = 1 - hit * 0.15;
      headRef.current.scale.x = 1 + hit * 0.1;
      headRef.current.scale.z = 1 + hit * 0.1;
      headRef.current.position.y = 1 - hit * 0.1;
    }

    if (leftHandRef.current && rightHandRef.current) {
      // Hands hit the ground
      leftHandRef.current.position.y = 0.6 + Math.sin(time * 3) * 0.1 - hit * 0.6;
      rightHandRef.current.position.y = 0.6 + Math.cos(time * 3) * 0.1 - hit * 0.6;
      
      // Hands rotate slightly when hitting
      leftHandRef.current.rotation.z = hit * 0.5;
      rightHandRef.current.rotation.z = -hit * 0.5;
    }
  });

  return (
    <group position={position} rotation={rotation} ref={groupRef}>
      {/* Rocky Head/Body */}
      <mesh ref={headRef} castShadow receiveShadow position={[0, 1, 0]}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial color="#795548" flatShading roughness={1} metalness={0} />
      </mesh>
      
      {/* Eyes */}
      <group position={[0, 1.2, 0.8]}>
        {/* Left Eye */}
        <mesh position={[-0.3, 0, 0]} rotation={[0, -0.2, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[-0.3, 0, 0.15]} rotation={[0, -0.2, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="black" />
        </mesh>
        {/* Right Eye */}
        <mesh position={[0.3, 0, 0]} rotation={[0, 0.2, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0.3, 0, 0.15]} rotation={[0, 0.2, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="black" />
        </mesh>
      </group>

      {/* Big Hands */}
      <mesh ref={leftHandRef} castShadow position={[-1.1, 0.6, 0.4]}>
        <boxGeometry args={[0.5, 0.4, 0.6]} />
        <meshStandardMaterial color="#5D4037" flatShading roughness={1} />
      </mesh>
      <mesh ref={rightHandRef} castShadow position={[1.1, 0.6, 0.4]}>
        <boxGeometry args={[0.5, 0.4, 0.6]} />
        <meshStandardMaterial color="#5D4037" flatShading roughness={1} />
      </mesh>

      {/* Feet */}
      <mesh ref={leftFootRef} castShadow position={[-0.4, 0.2, 0.2]}>
        <boxGeometry args={[0.4, 0.3, 0.5]} />
        <meshStandardMaterial color="#5D4037" flatShading roughness={1} />
      </mesh>
      <mesh ref={rightFootRef} castShadow position={[0.4, 0.2, 0.2]}>
        <boxGeometry args={[0.4, 0.3, 0.5]} />
        <meshStandardMaterial color="#5D4037" flatShading roughness={1} />
      </mesh>
    </group>
  );
}
