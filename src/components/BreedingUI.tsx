import { useState } from 'react';
import { useGameStore, MonsterType } from '../store/useGameStore';
import { X, Heart } from 'lucide-react';

const MONSTER_INFO: Record<MonsterType, { name: string; color: string }> = {
  rock: { name: 'Noggin', color: 'bg-stone-500' },
  bass: { name: 'Mammott', color: 'bg-white' },
  jelly: { name: 'Toe Jammer', color: 'bg-cyan-400' },
  plant: { name: 'Potbelly', color: 'bg-green-500' },
  wubbox: { name: 'Wubbox', color: 'bg-yellow-400' },
  bird: { name: 'Tweedle', color: 'bg-pink-300' },
  furcorn: { name: 'Furcorn', color: 'bg-green-300' },
};

export function BreedingUI() {
  const { isBreedingUIOpen, closeBreedingUI, currentIsland, monsters, breedMonsters } = useGameStore();
  const [selectedParent1, setSelectedParent1] = useState<string | null>(null);
  const [selectedParent2, setSelectedParent2] = useState<string | null>(null);

  if (!isBreedingUIOpen) return null;

  const islandMonsters = monsters[currentIsland];
  const uniqueMonsterTypes = Array.from(new Set(islandMonsters.map(m => m.type)));

  const handleSelect = (type: MonsterType) => {
    if (selectedParent1 === type) {
      setSelectedParent1(null);
    } else if (selectedParent2 === type) {
      setSelectedParent2(null);
    } else if (!selectedParent1) {
      setSelectedParent1(type);
    } else if (!selectedParent2) {
      setSelectedParent2(type);
    } else {
      // Replace parent 2 if both are selected
      setSelectedParent2(type);
    }
  };

  const handleBreed = () => {
    if (selectedParent1 && selectedParent2) {
      breedMonsters(selectedParent1 as MonsterType, selectedParent2 as MonsterType);
      closeBreedingUI();
      setSelectedParent1(null);
      setSelectedParent2(null);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center pointer-events-auto backdrop-blur-sm">
      <div className="bg-[#8B5A2B] border-8 border-[#5C3A21] rounded-3xl p-6 w-full max-w-2xl shadow-2xl relative">
        <button 
          onClick={closeBreedingUI}
          className="absolute -top-4 -right-4 bg-red-500 border-4 border-red-700 text-white p-2 rounded-full hover:bg-red-400 transition-transform hover:scale-110 shadow-lg"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-black text-[#FFD54F] text-center mb-6 uppercase tracking-widest drop-shadow-md">
          Breeding Structure
        </h2>

        <div className="flex justify-center items-center gap-8 mb-8">
          {/* Parent 1 */}
          <div className="w-32 h-32 bg-[#D7CCC8] border-4 border-[#A1887F] rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
            {selectedParent1 ? (
              <div className={`w-24 h-24 rounded-full ${MONSTER_INFO[selectedParent1 as MonsterType].color} border-4 border-black/20 shadow-inner`} />
            ) : (
              <span className="text-[#8D6E63] font-black text-4xl opacity-50">?</span>
            )}
            {selectedParent1 && (
              <div className="absolute bottom-0 left-0 w-full bg-black/40 text-white text-xs font-bold text-center py-1">
                {MONSTER_INFO[selectedParent1 as MonsterType].name}
              </div>
            )}
          </div>

          <Heart size={48} className="text-pink-500 animate-pulse drop-shadow-lg" fill="currentColor" />

          {/* Parent 2 */}
          <div className="w-32 h-32 bg-[#D7CCC8] border-4 border-[#A1887F] rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
            {selectedParent2 ? (
              <div className={`w-24 h-24 rounded-full ${MONSTER_INFO[selectedParent2 as MonsterType].color} border-4 border-black/20 shadow-inner`} />
            ) : (
              <span className="text-[#8D6E63] font-black text-4xl opacity-50">?</span>
            )}
            {selectedParent2 && (
              <div className="absolute bottom-0 left-0 w-full bg-black/40 text-white text-xs font-bold text-center py-1">
                {MONSTER_INFO[selectedParent2 as MonsterType].name}
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#5C3A21] rounded-2xl p-4 mb-6">
          <h3 className="text-[#FFD54F] font-bold text-center mb-3">Available Monsters on Island</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {uniqueMonsterTypes.length === 0 ? (
              <p className="text-[#D7CCC8] italic">No monsters available to breed.</p>
            ) : (
              uniqueMonsterTypes.map((type) => {
                const isSelected = selectedParent1 === type || selectedParent2 === type;
                return (
                  <button
                    key={type}
                    onClick={() => handleSelect(type)}
                    className={`w-20 h-20 rounded-xl border-4 transition-all flex flex-col items-center justify-center gap-1 ${
                      isSelected 
                        ? 'bg-pink-500 border-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.6)] scale-105' 
                        : 'bg-[#8D6E63] border-[#4E342E] hover:bg-[#A1887F]'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full ${MONSTER_INFO[type].color} border-2 border-black/20`} />
                    <span className="text-white text-[10px] font-bold truncate w-full text-center px-1">
                      {MONSTER_INFO[type].name}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <button
          onClick={handleBreed}
          disabled={!selectedParent1 || !selectedParent2}
          className={`w-full py-4 rounded-2xl font-black text-2xl uppercase tracking-wider transition-all border-4 ${
            selectedParent1 && selectedParent2
              ? 'bg-pink-500 border-pink-700 text-white hover:bg-pink-400 active:scale-95 shadow-[0_6px_0_#880E4F]'
              : 'bg-gray-500 border-gray-700 text-gray-300 opacity-50 cursor-not-allowed'
          }`}
        >
          Breed!
        </button>
      </div>
    </div>
  );
}
