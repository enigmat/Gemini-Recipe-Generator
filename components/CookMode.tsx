import React, { useState, useEffect, useRef } from 'react';
import { Recipe } from '../types';
import XIcon from './icons/XIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import { formatIngredient, formatInstruction } from '../utils/recipeUtils';

// A WakeLockSentinel object is the return value of navigator.wakeLock.request().
// It can be used to release the wake lock and to respond to release events.
// This interface is provided for type safety as it may not be in default TS libs.
interface WakeLockSentinel extends EventTarget {
  release(): Promise<void>;
  readonly released: boolean;
  type: 'screen';
}

interface CookModeProps {
  recipe: Recipe;
  onExit: () => void;
  measurementSystem: 'metric' | 'us';
}

const CookMode: React.FC<CookModeProps> = ({ recipe, onExit, measurementSystem }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    // Function to acquire the screen wake lock
    const acquireLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          // Type assertion to access the wakeLock API
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
          console.log('Screen Wake Lock is active.');
          // Re-acquire the lock if it's released by the system
          wakeLockRef.current.addEventListener('release', () => {
            console.log('Screen Wake Lock was released by the system.');
          });
        } catch (err: any) {
          console.error(`Could not acquire screen wake lock: ${err.name}, ${err.message}`);
        }
      } else {
        console.warn('Screen Wake Lock API is not supported by this browser.');
      }
    };

    // Function to release the screen wake lock
    const releaseLock = async () => {
      if (wakeLockRef.current && !wakeLockRef.current.released) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log('Screen Wake Lock released.');
      }
    };

    // Re-acquire the lock when the page becomes visible again
    const handleVisibilityChange = () => {
      if (wakeLockRef.current && document.visibilityState === 'visible') {
        acquireLock();
      }
    };

    acquireLock();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Release the lock when the component unmounts
    return () => {
      releaseLock();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const goToNextStep = () => {
    if (currentStep < recipe.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-100 z-50 flex flex-col p-4 sm:p-6 lg:p-8 animate-fade-in">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-amber-600 truncate">{recipe.title}</h1>
          <p className="text-amber-600 font-medium">Step {currentStep + 1} of {recipe.instructions.length}</p>
        </div>
        <button onClick={onExit} className="p-2 rounded-full bg-white shadow-md hover:bg-slate-200 transition-colors" aria-label="Exit Cook Mode">
          <XIcon className="w-6 h-6 text-slate-700" />
        </button>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow flex flex-col md:flex-row gap-8 overflow-hidden">
        {/* Ingredients Panel (visible on medium screens and up) */}
        <aside className="hidden md:block md:w-1/3 lg:w-1/4 flex-shrink-0 bg-white p-4 rounded-lg shadow-sm overflow-y-auto">
          <h2 className="text-lg font-bold mb-3 text-amber-600">Ingredients</h2>
          <ul className="list-disc list-inside space-y-2 text-slate-600">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{formatIngredient(ing, measurementSystem)}</li>
            ))}
          </ul>
        </aside>

        {/* Instruction Panel */}
        <section className="flex-grow flex flex-col justify-center items-center text-center bg-white p-6 rounded-lg shadow-sm">
           <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-slate-800 leading-relaxed">
             {formatInstruction(recipe.instructions[currentStep], measurementSystem)}
           </p>
        </section>
      </main>

      {/* Footer Navigation */}
      <footer className="flex-shrink-0 flex items-center justify-between mt-4">
        <button 
            onClick={goToPrevStep} 
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-800 font-bold rounded-lg shadow-md hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="w-6 h-6"/>
          <span>Previous</span>
        </button>
        <button 
            onClick={goToNextStep} 
            disabled={currentStep === recipe.instructions.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold rounded-lg shadow-md hover:bg-amber-600 transition-colors disabled:bg-amber-300 disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <ChevronRightIcon className="w-6 h-6"/>
        </button>
      </footer>
    </div>
  );
};

export default CookMode;