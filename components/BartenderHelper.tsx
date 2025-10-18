import React, { useState } from 'react';
import { generateDrinkRecipe } from '../services/geminiService';
import { DrinkRecipe } from '../types';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';

const BartenderHelper: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [drinkRecipe, setDrinkRecipe] = useState<DrinkRecipe | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Please describe the drink you'd like to make.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setDrinkRecipe(null);

        try {
            const recipe = await generateDrinkRecipe(prompt);
            setDrinkRecipe(recipe);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleStartOver = () => {
        setDrinkRecipe(null);
        setPrompt('');
        setError(null);
    };

    const renderInputForm = () => (
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto border border-border-color text-center animate-fade-in">
            <h2 className="text-3xl font-bold text-text-primary">Bartender Helper</h2>
            <p className="mt-2 text-text-secondary">Describe the kind of drink you're in the mood for, and I'll mix up a recipe for you.</p>
            <div className="mt-6">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., a refreshing gin cocktail with cucumber and elderflower"
                    className="w-full p-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    rows={4}
                    disabled={isLoading}
                />
            </div>
            {error && <p className="mt-4 text-red-600">{error}</p>}
            <div className="mt-4">
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <SparklesIcon className="w-5 h-5"/>
                    <span>{isLoading ? 'Mixing...' : 'Create My Drink'}</span>
                </button>
            </div>
        </div>
    );
    
    const renderRecipe = () => {
        if (!drinkRecipe) return null;

        return (
            <div className="bg-white rounded-2xl shadow-lg max-w-4xl mx-auto border border-border-color overflow-hidden animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative aspect-square bg-gray-100">
                        <img src={drinkRecipe.imageUrl} alt={drinkRecipe.name} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="p-6 md:p-8 flex flex-col">
                        <h2 className="text-3xl font-bold text-text-primary">{drinkRecipe.name}</h2>
                        <p className="mt-2 text-text-secondary">{drinkRecipe.description}</p>
                        
                        <div className="mt-4 text-sm font-medium grid grid-cols-2 gap-x-4 gap-y-1">
                            <p><strong className="text-text-primary">Glassware:</strong> {drinkRecipe.glassware}</p>
                            <p><strong className="text-text-primary">Garnish:</strong> {drinkRecipe.garnish}</p>
                        </div>

                        <div className="mt-6 space-y-4 flex-grow overflow-y-auto pr-2">
                            <div>
                                <h3 className="text-xl font-semibold text-primary border-b-2 border-primary/20 pb-1 mb-3">Ingredients</h3>
                                <ul className="list-disc list-inside space-y-1.5 text-text-secondary pl-2">
                                    {drinkRecipe.ingredients.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-primary border-b-2 border-primary/20 pb-1 mb-3">Instructions</h3>
                                 <ol className="list-decimal list-inside space-y-3 text-text-secondary pl-2">
                                    {drinkRecipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                                </ol>
                            </div>
                        </div>
                        
                        <div className="mt-8 flex-shrink-0">
                             <button
                                onClick={handleStartOver}
                                className="w-full px-8 py-3 bg-gray-200 text-text-primary font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-200"
                            >
                                Make Another Drink
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
    
    if (isLoading) {
        return (
            <div className="text-center py-16">
                <Spinner />
                <p className="mt-4 text-text-secondary">Mixing up the perfect drink for you...</p>
            </div>
        );
    }

    return (
        <div className="py-8">
            {drinkRecipe ? renderRecipe() : renderInputForm()}
        </div>
    );
};

export default BartenderHelper;
