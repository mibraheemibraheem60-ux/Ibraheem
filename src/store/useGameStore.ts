import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type MonsterType = 'rock' | 'bass' | 'jelly' | 'plant' | 'wubbox' | 'bird' | 'furcorn';
export type IslandType = 'plant' | 'cold' | 'wublin' | 'ethereal';
export type StructureType = 'breeding' | 'nursery' | 'fast_breeding' | 'gem_mine';
export type DecorationType = 'bush' | 'tree' | 'rock_decor';

export interface MonsterInstance {
  id: string;
  type: MonsterType;
  position: [number, number, number];
  rotation: [number, number, number];
  level: number;
}

export interface EggInstance {
  id: string;
  type: MonsterType;
  position: [number, number, number];
  hatchTime: number; // timestamp when it will hatch
}

export interface StructureInstance {
  id: string;
  type: StructureType;
  position: [number, number, number];
}

export interface DecorationInstance {
  id: string;
  type: DecorationType;
  position: [number, number, number];
}

interface GameState {
  currentIsland: IslandType;
  monsters: Record<IslandType, MonsterInstance[]>;
  eggs: Record<IslandType, EggInstance[]>;
  structures: Record<IslandType, StructureInstance[]>;
  decorations: Record<IslandType, DecorationInstance[]>;
  coins: number;
  diamonds: number;
  isPlaying: boolean;
  selectedMonsterId: string | null;
  isBreedingUIOpen: boolean;
  isMarketOpen: boolean;
  tutorialStep: number;
  
  openBreedingUI: () => void;
  closeBreedingUI: () => void;
  openMarket: () => void;
  closeMarket: () => void;
  nextTutorialStep: () => void;
  completeTutorial: () => void;
  
  setIsland: (island: IslandType) => void;
  addMonster: (type: MonsterType, position: [number, number, number], costCoins?: number, costDiamonds?: number) => void;
  removeMonster: (id: string) => void;
  addStructure: (type: StructureType, position: [number, number, number], costCoins?: number, costDiamonds?: number) => void;
  addDecoration: (type: DecorationType, position: [number, number, number], costCoins?: number, costDiamonds?: number) => void;
  breedMonsters: (type1: MonsterType, type2: MonsterType) => void;
  hatchEgg: (eggId: string) => void;
  selectMonster: (id: string | null) => void;
  togglePlay: () => void;
  addCoins: (amount: number) => void;
  addDiamonds: (amount: number) => void;
}

const initialMonsters: Record<IslandType, MonsterInstance[]> = {
  plant: [
    { id: uuidv4(), type: 'rock', position: [-2, 0, 2], rotation: [0, Math.PI / 4, 0], level: 1 },
  ],
  cold: [],
  wublin: [],
  ethereal: [],
};

const initialStructures: Record<IslandType, StructureInstance[]> = {
  plant: [
    { id: uuidv4(), type: 'breeding', position: [-6, 0, -6] },
    { id: uuidv4(), type: 'nursery', position: [6, 0, -6] },
  ],
  cold: [
    { id: uuidv4(), type: 'breeding', position: [-6, 0, -6] },
    { id: uuidv4(), type: 'nursery', position: [6, 0, -6] },
  ],
  wublin: [],
  ethereal: [],
};

