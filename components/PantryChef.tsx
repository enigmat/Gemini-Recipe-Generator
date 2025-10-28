import React, { useState } from 'react';
import IngredientInput from './IngredientInput';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';
import { Recipe } from '../types';
import { generateRecipeFromIngredients, generateImageFromPrompt } from '../services/geminiService';

interface PantryChefProps {
  onRecipeGenerated: (recipe: Omit<Recipe, 'id' | 'image'>, image: string) => void;
}

const PantryChef: React.FC<PantryChefProps> = ({ onRecipeGenerated }) => {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [dietaryNotes, setDietaryNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (ingredients.length === 0) {
            setError('Please add at least one ingredient.');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const recipeDetails = await generateRecipeFromIngredients(ingredients, dietaryNotes);
            const image = await generateImageFromPrompt(recipeDetails.title);
            onRecipeGenerated(recipeDetails, image);
        } catch (e: any) {
            setError(e.message || "An error occurred while creating your recipe. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="max-w-3xl mx-auto mt-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in">
                <h2 className="text-3xl font-bold text-gray-800">Pantry Chef</h2>
                <p className="text-gray-600 mt-2 mb-6 max-w-md mx-auto">
                    Tell me what ingredients you have, and I'll create a unique recipe just for you!
                </p>

                <div className="space-y-6 text-left">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ingredients you have
                        </label>
                        <IngredientInput ingredients={ingredients} onChange={setIngredients} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dietary Notes (optional)
                        </label>
                        <input
                            type="text"
                            value={dietaryNotes}
                            onChange={(e) => setDietaryNotes(e.target.value)}
                            placeholder="e.g., vegetarian, gluten-free, make it spicy"
                            className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow text-base text-gray-900 placeholder-gray-500"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isLoading || ingredients.length === 0}
                    className="w-full mt-8 flex items-center justify-center gap-2 py-3 px-4 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors disabled:bg-teal-300 disabled:cursor-wait"
                >
                    {isLoading ? (
                        <Spinner size="w-5 h-5" />
                    ) : (
                        <SparklesIcon className="w-5 h-5" />
                    )}
                    <span>{isLoading ? 'Creating Your Recipe...' : 'Generate Recipe'}</span>
                </button>
                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default PantryChef;
