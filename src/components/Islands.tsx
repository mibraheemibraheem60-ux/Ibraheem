import { useMemo } from 'react';
import * as THREE from 'three';
import { IslandType } from '../store/useGameStore';

export function Islands({ type }: { type: IslandType }) {
  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(12, 10, 3, 64);
    geo.translate(0, -1.5, 0);
    return geo;
  }, []);

  const materials = useMemo(() => {
    return {
      plant: {
        top: new THREE.MeshStandardMaterial({ color: '#4CAF50', roughness: 0.8 }),
        base: new THREE.MeshStandardMaterial({ color: '#5D4037', roughness: 1 }), // Darker dirt
      },
      cold: {
        top: new THREE.MeshStandardMaterial({ color: '#E0F7FA', roughness: 0.4 }),
        base: new THREE.MeshStandardMaterial({ color: '#78909C', roughness: 0.8 }), // Rocky ice
      },
      wublin: {
        top: new THREE.MeshStandardMaterial({ color: '#424242', roughness: 0.9 }),
        base: new THREE.MeshStandardMaterial({ color: '#212121', roughness: 1 }),
      },
      ethereal: {
        top: new THREE.MeshPhysicalMaterial({ color: '#9C27B0', transmission: 0.5, roughness: 0.2 }),
        base: new THREE.MeshStandardMaterial({ color: '#4A148C', roughness: 0.5 }),
      }
    };
  }, []);

  return (
    <group>
      {/* Main Island Top */}
      <mesh receiveShadow position={[0, -0.2, 0]}>
        <cylinderGeometry args={[12, 12.2, 0.4, 64]} />
        <primitive object={materials[type].top} attach="material" />
      </mesh>
      
      {/* Main Island Base (Chunky) */}
      <mesh receiveShadow geometry={geometry} material={materials[type].base} />

      {/* Floating rocks/chunks underneath */}
      <group position={[0, -3.5, 0]}>
        <mesh receiveShadow position={[-4, -1, 2]} rotation={[0.2, 0.5, 0.1]}>
          <dodecahedronGeometry args={[2, 0]} />
          <primitive object={materials[type].base} attach="material" />
        </mesh>
        <mesh receiveShadow position={[3, -2, -3]} rotation={[-0.2, 0.1, 0.4]}>
          <dodecahedronGeometry args={[2.5, 0]} />
          <primitive object={materials[type].base} attach="material" />
        </mesh>
        <mesh receiveShadow position={[1, -1.5, 4]} rotation={[0.5, -0.2, 0.1]}>
          <dodecahedronGeometry args={[1.5, 0]} />
          <primitive object={materials[type].base} attach="material" />
        </mesh>
      </group>

      {/* Decorative Props based on Island Type */}
      {type === 'plant' && (
        <>
          {/* Big Tree */}
          <group position={[-7, 0, -6]}>
            <mesh castShadow position={[0, 2, 0]}>
              <cylinderGeometry args={[0.4, 0.6, 4, 8]} />
              <meshStandardMaterial color="#4E342E" roughness={1} />
            </mesh>
            <mesh castShadow position={[0, 4.5, 0]}>
              <dodecahedronGeometry args={[2.5, 1]} />
              <meshStandardMaterial color="#2E7D32" flatShading roughness={0.8} />
            </mesh>
          </group>
          {/* Mushrooms */}
          <group position={[8, 0, -4]}>
            <mesh castShadow position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.15, 0.2, 1]} />
              <meshStandardMaterial color="#FFF3E0" />
            </mesh>
            <mesh castShadow position={[0, 1, 0]}>
              <sphereGeometry args={[1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#D32F2F" />
            </mesh>
            {/* Spots */}
            <mesh position={[0, 1.9, 0]}>
              <circleGeometry args={[0.2, 16]} />
              <meshBasicMaterial color="white" />
            </mesh>
          </group>
        </>
      )}

      {type === 'cold' && (
        <>
          {/* Ice Spikes */}
          <group position={[-6, 0, -6]}>
            <mesh castShadow position={[0, 2, 0]}>
              <coneGeometry args={[1.5, 4, 6]} />
              <meshPhysicalMaterial color="#B2EBF2" transmission={0.9} roughness={0.1} ior={1.3} thickness={2} />
            </mesh>
            <mesh castShadow position={[1.5, 1.5, 1]} rotation={[0.2, 0, -0.2]}>
              <coneGeometry args={[1, 3, 6]} />
              <meshPhysicalMaterial color="#80DEEA" transmission={0.9} roughness={0.1} ior={1.3} thickness={2} />
            </mesh>
          </group>
          {/* Snowman/Snow pile */}
          <group position={[7, 0, 5]}>
            <mesh castShadow position={[0, 0.8, 0]}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
            </mesh>
            <mesh castShadow position={[0, 2, 0]}>
              <sphereGeometry args={[0.7, 16, 16]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
            </mesh>
          </group>
        </>
      )}

      {type === 'wublin' && (
        <>
          {/* Electric Coils / Statues */}
          <group position={[-7, 0, 6]}>
            <mesh castShadow position={[0, 1.5, 0]}>
              <cylinderGeometry args={[0.5, 0.8, 3, 8]} />
              <meshStandardMaterial color="#616161" roughness={0.9} metalness={0.2} />
            </mesh>
            <mesh position={[0, 1.5, 0]}>
              <cylinderGeometry args={[0.6, 0.6, 0.2, 16]} />
              <meshStandardMaterial color="#FFEB3B" emissive="#FFEB3B" emissiveIntensity={1} />
            </mesh>
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.55, 0.55, 0.2, 16]} />
              <meshStandardMaterial color="#FFEB3B" emissive="#FFEB3B" emissiveIntensity={1} />
            </mesh>
          </group>
        </>
      )}

      {type === 'ethereal' && (
        <>
          {/* Floating crystals */}
          <group position={[6, 3, -6]}>
            <mesh castShadow rotation={[0.5, 0.5, 0]}>
              <octahedronGeometry args={[1.5, 0]} />
              <meshPhysicalMaterial color="#E1BEE7" emissive="#9C27B0" emissiveIntensity={0.5} transmission={0.8} roughness={0.1} />
            </mesh>
          </group>
          <group position={[-6, 2, 5]}>
            <mesh castShadow rotation={[-0.5, 0.2, 0.4]}>
              <octahedronGeometry args={[1, 0]} />
              <meshPhysicalMaterial color="#B39DDB" emissive="#673AB7" emissiveIntensity={0.5} transmission={0.8} roughness={0.1} />
            </mesh>
          </group>
        </>
      )}
    </group>
  );
}
