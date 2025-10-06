import React, { useState } from 'react';
import { Recipe, AiGeneratedPlan, ShoppingList } from '../types';
import { generateMealPlan, MealPlanPreferences } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';
import Spinner from './Spinner';
import GeneratedPlanView from './GeneratedPlanView';

interface MealPlannerProps {
    allRecipes: Recipe[];
    onSelectRecipe: (recipe: Recipe) => void;
    setShoppingList: (list: ShoppingList | null) => void;
    setListGenerationError: (error: string | null) => void;
}

const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Low-Carb', 'Dairy-Free'];
const MEAL_OPTIONS = ['Breakfast', 'Lunch', 'Dinner'];

const MealPlanner: React.FC<MealPlannerProps> = ({ allRecipes, onSelectRecipe, setShoppingList, setListGenerationError }) => {
    const [preferences, setPreferences] = useState<MealPlanPreferences>({
        dietary: [],
        days: 3,
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        goal: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedPlan, setGeneratedPlan] = useState<AiGeneratedPlan | null>(null);

    const handleDietaryChange = (option: string) => {
        setPreferences(prev => ({
            ...prev,
            dietary: prev.dietary.includes(option)
                ? prev.dietary.filter(item => item !== option)
                : [...prev.dietary, option]
        }));
    };

    const handleMealChange = (option: string) => {
        setPreferences(prev => ({
            ...prev,
            meals: prev.meals.includes(option)
                ? prev.meals.filter(item => item !== option)
                : [...prev.meals, option]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (preferences.meals.length === 0 || preferences.days < 1) {
            setError("Please select at least one meal type and a valid number of days.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedPlan(null);

        try {
            const recipeTitles = allRecipes.map(r => r.title);
            const plan = await generateMealPlan(preferences, recipeTitles);
            setGeneratedPlan(plan);
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
        setGeneratedPlan(null);
        setError(null);
    };

    if (isLoading) {
        return (
            <div className="text-center py-16">
                <Spinner />
                <p className="mt-4 text-text-secondary">Crafting your perfect meal plan...</p>
            </div>
        );
    }

    if (error && !generatedPlan) {
        return (
            <div className="text-center text-red-500 py-16 bg-red-50 rounded-lg">
                <p className="text-xl font-semibold">Oops! Something went wrong.</p>
                <p className="mt-2">{error}</p>
                <button
                    onClick={handleStartOver}
                    className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (generatedPlan) {
        return <GeneratedPlanView 
            plan={generatedPlan} 
            allRecipes={allRecipes} 
            onSelectRecipe={onSelectRecipe}
            onStartOver={handleStartOver}
            setShoppingList={setShoppingList}
            setListGenerationError={setListGenerationError}
        />;
    }

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-border-color">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-text-primary">Personalized Meal Planner</h2>
                <p className="text-text-secondary mt-1">Tell us your preferences and we'll create a custom plan for you!</p>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                    <label className="block text-lg font-semibold text-text-primary mb-2">Dietary Preferences</label>
                    <div className="flex flex-wrap gap-3">
                        {DIETARY_OPTIONS.map(option => (
                            <button
                                type="button"
                                key={option}
                                onClick={() => handleDietaryChange(option)}
                                className={`px-4 py-2 text-sm font-medium rounded-full border-2 transition-colors duration-200 ${
                                    preferences.dietary.includes(option)
                                        ? 'bg-primary border-primary text-white'
                                        : 'bg-white border-border-color text-text-secondary hover:bg-gray-100 hover:border-gray-400'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="days" className="block text-lg font-semibold text-text-primary mb-2">Number of Days</label>
                        <input
                            type="number"
                            id="days"
                            value={preferences.days}
                            onChange={e => setPreferences({...preferences, days: parseInt(e.target.value, 10)})}
                            min="1"
                            max="7"
                            className="w-full p-2 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                     <div>
                        <label className="block text-lg font-semibold text-text-primary mb-2">Meals per Day</label>
                        <div className="flex items-center gap-4 h-full">
                            {MEAL_OPTIONS.map(option => (
                                <div key={option} className="flex items-center">
                                    <input
                                        id={`meal-${option}`}
                                        type="checkbox"
                                        checked={preferences.meals.includes(option)}
                                        onChange={() => handleMealChange(option)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor={`meal-${option}`} className="ml-2 block text-sm text-text-secondary">{option}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="goal" className="block text-lg font-semibold text-text-primary mb-2">What's your goal?</label>
                    <input
                        type="text"
                        id="goal"
                        value={preferences.goal}
                        onChange={e => setPreferences({...preferences, goal: e.target.value})}
                        placeholder="e.g., Quick weeknight meals, kid-friendly, healthy & light"
                        className="w-full p-2 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>

                <div className="text-center pt-4">
                     <button
                        type="submit"
                        className="w-full md:w-auto px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
                    >
                        <SparklesIcon className="h-5 w-5" />
                        <span>Generate My Plan</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MealPlanner;
