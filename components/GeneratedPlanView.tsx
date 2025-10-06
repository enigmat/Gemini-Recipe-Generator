import React, { useState } from 'react';
import { AiGeneratedPlan, Recipe, ShoppingList } from '../types';
import { generateShoppingList } from '../services/geminiService';
import ShoppingCartIcon from './icons/ShoppingCartIcon';

interface GeneratedPlanViewProps {
    plan: AiGeneratedPlan;
    allRecipes: Recipe[];
    onSelectRecipe: (recipe: Recipe) => void;
    onStartOver: () => void;
    setShoppingList: (list: ShoppingList | null) => void;
    setListGenerationError: (error: string | null) => void;
}

const GeneratedPlanView: React.FC<GeneratedPlanViewProps> = ({ plan, allRecipes, onSelectRecipe, onStartOver, setShoppingList, setListGenerationError }) => {
    const [isGeneratingList, setIsGeneratingList] = useState(false);
    
    const recipeMap = new Map(allRecipes.map(recipe => [recipe.title, recipe]));

    const handleGenerateShoppingList = async () => {
        setIsGeneratingList(true);
        setListGenerationError(null);
        setShoppingList(null);

        try {
            const allIngredients: string[] = [];
            plan.plan.forEach(day => {
                const meals = [day.breakfast, day.lunch, day.dinner];
                meals.forEach(meal => {
                    if (meal) {
                        // FIX: Explicitly type recipe to avoid it being inferred as 'unknown'.
                        const recipe: Recipe | undefined = recipeMap.get(meal.recipeTitle);
                        if (recipe) {
                            allIngredients.push(...recipe.ingredients);
                        }
                    }
                });
            });

            if (allIngredients.length === 0) {
                throw new Error("No ingredients found in the meal plan.");
            }

            const list = await generateShoppingList(allIngredients);
            setShoppingList(list);
        } catch (error) {
            console.error("Error generating shopping list for plan:", error);
            if (error instanceof Error) {
                setListGenerationError(error.message);
            } else {
                setListGenerationError("An unknown error occurred while generating the list.");
            }
        } finally {
            setIsGeneratingList(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary">{plan.title}</h2>
                <p className="text-text-secondary mt-1">Here is your personalized meal plan!</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <button
                    onClick={handleGenerateShoppingList}
                    disabled={isGeneratingList}
                    className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow-md hover:bg-primary-focus transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isGeneratingList ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Generating List...</span>
                        </>
                    ) : (
                        <>
                            <ShoppingCartIcon className="w-5 h-5" />
                            <span>Create Shopping List</span>
                        </>
                    )}
                </button>
                 <button
                    onClick={onStartOver}
                    className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-text-secondary font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                    &larr; Start Over
                </button>
            </div>

            <div className="space-y-8">
                {plan.plan.map(day => (
                    <div key={day.day}>
                        <h3 className="text-2xl font-bold text-text-primary mb-4 border-b-2 border-primary/20 pb-2">{day.day}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[day.breakfast, day.lunch, day.dinner].map((meal, index) => {
                                if (!meal) return null;
                                const mealType = ['Breakfast', 'Lunch', 'Dinner'][index];
                                // FIX: Explicitly type recipe to avoid it being inferred as 'unknown'.
                                const recipe: Recipe | undefined = recipeMap.get(meal.recipeTitle);
                                if (!recipe) return null;

                                return (
                                    <div 
                                        key={`${day.day}-${mealType}`}
                                        className="bg-white rounded-lg shadow-sm border border-border-color overflow-hidden cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200"
                                        onClick={() => onSelectRecipe(recipe)}
                                    >
                                        <div className="h-40 w-full overflow-hidden">
                                            <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="p-4">
                                            <p className="font-bold text-primary text-xs uppercase tracking-wider">{mealType}</p>
                                            <h4 className="text-lg font-semibold text-text-primary mt-1">{recipe.title}</h4>
                                            <p className="text-sm text-text-secondary mt-2 italic border-l-4 border-gray-200 pl-3">"{meal.reasoning}"</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GeneratedPlanView;