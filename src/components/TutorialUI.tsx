import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

export function TutorialUI() {
  const { tutorialStep, nextTutorialStep, completeTutorial } = useGameStore();

  if (tutorialStep === 0) return null;

  const steps = [
    {
      title: "Welcome to My Singing Monsters!",
      content: "Let's start by buying your first monster. Open the Market!",
      action: "Click the Market button below.",
      position: "bottom-32 left-1/2 -translate-x-1/2"
    },
    {
      title: "The Market",
      content: "Here you can buy Monsters, Structures, and Decorations.",
      action: "Buy a Noggin!",
      position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    },
    {
      title: "Great Job!",
      content: "Your monster is now on the island and generating coins.",
      action: "Click Play to hear it sing!",
      position: "top-24 left-4"
    },
    {
      title: "Breeding",
      content: "Once you have two monsters, you can breed them to create new ones!",
      action: "Click Finish to start playing.",
      position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    }
  ];

  const currentStepData = steps[tutorialStep - 1];

  if (!currentStepData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`absolute ${currentStepData.position} z-50 pointer-events-auto`}
      >
        <div className="bg-white border-4 border-blue-500 rounded-2xl p-6 shadow-2xl max-w-sm relative">
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-black text-xl border-4 border-white shadow-lg">
            {tutorialStep}
          </div>
          
          <h3 className="text-xl font-black text-gray-800 mb-2 mt-2">{currentStepData.title}</h3>
          <p className="text-gray-600 font-medium mb-4">{currentStepData.content}</p>
          
          <div className="bg-blue-50 rounded-xl p-3 border-2 border-blue-200 mb-4">
            <p className="text-blue-800 font-bold text-sm flex items-center gap-2">
              <ArrowRight size={16} />
              {currentStepData.action}
            </p>
          </div>

          <div className="flex justify-end">
            {tutorialStep !== 1 && tutorialStep !== 2 && tutorialStep !== 3 && tutorialStep < steps.length ? (
              <button
                onClick={nextTutorialStep}
                className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-xl font-black transition-transform hover:scale-105 active:scale-95 shadow-[0_4px_0_#1E3A8A]"
              >
                Next
              </button>
            ) : tutorialStep === steps.length ? (
              <button
                onClick={completeTutorial}
                className="bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded-xl font-black transition-transform hover:scale-105 active:scale-95 shadow-[0_4px_0_#1B5E20] flex items-center gap-2"
              >
                <Check size={20} />
                Finish
              </button>
            ) : null}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
