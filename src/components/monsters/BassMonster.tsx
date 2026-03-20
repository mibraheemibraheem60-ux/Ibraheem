import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audioManager } from '../../audio/AudioManager';
import { MonsterInstance } from '../../store/useGameStore';

export function BassMonster({ id, position, rotation }: MonsterInstance) {
  const groupRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const [hit, setHit] = useState(0);

  useEffect(() => {
    const unsubscribe = audioManager.subscribe('bass', (time, note, velocity) => {
      setHit(1);
    });
    return unsubscribe;
  }, []);

  useFrame((state, delta) => {
    if (hit > 0) {
      setHit((h) => Math.max(0, h - delta * 4));
    }

    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Big slow sway
      groupRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.1;
      groupRef.current.rotation.z = Math.sin(time * 1.5) * 0.05;
    }

    if (mouthRef.current) {
      // Huge mouth opening
      mouthRef.current.scale.y = 0.1 + hit * 3;
      mouthRef.current.scale.x = 1 + hit * 0.5;
      mouthRef.current.position.y = 1.4 - hit * 0.3;
    }

    if (bodyRef.current) {
      // Body squash
      bodyRef.current.scale.y = 1 + hit * 0.1;
      bodyRef.current.scale.x = 1 - hit * 0.05;
      bodyRef.current.scale.z = 1 - hit * 0.05;
    }

    if (leftArmRef.current && rightArmRef.current) {
      // Arms swing
      leftArmRef.current.rotation.z = Math.PI / 6 + Math.sin(time * 2) * 0.1 + hit * 0.2;
      rightArmRef.current.rotation.z = -Math.PI / 6 - Math.sin(time * 2) * 0.1 - hit * 0.2;
    }
  });

  return (
    <group position={position} rotation={rotation} ref={groupRef}>
      {/* Fluffy Body (Cluster of spheres) */}
      <group ref={bodyRef} position={[0, 1.5, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, -0.5, 0]}>
          <sphereGeometry args={[1.1, 32, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
        </mesh>
      </group>

      {/* Eyes */}
      <group position={[0, 2.2, 0.8]}>
        <mesh position={[-0.3, 0, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[-0.3, 0, 0.1]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="black" />
        </mesh>
        <mesh position={[0.3, 0, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0.3, 0, 0.1]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="black" />
        </mesh>
      </group>

      {/* Huge Mouth */}
      <mesh ref={mouthRef} position={[0, 1.4, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
        <meshBasicMaterial color="#111" />
      </mesh>

      {/* Arms */}
      <group ref={leftArmRef} position={[-1, 1.8, 0]}>
        <mesh castShadow position={[-0.5, -0.6, 0]} rotation={[0, 0, -Math.PI / 8]}>
          <capsuleGeometry args={[0.3, 1.2, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
        </mesh>
        {/* Hand */}
        <mesh castShadow position={[-0.8, -1.4, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
        </mesh>
      </group>
      
      <group ref={rightArmRef} position={[1, 1.8, 0]}>
        <mesh castShadow position={[0.5, -0.6, 0]} rotation={[0, 0, Math.PI / 8]}>
          <capsuleGeometry args={[0.3, 1.2, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
        </mesh>
        {/* Hand */}
        <mesh castShadow position={[0.8, -1.4, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
        </mesh>
      </group>
      
      {/* Big Feet */}
      <mesh castShadow position={[-0.6, 0.3, 0.4]}>
        <boxGeometry args={[0.8, 0.6, 1]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0.6, 0.3, 0.4]}>
        <boxGeometry args={[0.8, 0.6, 1]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>
    </group>
  );
}
