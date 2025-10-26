import React, { useState } from 'react';
import SparklesIcon from './icons/SparklesIcon';
import LockClosedIcon from './icons/LockClosedIcon';

interface MealPlanGeneratorProps {
    onGenerate: (prompt: string) => void;
    isLoading: boolean;
    error: string | null;
    isPremium: boolean;
    onUpgrade: () => void;
}

const MealPlanGenerator: React.FC<MealPlanGeneratorProps> = ({ onGenerate, isLoading, error, isPremium, onUpgrade }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(prompt);
    };

    if (!isPremium) {
        return (
            <div className="bg-yellow-50 text-yellow-900 p-6 rounded-lg shadow-sm border border-yellow-200 mb-8 text-center">
                <div className="flex justify-center items-center gap-2">
                     <LockClosedIcon className="w-6 h-6 text-yellow-500" />
                     <h3 className="text-xl font-bold text-yellow-800">Generate a Shopping List with AI</h3>
                </div>
                <p className="mt-2 text-sm text-yellow-700 max-w-xl mx-auto">
                    This premium feature allows you to describe your week, and we'll generate a full meal plan and shopping list for you.
                </p>
                <button
                    onClick={onUpgrade}
                    className="mt-4 px-6 py-2 bg-yellow-400 text-gray-900 font-bold text-sm rounded-lg shadow-md hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-400 transition-colors duration-200 flex items-center gap-2 mx-auto"
                >
                    <SparklesIcon className="w-5 h-5" />
                    <span>Upgrade to Premium</span>
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border-color mb-8">
            <h3 className="text-xl font-bold mb-2 text-center text-text-primary flex items-center justify-center gap-2">
                <SparklesIcon className="w-6 h-6 text-primary" />
                Generate a Shopping List with AI
            </h3>
            <p className="text-text-secondary text-center mb-4 max-w-xl mx-auto">
                Inspired by Instacart's new feature. Describe your week, and we'll generate a meal plan and a complete, categorized shopping list for you.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A week of healthy, high-protein lunches for one person who likes spicy food."
                    className="w-full p-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    rows={3}
                    disabled={isLoading}
                    aria-label="Meal plan description"
                />
                {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="w-full px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                         <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Generating...</span>
                        </>
                    ) : (
                        'Generate Plan & List'
                    )}
                </button>
            </form>
        </div>
    );
};

export default MealPlanGenerator;