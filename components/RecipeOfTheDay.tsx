import React from 'react';
import { Recipe } from '../types';
import TrophyIcon from './icons/TrophyIcon';
import ClockIcon from './icons/ClockIcon';
import UsersIcon from './icons/UsersIcon';
import StoredImage from './StoredImage';
import FireIcon from './icons/FireIcon';

interface FeaturedChefProps {
  recipe: Recipe | null;
  isLoading: boolean;
  onClick: (recipe: Recipe) => void;
}

const FeaturedChefSkeleton: React.FC = () => (
    <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl shadow-lg p-8 md:p-12 overflow-hidden animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Skeleton */}
            <div className="flex flex-col items-center lg:items-start">
                <div className="h-5 bg-slate-200 rounded w-2/5 mb-2"></div>
                <div className="w-40 h-40 rounded-full bg-slate-200 mb-4"></div>
                <div className="h-10 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
            {/* Right Skeleton */}
            <div className="bg-white rounded-xl shadow-md flex flex-col overflow-hidden h-96">
                <div className="h-56 w-full bg-slate-200"></div>
                <div className="p-6 flex flex-col flex-grow">
                    <div className="h-6 bg-slate-200 rounded w-4/5 mb-3"></div>
                    <div className="h-4 bg-slate-200 rounded w-full mb-2 flex-grow"></div>
                    <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="mt-4 pt-4 border-t h-6 bg-slate-200 rounded"></div>
                </div>
            </div>
        </div>
    </div>
);


const FeaturedChef: React.FC<FeaturedChefProps> = ({ recipe, isLoading, onClick }) => {
    if (isLoading) {
        return <FeaturedChefSkeleton />;
    }

    if (!recipe || !recipe.chef) {
        return (
            <div className="bg-slate-100 border border-slate-200 rounded-lg shadow-sm p-8 text-center">
                <TrophyIcon className="w-10 h-10 text-slate-400 mx-auto" />
                <h2 className="text-xl font-bold text-slate-700 mt-4">Featured Chef Recipe</h2>
                <p className="text-slate-500 mt-2">Come back tomorrow for a new featured recipe! The recipe pool is currently being curated by our chefs.</p>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl shadow-lg p-8 md:p-12 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Side: Chef Profile */}
                <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
                    <p className="font-semibold text-amber-600 mb-2 uppercase tracking-wider">Featured Chef</p>
                    <StoredImage src={recipe.chef.image} alt={recipe.chef.name} className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl mb-4"/>
                    <h3 className="text-4xl font-bold text-slate-800">{recipe.chef.name}</h3>
                    <p className="mt-4 text-slate-600 max-w-md">{recipe.chef.bio}</p>
                    <p className="mt-4 text-sm text-slate-500">
                        <strong className="text-slate-700">Signature Dish:</strong> {recipe.chef.signatureDish}
                    </p>
                </div>
                
                {/* Right Side: Recipe Card */}
                <div 
                    onClick={() => onClick(recipe)}
                    className="bg-white rounded-xl shadow-md cursor-pointer transform hover:scale-105 transition-transform duration-300 group flex flex-col overflow-hidden"
                    role="button"
                    tabIndex={0}
                    aria-label={`View recipe for ${recipe.title}`}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(recipe) }}
                >
                    <div className="relative">
                        <StoredImage src={recipe.image} alt={recipe.title} className="w-full h-56 object-cover" />
                        <div className="absolute top-0 left-0 bg-amber-500 text-white px-3 py-1 text-sm font-bold rounded-br-lg">
                            Today's Recipe
                        </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                        <h4 className="text-xl font-bold text-slate-800 group-hover:text-teal-600 transition-colors">{recipe.title}</h4>
                        <p className="text-sm text-slate-600 mt-2 flex-grow line-clamp-3">{recipe.description}</p>
                        <div className="mt-4 pt-4 border-t flex items-center justify-between text-slate-500 text-sm font-medium">
                           <div className="flex items-center space-x-2">
                                <ClockIcon className="w-4 h-4" />
                                <span>{recipe.cookTime}</span>
                            </div>
                           <div className="flex items-center space-x-2">
                                <FireIcon className="w-4 h-4" />
                                <span>{recipe.calories?.replace('Approx. ', '')}</span>
                            </div>
                           <div className="flex items-center space-x-2">
                                <UsersIcon className="w-4 h-4" />
                                <span>{recipe.servings}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedChef;
