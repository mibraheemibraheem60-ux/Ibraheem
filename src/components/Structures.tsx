import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore, EggInstance } from '../store/useGameStore';
import { Html } from '@react-three/drei';

export function BreedingStructure() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const heartRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const openBreedingUI = useGameStore(state => state.openBreedingUI);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.x = time * 0.5;
      ringRef.current.rotation.y = time * 0.8;
    }
    if (heartRef.current) {
      heartRef.current.position.y = 2 + Math.sin(time * 3) * 0.2;
      heartRef.current.scale.setScalar(1 + Math.sin(time * 6) * 0.1);
    }
  });

  return (
    <group position={[-4, 0, -4]} 
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        openBreedingUI();
      }}
    >
      {/* Base */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1.5, 1.8, 1, 16]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      
      {/* Pedestals */}
      <mesh castShadow position={[-1, 1.5, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 1, 16]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
      <mesh castShadow position={[1, 1.5, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 1, 16]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>

      {/* Energy Ring */}
      <mesh ref={ringRef} position={[0, 2, 0]}>
        <torusGeometry args={[1, 0.1, 16, 32]} />
        <meshStandardMaterial color="#E91E63" emissive="#E91E63" emissiveIntensity={isHovered ? 1 : 0.5} />
      </mesh>

      {/* Heart Core */}
      <mesh ref={heartRef} position={[0, 2, 0]}>
        <octahedronGeometry args={[0.4]} />
        <meshStandardMaterial color="#F48FB1" emissive="#F48FB1" emissiveIntensity={1} />
      </mesh>

      {isHovered && (
        <Html position={[0, 3.5, 0]} center>
          <div className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg pointer-events-none whitespace-nowrap">
            Click to Breed
          </div>
        </Html>
      )}
    </group>
  );
}

export function Nursery() {
  const groupRef = useRef<THREE.Group>(null);
  const currentIsland = useGameStore(state => state.currentIsland);
  const eggs = useGameStore(state => state.eggs[currentIsland]);

  return (
    <group position={[4, 0, -4]} ref={groupRef}>
      {/* Base / Nest */}
      <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[1.5, 1.2, 0.5, 16]} />
        <meshStandardMaterial color="#FFB300" />
      </mesh>
      
      {/* Heat Lamp */}
      <mesh castShadow position={[0, 2, -1.2]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.2, 0.5, 16]} />
        <meshStandardMaterial color="#455A64" />
      </mesh>
      <mesh position={[0, 1.8, -1.1]} rotation={[0.4, 0, 0]}>
        <sphereGeometry args={[0.3]} />
        <meshBasicMaterial color="#FFCA28" />
      </mesh>

      {/* Render Eggs in Nursery */}
      {eggs.map((egg, index) => (
        <Egg key={egg.id} egg={egg} index={index} />
      ))}
    </group>
  );
}

function Egg({ egg, index }: { egg: EggInstance, index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const hatchEgg = useGameStore(state => state.hatchEgg);
  const [timeLeft, setTimeLeft] = useState(Math.max(0, egg.hatchTime - Date.now()));
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state) => {
    const remaining = Math.max(0, egg.hatchTime - Date.now());
    if (remaining !== timeLeft) setTimeLeft(remaining);

    if (meshRef.current) {
      // Wiggle animation
      const time = state.clock.getElapsedTime();
      const wiggleSpeed = remaining > 0 ? 2 : 10;
      const wiggleAmount = remaining > 0 ? 0.05 : 0.15;
      meshRef.current.rotation.z = Math.sin(time * wiggleSpeed) * wiggleAmount;
      meshRef.current.scale.setScalar(1 + Math.sin(time * wiggleSpeed * 2) * 0.02);
    }
  });

  const isReady = timeLeft === 0;

  // Determine color based on type
  const color = egg.type === 'rock' ? '#795548' : 
                egg.type === 'bass' ? '#E0F7FA' : 
                egg.type === 'jelly' ? '#00BCD4' : 
                egg.type === 'plant' ? '#4CAF50' : '#FFEB3B';

  return (
    <group position={[(index - 0.5) * 1.2, 0.8, 0]}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onClick={() => isReady && hatchEgg(egg.id)}
    >
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>

      {isHovered && (
        <Html position={[0, 1, 0]} center>
          <div className={`${isReady ? 'bg-green-500' : 'bg-gray-800'} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg pointer-events-none whitespace-nowrap`}>
            {isReady ? 'Click to Hatch!' : `Hatching: ${Math.ceil(timeLeft / 1000)}s`}
          </div>
        </Html>
      )}
    </group>
  );
}
