import React from 'react';
import { Recipe } from '../types';
import TrophyIcon from './icons/TrophyIcon';
import ClockIcon from './icons/ClockIcon';
import UsersIcon from './icons/UsersIcon';
import StoredImage from './StoredImage';

interface RecipeOfTheDayProps {
  recipe: Recipe | null;
  isLoading: boolean;
  onClick: (recipe: Recipe) => void;
}

const RecipeOfTheDaySkeleton: React.FC = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
        <div className="p-4 bg-slate-300 text-center">
            <div className="h-7 bg-slate-400 rounded w-1/2 mx-auto"></div>
        </div>
        <div className="md:flex">
            <div className="md:w-1/2">
                <div className="h-80 w-full bg-slate-200"></div>
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6 mb-6"></div>
                <div className="h-12 bg-slate-200 rounded-lg w-1/3"></div>
            </div>
        </div>
    </div>
);


const RecipeOfTheDay: React.FC<RecipeOfTheDayProps> = ({ recipe, isLoading, onClick }) => {
    if (isLoading) {
        return <RecipeOfTheDaySkeleton />;
    }

    if (!recipe) {
        return (
            <div className="bg-slate-100 border border-slate-200 rounded-lg shadow-sm p-8 text-center">
                <TrophyIcon className="w-10 h-10 text-slate-400 mx-auto" />
                <h2 className="text-xl font-bold text-slate-700 mt-4">Recipe of the Day</h2>
                <p className="text-slate-500 mt-2">Come back tomorrow for a new featured recipe! The recipe pool is currently being curated by our chefs.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden group transform hover:scale-[1.02] transition-transform duration-300">
            <div className="p-4 bg-amber-400 text-center">
                <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                    <TrophyIcon className="w-6 h-6" />
                    Recipe of the Day
                </h2>
            </div>
            <div className="md:flex">
                <div className="md:w-1/2">
                    <StoredImage className="h-80 w-full object-cover" src={recipe.image} alt={recipe.title} />
                </div>
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold text-slate-800 mb-2">{recipe.title}</h3>
                    <div className="flex items-center gap-6 text-slate-500 mb-4">
                        <div className="flex items-center space-x-2">
                            <ClockIcon className="w-5 h-5" />
                            <span>{recipe.cookTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <UsersIcon className="w-5 h-5" />
                            <span>{recipe.servings}</span>
                        </div>
                    </div>
                    <p className="text-slate-600 mb-6">{recipe.description}</p>
                    <button
                        onClick={() => onClick(recipe)}
                        className="self-start px-6 py-3 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors"
                    >
                        View Recipe
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeOfTheDay;