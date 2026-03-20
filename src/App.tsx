import { useEffect, useState } from 'react';
import { Scene } from './components/Scene';
import { useGameStore, MonsterType, IslandType } from './store/useGameStore';
import { audioManager } from './audio/AudioManager';
import { Play, Pause, Coins, Music, Volume2, VolumeX, Map, Zap, Gem } from 'lucide-react';
import { BreedingUI } from './components/BreedingUI';
import { MarketUI } from './components/MarketUI';
import { TutorialUI } from './components/TutorialUI';

export default function App() {
  const { isPlaying, togglePlay, coins, addMonster, currentIsland, setIsland, addCoins, monsters, openMarket, diamonds } = useGameStore();
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [mutedTracks, setMutedTracks] = useState<Record<string, boolean>>({});

  const currentMonsters = monsters[currentIsland];

  // Coin generation
  useEffect(() => {
    const interval = setInterval(() => {
      let totalCoinsToGenerate = 0;
      Object.values(monsters).forEach(islandMonsters => {
        islandMonsters.forEach(m => {
          totalCoinsToGenerate += m.type === 'wubbox' ? 10 : 1;
        });
      });
      if (totalCoinsToGenerate > 0) {
        addCoins(totalCoinsToGenerate);
      }
    }, 2000); // Every 2 seconds
    return () => clearInterval(interval);
  }, [monsters, addCoins]);

  useEffect(() => {
    if (isAudioInitialized) {
      const activeTypes = Array.from(new Set(currentMonsters.map(m => m.type)));
      audioManager.updateActiveMonsters(activeTypes, mutedTracks);
    }
  }, [currentMonsters, mutedTracks, isAudioInitialized]);

  const handlePlayToggle = async () => {
    if (!isAudioInitialized) {
      await audioManager.init();
      setIsAudioInitialized(true);
    }
    audioManager.togglePlay();
    togglePlay();
    if (useGameStore.getState().tutorialStep === 3) {
      useGameStore.getState().nextTutorialStep();
    }
  };

  const handleBuyMonster = (type: MonsterType) => {
    const cost = type === 'wubbox' ? 1000 : 100;
    if (coins >= cost) {
      const x = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 8;
      addMonster(type, [x, 0, z]);
    }
  };

  const toggleMute = (type: string) => {
    setMutedTracks((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const islands: { id: IslandType; name: string; color: string }[] = [
    { id: 'plant', name: 'Plant Island', color: 'bg-green-600' },
    { id: 'cold', name: 'Cold Island', color: 'bg-blue-500' },
    { id: 'wublin', name: 'Wublin Island', color: 'bg-gray-800' },
    { id: 'ethereal', name: 'Ethereal Workshop', color: 'bg-purple-700' },
  ];

  return (
    <div className="w-full h-screen bg-sky-300 relative overflow-hidden font-sans select-none">
      <Scene />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none z-10">
        <div className="bg-[#8B5A2B] border-4 border-[#5C3A21] shadow-[0_6px_0_#3E2723] p-3 rounded-2xl pointer-events-auto flex items-center gap-4">
          <button
            onClick={handlePlayToggle}
            className="w-14 h-14 bg-green-500 border-4 border-green-700 hover:bg-green-400 text-white rounded-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-[0_4px_0_#1B5E20]"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} fill="currentColor" />}
          </button>
          <div className="flex flex-col pr-2">
            <span className="text-xs font-black text-[#FFD54F] uppercase tracking-widest drop-shadow-md">Song Status</span>
            <span className="text-lg font-black text-white drop-shadow-md">{isPlaying ? 'PLAYING' : 'PAUSED'}</span>
          </div>
        </div>

        {/* Island Selector */}
        <div className="bg-[#8B5A2B] border-4 border-[#5C3A21] shadow-[0_6px_0_#3E2723] p-2 rounded-2xl pointer-events-auto flex gap-2">
          {islands.map((island) => (
            <button
              key={island.id}
              onClick={() => setIsland(island.id)}
              className={`px-4 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 border-4 ${
                currentIsland === island.id
                  ? `${island.color} border-white/40 text-white shadow-[0_4px_0_rgba(0,0,0,0.3)] scale-105`
                  : 'bg-[#D7CCC8] border-[#A1887F] text-[#4E342E] hover:bg-[#EFEBE9] shadow-[0_4px_0_#8D6E63]'
              }`}
            >
              <Map size={18} />
              {island.name}
            </button>
          ))}
        </div>

        <div className="bg-[#FFC107] border-4 border-[#FF8F00] shadow-[0_6px_0_#E65100] p-3 rounded-2xl pointer-events-auto flex items-center gap-3">
          <Coins size={24} className="text-[#E65100]" />
          <span className="font-black text-[#E65100] text-2xl drop-shadow-sm">{coins}</span>
        </div>
        <div className="bg-purple-400 border-4 border-purple-600 shadow-[0_6px_0_#4A148C] p-3 rounded-2xl pointer-events-auto flex items-center gap-3 ml-2">
          <Gem size={24} className="text-purple-800" />
          <span className="font-black text-purple-900 text-2xl drop-shadow-sm">{diamonds}</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto flex gap-4">
        <button
          onClick={() => {
            useGameStore.getState().openBreedingUI();
            if (useGameStore.getState().tutorialStep === 4) {
              useGameStore.getState().completeTutorial();
            }
          }}
          className="bg-[#8B5A2B] border-4 border-[#5C3A21] shadow-[0_8px_0_#3E2723] px-8 py-4 rounded-3xl font-black text-2xl text-[#FFD54F] uppercase tracking-widest hover:bg-[#A06B32] transition-transform hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          Breed
        </button>
        <button
          onClick={() => {
            openMarket();
            if (useGameStore.getState().tutorialStep === 1) {
              useGameStore.getState().nextTutorialStep();
            }
          }}
          className="bg-[#8B5A2B] border-4 border-[#5C3A21] shadow-[0_8px_0_#3E2723] px-8 py-4 rounded-3xl font-black text-2xl text-[#FFD54F] uppercase tracking-widest hover:bg-[#A06B32] transition-transform hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          <Coins size={28} />
          Market
        </button>
      </div>

      {/* Side Bar - Mixer */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-[#8B5A2B] border-4 border-[#5C3A21] shadow-[0_6px_0_#3E2723] p-4 rounded-3xl pointer-events-auto flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest text-center mb-2 drop-shadow-md">Mixer</h3>
        {['rock', 'bass', 'jelly', 'plant', 'bird', 'furcorn', 'wubbox'].map((type) => (
          <button
            key={type}
            onClick={() => toggleMute(type)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border-4 ${
              mutedTracks[type] 
                ? 'bg-[#D7CCC8] border-[#A1887F] text-[#8D6E63] shadow-[0_4px_0_#8D6E63]' 
                : 'bg-green-500 border-green-700 text-white shadow-[0_4px_0_#1B5E20]'
            }`}
            title={`Mute ${type}`}
          >
            {mutedTracks[type] ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        ))}
      </div>

      <BreedingUI />
      <MarketUI />
      <TutorialUI />
    </div>
  );
}
