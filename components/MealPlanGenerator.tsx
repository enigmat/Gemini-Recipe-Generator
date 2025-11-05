import React, { useState, useMemo } from 'react';
import { GeneratedMealPlan, Recipe } from '../types';
import * as geminiService from '../services/geminiService';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';

interface MealPlanGeneratorProps {
  allRecipes: Recipe[]; // This will be passed allRecipeTitles, but component expects Recipe[] for onRecipeClick
  allRecipeTitles: string[];
  onRecipeClick: (recipe: Recipe) => void;
}

const MealPlanGenerator: React.FC<MealPlanGeneratorProps> = ({ allRecipes, allRecipeTitles, onRecipeClick }) => {
  const [prompt, setPrompt] = useState('');
  const [plan, setPlan] = useState<GeneratedMealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recipeTitleMap = useMemo(() => {
    return new Map(allRecipes.map(recipe => [recipe.title.toLowerCase(), recipe]));
  }, [allRecipes]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setPlan(null);

    try {
      const generatedPlan = await geminiService.generateMealPlan(prompt, allRecipeTitles);
      setPlan(generatedPlan);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeTitleClick = (title: string) => {
    const recipe = recipeTitleMap.get(title.toLowerCase());
    if (recipe) {
      onRecipeClick(recipe);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">AI Meal Planner</h2>
        <p className="text-gray-600 mt-2 mb-6 max-w-lg mx-auto">
          Describe your dietary goals, and our AI will create a personalized meal plan for you from our recipe collection.
        </p>
        
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., a 5-day high-protein vegetarian lunch plan"
            className="w-full h-28 p-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow text-base text-gray-900 placeholder-gray-500 resize-none"
            aria-label="Describe your desired meal plan"
            disabled={isLoading}
          />
        </div>
        
        <button 
          onClick={handleGenerate} 
          disabled={isLoading || !prompt.trim()}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors disabled:bg-teal-300 disabled:cursor-wait"
        >
          {isLoading ? <Spinner size="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
          <span>{isLoading ? 'Generating Your Plan...' : 'Generate Plan'}</span>
        </button>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>

      {plan && (
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">Your Custom Meal Plan</h3>
            {plan.notes && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <p><span className="font-bold">A note from the AI Chef:</span> {plan.notes}</p>
              </div>
            )}
            {plan.days.length > 0 ? (
                <div className="space-y-6">
                {plan.days.map((day, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-xl font-semibold text-gray-700">{day.day}</h4>
                    <div className="mt-3 space-y-2">
                        {day.meals.map((meal, mealIndex) => (
                        <div key={mealIndex} className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-50">
                            <span className="font-semibold text-gray-600 w-24 text-right">{meal.mealType}:</span>
                            <button 
                                onClick={() => handleRecipeTitleClick(meal.recipeTitle)}
                                className="text-teal-600 hover:text-teal-800 hover:underline text-left"
                                disabled={!recipeTitleMap.has(meal.recipeTitle.toLowerCase())}
                            >
                                {meal.recipeTitle}
                            </button>
                            {!recipeTitleMap.has(meal.recipeTitle.toLowerCase()) && 
                                <span className="text-xs text-red-500">(Recipe not found)</span>
                            }
                        </div>
                        ))}
                    </div>
                    </div>
                ))}
                </div>
            ) : !plan.notes ? (
                <p className="text-center text-gray-500">The AI couldn't generate a plan for this request. Please try a different prompt.</p>
            ) : null}
        </div>
      )}
    </div>
  );
};

export default MealPlanGenerator;
