import React from 'react';
import { Recipe } from '../types';
import RecipeCard from './RecipeCard';
import TrendingUpIcon from './icons/TrendingUpIcon';

interface FavoriteRecipesProps {
    recipes: Recipe[];
    onSelectRecipe: (recipe: Recipe) => void;
    savedRecipeTitles: string[];
    onToggleSave: (recipeTitle: string) => void;
}

const FavoriteRecipes: React.FC<FavoriteRecipesProps> = ({ recipes, onSelectRecipe, savedRecipeTitles, onToggleSave }) => {
    if (recipes.length === 0) {
        return null; // Don't render the section if there are no top-rated recipes yet
    }

    return (
        <div className="my-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUpIcon className="w-6 h-6 text-primary" />
                Top-Rated Recipes
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

export default FavoriteRecipes;
