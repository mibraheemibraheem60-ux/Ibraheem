import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audioManager } from '../../audio/AudioManager';
import { MonsterInstance } from '../../store/useGameStore';

export function WubboxMonster({ id, position, rotation }: MonsterInstance) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const armLRef = useRef<THREE.Group>(null);
  const armRRef = useRef<THREE.Group>(null);
  const legLRef = useRef<THREE.Group>(null);
  const legRRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const [hit, setHit] = useState(0);

  useEffect(() => {
    const unsubscribe = audioManager.subscribe('wubbox', (time, note, velocity) => {
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
      // Heavy, mechanical bobbing
      groupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.1;
      // Slight rotation back and forth
      groupRef.current.rotation.y = rotation[1] + Math.sin(time) * 0.05;
    }

    if (coreRef.current) {
      // Core pulses with the beat
      const pulse = 1 + hit * 0.8 + Math.sin(time * 8) * 0.1;
      coreRef.current.scale.setScalar(pulse);
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1 + hit * 4;
    }

    if (armLRef.current && armRRef.current) {
      // Arms float and jerk on beat
      armLRef.current.position.y = 2.5 + Math.sin(time * 3) * 0.2 + hit * 0.5;
      armRRef.current.position.y = 2.5 + Math.cos(time * 3) * 0.2 + hit * 0.5;
      
      armLRef.current.rotation.z = Math.sin(time * 2) * 0.2 - hit * 0.8;
      armRRef.current.rotation.z = -Math.sin(time * 2) * 0.2 + hit * 0.8;
      
      armLRef.current.rotation.x = hit * 0.5;
      armRRef.current.rotation.x = hit * 0.5;
    }

    if (legLRef.current && legRRef.current) {
      // Legs float slightly
      legLRef.current.position.y = 0.8 + Math.sin(time * 2.5) * 0.1;
      legRRef.current.position.y = 0.8 + Math.cos(time * 2.5) * 0.1;
    }

    if (headRef.current) {
      // Head nods heavily
      headRef.current.rotation.x = Math.sin(time * 2) * 0.1 + hit * 0.4;
      headRef.current.position.y = 3.8 + hit * 0.3;
    }

    if (mouthRef.current) {
      // Mouth opens wide on beat
      mouthRef.current.scale.y = 1 + hit * 3;
    }
  });

  const mainColor = "#FBC02D"; // Yellow
  const darkColor = "#424242"; // Dark grey/black
  const glowColor = "#76FF03"; // Neon green
  const metalColor = "#9E9E9E"; // Silver/grey

  return (
    <group position={position} rotation={rotation} ref={groupRef} scale={1.2}>
      {/* Main Torso Block */}
      <mesh castShadow receiveShadow position={[0, 2, 0]}>
        <boxGeometry args={[2.2, 2.2, 1.5]} />
        <meshStandardMaterial color={mainColor} roughness={0.4} metalness={0.6} />
      </mesh>
      
      {/* Torso Inner Dark Area */}
      <mesh position={[0, 2, 0.76]}>
        <boxGeometry args={[1.8, 1.8, 0.1]} />
        <meshStandardMaterial color={darkColor} roughness={0.8} />
      </mesh>

      {/* Glowing Core (Orb) */}
      <mesh ref={coreRef} position={[0, 2, 0.85]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={1} />
      </mesh>

      {/* Core Ring */}
      <mesh position={[0, 2, 0.8]}>
        <torusGeometry args={[0.7, 0.1, 16, 32]} />
        <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 3.8, 0]}>
        {/* Neck joint */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.5]} />
          <meshStandardMaterial color={darkColor} />
        </mesh>
        
        {/* Head Box */}
        <mesh castShadow>
          <boxGeometry args={[1.6, 1.2, 1.2]} />
          <meshStandardMaterial color={mainColor} roughness={0.4} metalness={0.6} />
        </mesh>
        
        {/* Face Plate */}
        <mesh position={[0, 0, 0.61]}>
          <boxGeometry args={[1.4, 1, 0.1]} />
          <meshStandardMaterial color={darkColor} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.4, 0.2, 0.67]}>
          <circleGeometry args={[0.2, 32]} />
          <meshBasicMaterial color={glowColor} />
        </mesh>
        <mesh position={[0.4, 0.2, 0.67]}>
          <circleGeometry args={[0.2, 32]} />
          <meshBasicMaterial color={glowColor} />
        </mesh>

        {/* Mouth (Speaker-like) */}
        <mesh ref={mouthRef} position={[0, -0.2, 0.67]}>
          <planeGeometry args={[0.8, 0.15]} />
          <meshBasicMaterial color={glowColor} />
        </mesh>

        {/* Antennae */}
        <mesh position={[-0.6, 0.8, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.6]} />
          <meshStandardMaterial color={metalColor} />
        </mesh>
        <mesh position={[-0.7, 1.1, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshBasicMaterial color={glowColor} />
        </mesh>

        <mesh position={[0.6, 0.8, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.6]} />
          <meshStandardMaterial color={metalColor} />
        </mesh>
        <mesh position={[0.7, 1.1, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshBasicMaterial color={glowColor} />
        </mesh>
      </group>

      {/* Floating Left Arm */}
      <group ref={armLRef} position={[-1.8, 2.5, 0]}>
        {/* Shoulder Joint */}
        <mesh position={[0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.6]} />
          <meshStandardMaterial color={darkColor} />
        </mesh>
        {/* Upper Arm */}
        <mesh castShadow position={[0, -0.4, 0]}>
          <boxGeometry args={[0.6, 1, 0.6]} />
          <meshStandardMaterial color={mainColor} />
        </mesh>
        {/* Lower Arm / Hand */}
        <mesh castShadow position={[0, -1.2, 0]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Hand Glow */}
        <mesh position={[0, -1.61, 0]} rotation={[Math.PI/2, 0, 0]}>
          <planeGeometry args={[0.4, 0.4]} />
          <meshBasicMaterial color={glowColor} />
        </mesh>
      </group>

      {/* Floating Right Arm */}
      <group ref={armRRef} position={[1.8, 2.5, 0]}>
        {/* Shoulder Joint */}
        <mesh position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.6]} />
          <meshStandardMaterial color={darkColor} />
        </mesh>
        {/* Upper Arm */}
        <mesh castShadow position={[0, -0.4, 0]}>
          <boxGeometry args={[0.6, 1, 0.6]} />
          <meshStandardMaterial color={mainColor} />
        </mesh>
        {/* Lower Arm / Hand */}
        <mesh castShadow position={[0, -1.2, 0]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Hand Glow */}
        <mesh position={[0, -1.61, 0]} rotation={[Math.PI/2, 0, 0]}>
          <planeGeometry args={[0.4, 0.4]} />
          <meshBasicMaterial color={glowColor} />
        </mesh>
      </group>

      {/* Floating Left Leg */}
      <group ref={legLRef} position={[-0.6, 0.8, 0]}>
        {/* Hip Joint */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.4]} />
          <meshStandardMaterial color={darkColor} />
        </mesh>
        {/* Leg Box */}
        <mesh castShadow>
          <boxGeometry args={[0.8, 1, 0.8]} />
          <meshStandardMaterial color={mainColor} />
        </mesh>
        {/* Foot */}
        <mesh castShadow position={[0, -0.6, 0.2]}>
          <boxGeometry args={[1, 0.4, 1.2]} />
          <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Floating Right Leg */}
      <group ref={legRRef} position={[0.6, 0.8, 0]}>
        {/* Hip Joint */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.4]} />
          <meshStandardMaterial color={darkColor} />
        </mesh>
        {/* Leg Box */}
        <mesh castShadow>
          <boxGeometry args={[0.8, 1, 0.8]} />
          <meshStandardMaterial color={mainColor} />
        </mesh>
        {/* Foot */}
        <mesh castShadow position={[0, -0.6, 0.2]}>
          <boxGeometry args={[1, 0.4, 1.2]} />
          <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

    </group>
  );
}
