import { useMemo } from 'react';
import * as THREE from 'three';

export function Island() {
  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(10, 12, 2, 64);
    geo.translate(0, -1, 0);
    return geo;
  }, []);

  const grassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#4CAF50',
      roughness: 0.8,
      metalness: 0.1,
    });
  }, []);

  const dirtMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#795548',
      roughness: 0.9,
      metalness: 0.0,
    });
  }, []);

  return (
    <group>
      {/* Main Island Base */}
      <mesh receiveShadow geometry={geometry} material={grassMaterial} />
      
      {/* Dirt Rim */}
      <mesh receiveShadow position={[0, -1.5, 0]}>
        <cylinderGeometry args={[12, 10, 1, 64]} />
        <primitive object={dirtMaterial} attach="material" />
      </mesh>

      {/* Decorative Trees/Mushrooms */}
      <group position={[-6, 0, -5]}>
        <mesh castShadow position={[0, 1, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 2]} />
          <meshStandardMaterial color="#5D4037" />
        </mesh>
        <mesh castShadow position={[0, 2.5, 0]}>
          <dodecahedronGeometry args={[1.5]} />
          <meshStandardMaterial color="#81C784" flatShading />
        </mesh>
      </group>

      <group position={[7, 0, -3]}>
        <mesh castShadow position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1]} />
          <meshStandardMaterial color="#FFF" />
        </mesh>
        <mesh castShadow position={[0, 1, 0]}>
          <sphereGeometry args={[0.8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#E53935" />
        </mesh>
      </group>
      
      <group position={[5, 0, 6]}>
        <mesh castShadow position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 1.6]} />
          <meshStandardMaterial color="#5D4037" />
        </mesh>
        <mesh castShadow position={[0, 2, 0]}>
          <dodecahedronGeometry args={[1.2]} />
          <meshStandardMaterial color="#81C784" flatShading />
        </mesh>
      </group>
    </group>
  );
}
