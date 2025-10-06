import React from 'react';
import { MealPlan, Recipe } from '../types';
import CalendarDaysIcon from './icons/CalendarDaysIcon';
import ShoppingCartIcon from './icons/ShoppingCartIcon';

interface MealPlanDetailProps {
    plan: MealPlan;
    recipes: Recipe[];
    onSelectRecipe: (recipe: Recipe) => void;
    onBack: () => void;
    onGenerateList: () => void;
    isGeneratingList: boolean;
}

const MealPlanDetail: React.FC<MealPlanDetailProps> = ({ plan, recipes, onSelectRecipe, onBack, onGenerateList, isGeneratingList }) => {

    const findRecipeByTitle = (title: string): Recipe | undefined => {
        return recipes.find(recipe => recipe.title === title);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div>
                    <button
                        onClick={onBack}
                        className="mb-2 px-4 py-2 bg-gray-200 text-text-secondary font-semibold rounded-lg hover:bg-gray-300 transition-colors text-sm"
                    >
                        &larr; Back to Curated Plans
                    </button>
                    <h2 className="text-3xl md:text-4xl font-bold text-text-primary">{plan.title}</h2>
                    <p className="text-text-secondary mt-1">{plan.description}</p>
                </div>
                <button
                    onClick={onGenerateList}
                    disabled={isGeneratingList}
                    className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow-md hover:bg-primary-focus transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isGeneratingList ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <ShoppingCartIcon className="w-5 h-5" />
                            <span>Create Weekly Shopping List</span>
                        </>
                    )}
                </button>
            </div>

            <div className="space-y-6">
                {plan.plan.map(({ day, recipeTitle }) => {
                    const recipe = findRecipeByTitle(recipeTitle);
                    if (!recipe) return null;

                    return (
                        <div
                            key={day}
                            onClick={() => onSelectRecipe(recipe)}
                            className="bg-white rounded-lg shadow-sm border border-border-color p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer hover:shadow-md hover:border-primary/50 transition-all duration-200"
                        >
                            <div className="w-full sm:w-32 h-24 sm:h-20 rounded-md overflow-hidden flex-shrink-0">
                                <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow">
                                <p className="font-bold text-primary text-sm uppercase tracking-wide">{day}</p>
                                <h3 className="text-lg font-semibold text-text-primary">{recipe.title}</h3>
                                <p className="text-sm text-text-secondary mt-1 line-clamp-2">{recipe.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MealPlanDetail;