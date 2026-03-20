import { useGameStore, MonsterType, StructureType, DecorationType } from '../store/useGameStore';
import { X, Coins, Gem } from 'lucide-react';
import { useState } from 'react';

const MONSTERS: { type: MonsterType; name: string; costCoins: number; costDiamonds: number; color: string }[] = [
  { type: 'rock', name: 'Noggin', costCoins: 100, costDiamonds: 0, color: 'bg-stone-500' },
  { type: 'bass', name: 'Mammott', costCoins: 100, costDiamonds: 0, color: 'bg-white' },
  { type: 'jelly', name: 'Toe Jammer', costCoins: 100, costDiamonds: 0, color: 'bg-cyan-400' },
  { type: 'plant', name: 'Potbelly', costCoins: 100, costDiamonds: 0, color: 'bg-green-500' },
  { type: 'bird', name: 'Tweedle', costCoins: 200, costDiamonds: 0, color: 'bg-pink-300' },
  { type: 'furcorn', name: 'Furcorn', costCoins: 500, costDiamonds: 0, color: 'bg-green-300' },
  { type: 'wubbox', name: 'Wubbox', costCoins: 10000, costDiamonds: 0, color: 'bg-yellow-400' },
];

const STRUCTURES: { type: StructureType; name: string; costCoins: number; costDiamonds: number; color: string }[] = [
  { type: 'fast_breeding', name: 'Fast Breeding', costCoins: 0, costDiamonds: 120, color: 'bg-pink-600' },
  { type: 'gem_mine', name: 'Gem Mine', costCoins: 5000, costDiamonds: 0, color: 'bg-purple-500' },
];

const DECORATIONS: { type: DecorationType; name: string; costCoins: number; costDiamonds: number; color: string }[] = [
  { type: 'bush', name: 'Bush', costCoins: 50, costDiamonds: 0, color: 'bg-green-700' },
  { type: 'tree', name: 'Tree', costCoins: 150, costDiamonds: 0, color: 'bg-green-800' },
  { type: 'rock_decor', name: 'Rock', costCoins: 50, costDiamonds: 0, color: 'bg-gray-500' },
];