export const useGameStore = create<GameState>((set, get) => ({
  currentIsland: 'plant',
  monsters: initialMonsters,
  eggs: { plant: [], cold: [], wublin: [], ethereal: [] },
  structures: initialStructures,
  decorations: { plant: [], cold: [], wublin: [], ethereal: [] },
  coins: 500,
  diamonds: 50,
  isPlaying: false,
  selectedMonsterId: null,
  
  isBreedingUIOpen: false,
  isMarketOpen: false,
  tutorialStep: 1, // 1 = start, 2 = buy monster, 3 = play, 4 = breed, 999 = done
  
  openBreedingUI: () => set({ isBreedingUIOpen: true }),
  closeBreedingUI: () => set({ isBreedingUIOpen: false }),
  openMarket: () => set({ isMarketOpen: true }),
  closeMarket: () => set({ isMarketOpen: false }),
  nextTutorialStep: () => set((state) => ({ tutorialStep: state.tutorialStep + 1 })),
  completeTutorial: () => set({ tutorialStep: 999 }),
  
  setIsland: (island) => set({ currentIsland: island }),
  
  addMonster: (type, position, costCoins = 0, costDiamonds = 0) =>
    set((state) => {
      const island = state.currentIsland;
      if (state.coins < costCoins || state.diamonds < costDiamonds) return state;
      
      return {
        monsters: {
          ...state.monsters,
          [island]: [
            ...state.monsters[island],
            { id: uuidv4(), type, position, rotation: [0, Math.random() * Math.PI * 2, 0], level: 1 },
          ],
        },
        coins: state.coins - costCoins,
        diamonds: state.diamonds - costDiamonds,
        tutorialStep: state.tutorialStep === 2 ? 3 : state.tutorialStep,
      };
    }),
    
  addStructure: (type, position, costCoins = 0, costDiamonds = 0) =>
    set((state) => {
      const island = state.currentIsland;
      if (state.coins < costCoins || state.diamonds < costDiamonds) return state;
      return {
        structures: {
          ...state.structures,
          [island]: [...state.structures[island], { id: uuidv4(), type, position }],
        },
        coins: state.coins - costCoins,
        diamonds: state.diamonds - costDiamonds,
      };
    }),

  addDecoration: (type, position, costCoins = 0, costDiamonds = 0) =>
    set((state) => {
      const island = state.currentIsland;
      if (state.coins < costCoins || state.diamonds < costDiamonds) return state;
      return {
        decorations: {
          ...state.decorations,
          [island]: [...state.decorations[island], { id: uuidv4(), type, position }],
        },
        coins: state.coins - costCoins,
        diamonds: state.diamonds - costDiamonds,
      };
    }),
    
  removeMonster: (id) =>
    set((state) => {
      const island = state.currentIsland;
      return {
        monsters: {
          ...state.monsters,
          [island]: state.monsters[island].filter((m) => m.id !== id),
        },
      };
    }),

  breedMonsters: (type1, type2) => 
    set((state) => {
      const island = state.currentIsland;
      const resultType = Math.random() > 0.5 ? type1 : type2;
      
      // Check if we have a fast breeding structure
      const hasFastBreeding = state.structures[island].some(s => s.type === 'fast_breeding');
      const hatchDuration = hasFastBreeding ? 2000 : 5000; // 2s vs 5s for demo
      
      const newEgg: EggInstance = {
        id: uuidv4(),
        type: resultType,
        position: [6, 0.5, -6], // Nursery position
        hatchTime: Date.now() + hatchDuration,
      };
      return {
        eggs: {
          ...state.eggs,
          [island]: [...state.eggs[island], newEgg]
        }
      };
    }),

  hatchEgg: (eggId) =>
    set((state) => {
      const island = state.currentIsland;
      const egg = state.eggs[island].find(e => e.id === eggId);
      if (!egg || Date.now() < egg.hatchTime) return state;

      const newMonster: MonsterInstance = {
        id: uuidv4(),
        type: egg.type,
        position: [(Math.random() - 0.5) * 12, 0, (Math.random() - 0.5) * 12],
        rotation: [0, Math.random() * Math.PI * 2, 0],
        level: 1
      };

      return {
        eggs: {
          ...state.eggs,
          [island]: state.eggs[island].filter(e => e.id !== eggId)
        },
        monsters: {
          ...state.monsters,
          [island]: [...state.monsters[island], newMonster]
        }
      };
    }),
    
  selectMonster: (id) => set({ selectedMonsterId: id }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
  addDiamonds: (amount) => set((state) => ({ diamonds: state.diamonds + amount })),
}));
