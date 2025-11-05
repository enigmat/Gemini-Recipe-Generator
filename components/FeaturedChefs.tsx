import React from 'react';
import { Recipe } from '../types';
import UsersIcon from './icons/UsersIcon';
import StoredImage from './StoredImage';

// A new card specific for this page
const FeaturedChefCard: React.FC<{ recipe: Recipe; onViewRecipe: () => void }> = ({ recipe, onViewRecipe }) => {
    if (!recipe.chef) return null;
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group border animate-fade-in">
            <div className="p-4 flex items-center gap-4 border-b">
                <StoredImage src={recipe.chef.image} alt={recipe.chef.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0" />
                <div>
                    <h3 className="text-xl font-semibold text-slate-800">{recipe.chef.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{recipe.chef.bio}</p>
                </div>
            </div>
            <div className="relative cursor-pointer" onClick={onViewRecipe}>
                <StoredImage src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">View Recipe</span>
                </div>
            </div>
            <div className="p-4">
                 <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Featured Recipe</p>
                <h4 className="text-lg font-semibold text-slate-800 truncate mt-1">{recipe.title}</h4>
            </div>
        </div>
    );
};


// Main FeaturedChefs Component
const FeaturedChefs: React.FC<{ recipes: Recipe[]; onViewRecipe: (recipe: Recipe) => void; }> = ({ recipes, onViewRecipe }) => {
    if (recipes.length === 0) {
        return (
            <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm">
                <UsersIcon className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="mt-4 text-xl font-semibold text-slate-800">No Featured Chefs</h3>
                <p className="mt-2 text-slate-500">
                    Chefs haven't been featured yet. An admin can add them from the "Featured Chef Recipe Pool" in the dashboard.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <UsersIcon className="w-12 h-12 text-teal-500 mx-auto" />
                <h1 className="text-3xl font-bold text-slate-800 mt-4">Featured Chefs</h1>
                <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
                    Discover our curated list of talented (fictional) chefs and their signature dishes.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe, index) => (
                    <FeaturedChefCard key={`${recipe.id}-${index}`} recipe={recipe} onViewRecipe={() => onViewRecipe(recipe)} />
                ))}
            </div>
        </div>
    );
};

export default FeaturedChefs;