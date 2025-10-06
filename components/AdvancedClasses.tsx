import React from 'react';
import { CookingClass } from '../types';
import LockClosedIcon from './icons/LockClosedIcon';
import SparklesIcon from './icons/SparklesIcon';
import MortarPestleIcon from './icons/MortarPestleIcon';
import CookingClassCard from './CookingClassCard';

interface AdvancedClassesProps {
    isPremium: boolean;
    onUpgrade: () => void;
    classes: CookingClass[];
    onSelectClass: (cookingClass: CookingClass) => void;
}

const AdvancedClasses: React.FC<AdvancedClassesProps> = ({ isPremium, onUpgrade, classes, onSelectClass }) => {
    if (!isPremium) {
        return (
            <div className="bg-white text-text-primary p-8 rounded-lg shadow-md text-center my-12 border border-border-color">
                <div className="flex justify-center items-center gap-3">
                     <LockClosedIcon className="w-8 h-8 text-primary" />
                     <h2 className="text-2xl font-bold">Advanced Cooking Classes</h2>
                </div>
                <p className="mt-2 text-text-secondary max-w-md mx-auto">
                    Take your skills to the next level with step-by-step video courses from professional chefs.
                </p>
                <button
                    onClick={onUpgrade}
                    className="mt-6 px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-colors duration-200 flex items-center gap-2 mx-auto"
                >
                    <SparklesIcon className="w-5 h-5" />
                    <span>Unlock with Premium</span>
                </button>
            </div>
        );
    }

    return (
        <div className="my-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MortarPestleIcon className="w-6 h-6 text-primary" />
                Advanced Cooking Classes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {classes.map(cls => (
                    <CookingClassCard
                        key={cls.title}
                        cookingClass={cls}
                        onClick={() => onSelectClass(cls)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdvancedClasses;