
import React, { useState, useEffect, useRef } from 'react';
import { Recipe } from '../types';
import XIcon from './icons/XIcon';

interface CookModeProps {
    recipe: Recipe;
    onExit: () => void;
}

const CookMode: React.FC<CookModeProps> = ({ recipe, onExit }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    useEffect(() => {
        // Function to acquire the wake lock
        const requestWakeLock = async () => {
            if ('wakeLock' in navigator) {
                try {
                    wakeLockRef.current = await navigator.wakeLock.request('screen');
                    console.log('Screen Wake Lock is active.');
                    
                    // Re-acquire lock if it's released, e.g., when tab visibility changes
                    wakeLockRef.current.addEventListener('release', () => {
                        console.log('Screen Wake Lock was released.');
                    });

                } catch (err) {
                    if (err instanceof Error) {
                        console.error(`${err.name}, ${err.message}`);
                    }
                }
            }
        };

        requestWakeLock();

        // Cleanup function to release the wake lock
        return () => {
            if (wakeLockRef.current) {
                wakeLockRef.current.release();
                wakeLockRef.current = null;
                console.log('Screen Wake Lock released.');
            }
        };
    }, []);

    const handleNext = () => {
        if (currentStep < recipe.instructions.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col p-4 md:p-8" role="dialog" aria-modal="true">
            <header className="flex justify-between items-center mb-4 flex-shrink-0">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-primary">{recipe.title}</h1>
                    <p className="text-text-secondary font-semibold">
                        Step {currentStep + 1} of {recipe.instructions.length}
                    </p>
                </div>
                <button
                    onClick={onExit}
                    className="px-4 py-2 bg-gray-200 text-text-secondary font-semibold rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                >
                    <XIcon className="h-5 w-5" />
                    <span className="hidden sm:inline">Exit Cook Mode</span>
                </button>
            </header>

            <main className="flex-grow flex items-center justify-center">
                <p className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary text-center leading-tight md:leading-tight max-w-4xl">
                    {recipe.instructions[currentStep]}
                </p>
            </main>

            <footer className="flex justify-between items-center mt-4 flex-shrink-0">
                <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="px-8 py-4 bg-gray-200 text-text-primary font-bold rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentStep === recipe.instructions.length - 1}
                    className="px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-focus disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
            </footer>
        </div>
    );
};

export default CookMode;
