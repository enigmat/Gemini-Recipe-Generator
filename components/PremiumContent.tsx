import React from 'react';
import { Recipe } from '../types';
import LockClosedIcon from './icons/LockClosedIcon';
import RecipeCard from './RecipeCard';
import SparklesIcon from './icons/SparklesIcon';

interface PremiumContentProps {
    isPremium: boolean;
    onUpgrade: () => void;
    recipes: Recipe[];
    onSelectRecipe: (recipe: Recipe) => void;
    savedRecipeTitles: string[];
    onToggleSave: (recipeTitle: string) => void;
}

const PremiumContent: React.FC<PremiumContentProps> = ({ isPremium, onUpgrade, recipes, onSelectRecipe, savedRecipeTitles, onToggleSave }) => {
    if (!isPremium) {
        return (
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 rounded-lg shadow-lg text-center my-12 border border-yellow-400/30">
                <div className="flex justify-center items-center gap-3">
                     <LockClosedIcon className="w-8 h-8 text-yellow-400" />
                     <h2 className="text-2xl font-bold text-yellow-400">New This Month</h2>
                </div>
                <p className="mt-2 text-gray-300 max-w-md mx-auto">
                    Unlock exclusive, curated recipes every month by upgrading to Premium.
                </p>
                <button
                    onClick={onUpgrade}
                    className="mt-6 px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg shadow-md hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-400 transition-colors duration-200 flex items-center gap-2 mx-auto"
                >
                    <SparklesIcon className="w-5 h-5" />
                    <span>Upgrade to Premium</span>
                </button>
            </div>
        );
    }

    return (
        <div className="my-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-yellow-500" />
                New This Month
            </h2>
            <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4">
                {recipes.map(recipe => (
                     <div key={recipe.title} className="flex-shrink-0 w-72">
                         <RecipeCard
                            recipe={recipe}
                            onClick={() => onSelectRecipe(recipe)}
                            isSaved={savedRecipeTitles.includes(recipe.title)}
                            onToggleSave={() => onToggleSave(recipe.title)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PremiumContent;