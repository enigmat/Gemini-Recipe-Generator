import React, { useState } from 'react';
import SparklesIcon from './icons/SparklesIcon';

interface MealPlanGeneratorProps {
    onGenerate: (prompt: string) => void;
    isLoading: boolean;
    error: string | null;
}

const MealPlanGenerator: React.FC<MealPlanGeneratorProps> = ({ onGenerate, isLoading, error }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(prompt);
    };

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
