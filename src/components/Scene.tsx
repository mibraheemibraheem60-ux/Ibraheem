import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Sky, ContactShadows } from '@react-three/drei';
import { Islands } from './Islands';
import { BreedingStructure, Nursery } from './Structures';
import { useGameStore } from '../store/useGameStore';
import { RockMonster } from './monsters/RockMonster';
import { BassMonster } from './monsters/BassMonster';
import { JellyMonster } from './monsters/JellyMonster';
import { PlantMonster } from './monsters/PlantMonster';
import { WubboxMonster } from './monsters/WubboxMonster';
import { BirdMonster } from './monsters/BirdMonster';
import { FurcornMonster } from './monsters/FurcornMonster';
import { GemMine } from './structures/GemMine';
import { BushDecoration, TreeDecoration, RockDecoration } from './decorations/Decorations';

export function Scene() {
  const currentIsland = useGameStore((state) => state.currentIsland);
  const monsters = useGameStore((state) => state.monsters[currentIsland]);
  const structures = useGameStore((state) => state.structures[currentIsland]);
  const decorations = useGameStore((state) => state.decorations[currentIsland]);

  return (
    <Canvas shadows camera={{ position: [0, 10, 20], fov: 45 }}>
      {currentIsland === 'plant' && <color attach="background" args={['#87CEEB']} />}
      {currentIsland === 'cold' && <color attach="background" args={['#B3E5FC']} />}
      {currentIsland === 'wublin' && <color attach="background" args={['#263238']} />}
      {currentIsland === 'ethereal' && <color attach="background" args={['#311B92']} />}

      {currentIsland === 'plant' && <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />}
      {currentIsland === 'cold' && <Sky sunPosition={[100, 10, 100]} turbidity={0.5} rayleigh={2} />}
      
      <ambientLight intensity={currentIsland === 'wublin' || currentIsland === 'ethereal' ? 0.2 : 0.4} />
      
      <directionalLight
        castShadow
        position={[10, 20, 10]}
        intensity={currentIsland === 'wublin' ? 0.5 : 1.5}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      
      <Environment preset={currentIsland === 'wublin' ? 'night' : 'forest'} />

      <group position={[0, -1, 0]}>
        <Islands type={currentIsland} />
        
        {/* Default Structures */}
        <BreedingStructure />
        <Nursery />
        
        {/* Placed Structures */}
        {structures.map((structure) => {
          switch (structure.type) {
            case 'gem_mine':
              return <GemMine key={structure.id} {...structure} />;
            // fast_breeding is just a logical upgrade for now, could add visual later
            default:
              return null;
          }
        })}

        {/* Placed Decorations */}
        {decorations.map((decoration) => {
          switch (decoration.type) {
            case 'bush':
              return <BushDecoration key={decoration.id} {...decoration} />;
            case 'tree':
              return <TreeDecoration key={decoration.id} {...decoration} />;
            case 'rock_decor':
              return <RockDecoration key={decoration.id} {...decoration} />;
            default:
              return null;
          }
        })}
        
        {/* Monsters */}
        {monsters.map((monster) => {
          switch (monster.type) {
            case 'rock':
              return <RockMonster key={monster.id} {...monster} />;
            case 'bass':
              return <BassMonster key={monster.id} {...monster} />;
            case 'jelly':
              return <JellyMonster key={monster.id} {...monster} />;
            case 'plant':
              return <PlantMonster key={monster.id} {...monster} />;
            case 'wubbox':
              return <WubboxMonster key={monster.id} {...monster} />;
            case 'bird':
              return <BirdMonster key={monster.id} {...monster} />;
            case 'furcorn':
              return <FurcornMonster key={monster.id} {...monster} />;
            default:
              return null;
          }
        })}
        
        <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={20} blur={2} far={10} />
      </group>

      <OrbitControls
        makeDefault
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={5}
        maxDistance={40}
      />
    </Canvas>
  );
}
