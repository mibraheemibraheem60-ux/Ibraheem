import * as THREE from 'three';

export function BushDecoration({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <dodecahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.9} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[0.4, 0.3, 0.4]}>
        <dodecahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color="#388E3C" roughness={0.9} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.4, 0.4, -0.2]}>
        <dodecahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial color="#1B5E20" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

export function TreeDecoration({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh castShadow receiveShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
        <meshStandardMaterial color="#5D4037" roughness={1} />
      </mesh>
      {/* Leaves */}
      <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
        <coneGeometry args={[1.5, 3, 8]} />
        <meshStandardMaterial color="#1B5E20" roughness={0.8} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 3.5, 0]}>
        <coneGeometry args={[1.2, 2.5, 8]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.8} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 4.5, 0]}>
        <coneGeometry args={[0.8, 2, 8]} />
        <meshStandardMaterial color="#388E3C" roughness={0.8} flatShading />
      </mesh>
    </group>
  );
}

export function RockDecoration({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.4, 0]} rotation={[0.2, 0.5, 0.1]}>
        <dodecahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#757575" roughness={0.9} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[0.5, 0.2, 0.3]} rotation={[-0.1, 0.2, 0.4]}>
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#616161" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}