export function MarketUI() {
  const { isMarketOpen, closeMarket, coins, diamonds, addMonster, addStructure, addDecoration, tutorialStep, nextTutorialStep } = useGameStore();
  const [activeTab, setActiveTab] = useState<'monsters' | 'structures' | 'decorations'>('monsters');

  if (!isMarketOpen) return null;

  const handleBuyMonster = (item: typeof MONSTERS[0]) => {
    if (coins >= item.costCoins && diamonds >= item.costDiamonds) {
      const x = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 12;
      addMonster(item.type, [x, 0, z], item.costCoins, item.costDiamonds);
      closeMarket();
      // tutorialStep is handled in useGameStore
    }
  };

  const handleBuyStructure = (item: typeof STRUCTURES[0]) => {
    if (coins >= item.costCoins && diamonds >= item.costDiamonds) {
      const x = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 12;
      addStructure(item.type, [x, 0, z], item.costCoins, item.costDiamonds);
      closeMarket();
    }
  };

  const handleBuyDecoration = (item: typeof DECORATIONS[0]) => {
    if (coins >= item.costCoins && diamonds >= item.costDiamonds) {
      const x = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 12;
      addDecoration(item.type, [x, 0, z], item.costCoins, item.costDiamonds);
      closeMarket();
    }
  };

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center pointer-events-auto backdrop-blur-sm">
      <div className="bg-[#8B5A2B] border-8 border-[#5C3A21] rounded-3xl w-full max-w-4xl h-[80vh] shadow-2xl relative flex flex-col">
        <button 
          onClick={closeMarket}
          className="absolute -top-4 -right-4 bg-red-500 border-4 border-red-700 text-white p-2 rounded-full hover:bg-red-400 transition-transform hover:scale-110 shadow-lg z-10"
        >
          <X size={24} />
        </button>

        <div className="flex justify-between items-center p-6 border-b-4 border-[#5C3A21]">
          <h2 className="text-4xl font-black text-[#FFD54F] uppercase tracking-widest drop-shadow-md">
            Market
          </h2>
          <div className="flex gap-4">
            <div className="bg-[#FFC107] border-4 border-[#FF8F00] shadow-[0_4px_0_#E65100] px-4 py-2 rounded-xl flex items-center gap-2">
              <Coins size={20} className="text-[#E65100]" />
              <span className="font-black text-[#E65100] text-xl">{coins}</span>
            </div>
            <div className="bg-purple-400 border-4 border-purple-600 shadow-[0_4px_0_#4A148C] px-4 py-2 rounded-xl flex items-center gap-2">
              <Gem size={20} className="text-purple-800" />
              <span className="font-black text-purple-900 text-xl">{diamonds}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 p-4 bg-[#5C3A21]">
          {(['monsters', 'structures', 'decorations'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl font-black text-lg uppercase tracking-wider transition-all border-4 ${
                activeTab === tab
                  ? 'bg-[#FFD54F] border-[#FF8F00] text-[#E65100] shadow-[0_4px_0_#E65100] scale-105'
                  : 'bg-[#8D6E63] border-[#4E342E] text-[#D7CCC8] hover:bg-[#A1887F]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activeTab === 'monsters' && MONSTERS.map(item => (
              <MarketItem 
                key={item.type} 
                item={item} 
                canAfford={coins >= item.costCoins && diamonds >= item.costDiamonds}
                onBuy={() => handleBuyMonster(item)}
              />
            ))}
            {activeTab === 'structures' && STRUCTURES.map(item => (
              <MarketItem 
                key={item.type} 
                item={item} 
                canAfford={coins >= item.costCoins && diamonds >= item.costDiamonds}
                onBuy={() => handleBuyStructure(item)}
              />
            ))}
            {activeTab === 'decorations' && DECORATIONS.map(item => (
              <MarketItem 
                key={item.type} 
                item={item} 
                canAfford={coins >= item.costCoins && diamonds >= item.costDiamonds}
                onBuy={() => handleBuyDecoration(item)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketItem({ item, canAfford, onBuy }: { item: any, canAfford: boolean, onBuy: () => void }) {
  return (
    <div className={`bg-[#D7CCC8] border-4 border-[#A1887F] rounded-2xl p-4 flex flex-col items-center gap-3 shadow-[0_6px_0_#8D6E63] ${!canAfford && 'opacity-70'}`}>
      <div className={`w-24 h-24 rounded-full ${item.color} border-4 border-black/20 shadow-inner flex items-center justify-center`}>
        {/* Placeholder for icon */}
      </div>
      <h3 className="font-black text-[#4E342E] text-lg text-center">{item.name}</h3>
      <div className="flex flex-col gap-1 w-full">
        {item.costCoins > 0 && (
          <div className="flex items-center justify-center gap-1 bg-[#FFC107]/20 rounded-lg py-1">
            <Coins size={14} className="text-[#E65100]" />
            <span className="font-black text-[#E65100] text-sm">{item.costCoins}</span>
          </div>
        )}
        {item.costDiamonds > 0 && (
          <div className="flex items-center justify-center gap-1 bg-purple-400/20 rounded-lg py-1">
            <Gem size={14} className="text-purple-800" />
            <span className="font-black text-purple-900 text-sm">{item.costDiamonds}</span>
          </div>
        )}
      </div>
      <button
        onClick={onBuy}
        disabled={!canAfford}
        className={`w-full py-2 rounded-xl font-black uppercase transition-all border-4 mt-2 ${
          canAfford
            ? 'bg-green-500 border-green-700 text-white hover:bg-green-400 active:translate-y-1 active:shadow-none shadow-[0_4px_0_#1B5E20]'
            : 'bg-gray-400 border-gray-600 text-gray-200 cursor-not-allowed'
        }`}
      >
        Buy
      </button>
    </div>
  );
}
