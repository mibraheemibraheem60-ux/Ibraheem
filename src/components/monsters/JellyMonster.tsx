import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audioManager } from '../../audio/AudioManager';
import { MonsterInstance } from '../../store/useGameStore';

export function JellyMonster({ id, position, rotation }: MonsterInstance) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const toesRef = useRef<THREE.Group>(null);
  const [hit, setHit] = useState(0);

  useEffect(() => {
    const unsubscribe = audioManager.subscribe('jelly', (time, note, velocity) => {
      setHit(1);
    });
    return unsubscribe;
  }, []);

  useFrame((state, delta) => {
    if (hit > 0) {
      setHit((h) => Math.max(0, h - delta * 3));
    }

    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Floating/bobbing motion
      groupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.15;
    }

    if (bodyRef.current) {
      // Wobble effect
      bodyRef.current.scale.y = 1 - hit * 0.2 + Math.sin(time * 4) * 0.05;
      bodyRef.current.scale.x = 1 + hit * 0.15 + Math.cos(time * 4) * 0.05;
      bodyRef.current.scale.z = 1 + hit * 0.15 + Math.sin(time * 3) * 0.05;
    }

    if (toesRef.current) {
      // Toes wiggle
      toesRef.current.children.forEach((toe, i) => {
        toe.position.y = 0.2 + Math.sin(time * 3 + i) * 0.1 + hit * 0.2;
      });
    }

    if (materialRef.current) {
      // Glow on hit
      materialRef.current.emissiveIntensity = hit * 1.5;
    }
  });

  return (
    <group position={position} rotation={rotation} ref={groupRef}>
      {/* Jelly Dome Body */}
      <mesh ref={bodyRef} castShadow receiveShadow position={[0, 0.8, 0]}>
        <sphereGeometry args={[1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color="#00BCD4"
          emissive="#00BCD4"
          emissiveIntensity={0}
          transmission={0.9}
          opacity={1}
          metalness={0.1}
          roughness={0.1}
          ior={1.4}
          thickness={2}
          clearcoat={1}
        />
      </mesh>

      {/* Eyes */}
      <group position={[0, 1.2, 1.1]}>
        <mesh position={[-0.35, 0, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[-0.35, 0, 0.15]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="black" />
        </mesh>
        <mesh position={[0.35, 0, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0.35, 0, 0.15]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="black" />
        </mesh>
      </group>

      {/* Mouth */}
      <mesh position={[0, 0.8, 1.15]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial color="#006064" />
      </mesh>

      {/* Toes around the base */}
      <group ref={toesRef}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2;
          const x = Math.cos(angle) * 1.1;
          const z = Math.sin(angle) * 1.1;
          return (
            <mesh key={i} castShadow position={[x, 0.2, z]}>
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshPhysicalMaterial
                color="#00BCD4"
                transmission={0.9}
                roughness={0.1}
                ior={1.4}
                thickness={1}
                clearcoat={1}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
