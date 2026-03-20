import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audioManager } from '../../audio/AudioManager';
import { MonsterInstance } from '../../store/useGameStore';

export function PlantMonster({ id, position, rotation }: MonsterInstance) {
  const groupRef = useRef<THREE.Group>(null);
  const head1Ref = useRef<THREE.Group>(null);
  const head2Ref = useRef<THREE.Group>(null);
  const mouth1Ref = useRef<THREE.Mesh>(null);
  const mouth2Ref = useRef<THREE.Mesh>(null);
  const stem1Ref = useRef<THREE.Mesh>(null);
  const stem2Ref = useRef<THREE.Mesh>(null);
  const [hit, setHit] = useState(0);

  useEffect(() => {
    const unsubscribe = audioManager.subscribe('plant', (time, note, velocity) => {
      setHit(1);
    });
    return unsubscribe;
  }, []);

  useFrame((state, delta) => {
    if (hit > 0) {
      setHit((h) => Math.max(0, h - delta * 5));
    }

    const time = state.clock.getElapsedTime();
    
    if (head1Ref.current && head2Ref.current && stem1Ref.current && stem2Ref.current) {
      // Swaying motion
      const sway1 = Math.sin(time * 2) * 0.15 - hit * 0.2;
      const sway2 = Math.cos(time * 2) * 0.15 + hit * 0.2;
      
      head1Ref.current.rotation.z = sway1;
      head2Ref.current.rotation.z = sway2;
      
      stem1Ref.current.rotation.z = 0.2 + sway1 * 0.5;
      stem2Ref.current.rotation.z = -0.2 + sway2 * 0.5;
      
      // Heads bobbing
      head1Ref.current.position.y = 2.2 + Math.cos(time * 4) * 0.05 + hit * 0.1;
      head2Ref.current.position.y = 2.2 + Math.sin(time * 4) * 0.05 + hit * 0.1;
    }

    if (mouth1Ref.current && mouth2Ref.current) {
      // Mouths open on hit
      mouth1Ref.current.scale.y = 0.1 + hit * 2;
      mouth2Ref.current.scale.y = 0.1 + hit * 2;
    }
  });

  return (
    <group position={position} rotation={rotation} ref={groupRef}>
      {/* Wooden Pot */}
      <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.9, 0.7, 1.2, 16]} />
        <meshStandardMaterial color="#8D6E63" roughness={0.9} />
      </mesh>
      
      {/* Pot Rim */}
      <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
        <cylinderGeometry args={[1, 0.9, 0.2, 16]} />
        <meshStandardMaterial color="#795548" roughness={0.9} />
      </mesh>
      
      {/* Soil */}
      <mesh position={[0, 1.21, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.05, 16]} />
        <meshStandardMaterial color="#3E2723" roughness={1} />
      </mesh>

      {/* Stem 1 */}
      <mesh ref={stem1Ref} castShadow position={[-0.3, 1.7, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 8]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>

      {/* Head 1 */}
      <group ref={head1Ref} position={[-0.6, 2.2, 0]}>
        {/* Bulb */}
        <mesh castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#81C784" roughness={0.6} />
        </mesh>
        {/* Leaves/Hair */}
        <mesh castShadow position={[0, 0.5, -0.2]} rotation={[0.5, 0, 0]}>
          <coneGeometry args={[0.2, 0.6, 4]} />
          <meshStandardMaterial color="#388E3C" />
        </mesh>
        <mesh castShadow position={[0, 0.5, 0.2]} rotation={[-0.5, 0, 0]}>
          <coneGeometry args={[0.2, 0.6, 4]} />
          <meshStandardMaterial color="#388E3C" />
        </mesh>
        {/* Eyes */}
        <group position={[0, 0.15, 0.4]}>
          <mesh position={[-0.2, 0, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[-0.2, 0, 0.08]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="black" />
          </mesh>
          <mesh position={[0.2, 0, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0.2, 0, 0.08]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="black" />
          </mesh>
        </group>
        {/* Mouth */}
        <mesh ref={mouth1Ref} position={[0, -0.15, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
          <meshBasicMaterial color="#111" />
        </mesh>
      </group>

      {/* Stem 2 */}
      <mesh ref={stem2Ref} castShadow position={[0.3, 1.7, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 8]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>

      {/* Head 2 */}
      <group ref={head2Ref} position={[0.6, 2.2, 0]}>
        {/* Bulb */}
        <mesh castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#81C784" roughness={0.6} />
        </mesh>
        {/* Leaves/Hair */}
        <mesh castShadow position={[0, 0.5, -0.2]} rotation={[0.5, 0, 0]}>
          <coneGeometry args={[0.2, 0.6, 4]} />
          <meshStandardMaterial color="#388E3C" />
        </mesh>
        <mesh castShadow position={[0, 0.5, 0.2]} rotation={[-0.5, 0, 0]}>
          <coneGeometry args={[0.2, 0.6, 4]} />
          <meshStandardMaterial color="#388E3C" />
        </mesh>
        {/* Eyes */}
        <group position={[0, 0.15, 0.4]}>
          <mesh position={[-0.2, 0, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[-0.2, 0, 0.08]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="black" />
          </mesh>
          <mesh position={[0.2, 0, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0.2, 0, 0.08]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="black" />
          </mesh>
        </group>
        {/* Mouth */}
        <mesh ref={mouth2Ref} position={[0, -0.15, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
          <meshBasicMaterial color="#111" />
        </mesh>
      </group>
    </group>
  );
}
