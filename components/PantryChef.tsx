import React, { useState } from 'react';
import IngredientInput from './IngredientInput';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';
import { Recipe } from '../types';
import { generateRecipeFromIngredients, generateRecipeFromIngredientsImage, generateImageFromPrompt } from '../services/geminiService';
import ImageUploader from './ImageUploader';
import RefrigeratorIcon from './icons/RefrigeratorIcon';
import CameraIcon from './icons/CameraIcon';

interface PantryChefProps {
  onRecipeGenerated: (recipe: Omit<Recipe, 'id' | 'image'>, image: string) => void;
}

const PantryChef: React.FC<PantryChefProps> = ({ onRecipeGenerated }) => {
    const [mode, setMode] = useState<'ingredients' | 'image'>('ingredients');
    
    // State for ingredient mode
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [dietaryNotes, setDietaryNotes] = useState('');

    // State for image mode
    const [imageData, setImageData] = useState<{ base64: string; mimeType: string } | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        try {
            let recipeDetails;
            if (mode === 'ingredients') {
                if (ingredients.length === 0) {
                    setError('Please add at least one ingredient.');
                    setIsLoading(false);
                    return;
                }
                recipeDetails = await generateRecipeFromIngredients(ingredients, dietaryNotes);
            } else { // mode === 'image'
                if (!imageData) {
                    setError('Please upload an image of a dish.');
                    setIsLoading(false);
                    return;
                }
                recipeDetails = await generateRecipeFromIngredientsImage(imageData.base64, imageData.mimeType);
            }
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
                <p className="text-gray-600 mt-2 mb-8 max-w-lg mx-auto">
                    Tell me what you have, or show me what you want, and I'll create a unique recipe just for you!
                </p>

                {/* Mode Tabs */}
                <div className="flex justify-center mb-6">
                    <div className="flex p-1 bg-slate-100 rounded-lg">
                        <button onClick={() => setMode('ingredients')} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'ingredients' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:bg-slate-200'}`}>
                           <RefrigeratorIcon className="w-5 h-5" /> Use Ingredients
                        </button>
                        <button onClick={() => setMode('image')} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'image' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:bg-slate-200'}`}>
                           <CameraIcon className="w-5 h-5" /> Use an Image
                        </button>
                    </div>
                </div>

                {mode === 'ingredients' ? (
                    <div className="space-y-6 text-left animate-fade-in">
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
                ) : (
                    <div className="text-left animate-fade-in">
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload an image of a dish
                        </label>
                        <ImageUploader onImageReady={(base64, mimeType) => setImageData({ base64, mimeType })} />
                    </div>
                )}


                <button
                    onClick={handleGenerate}
                    disabled={isLoading || (mode === 'ingredients' && ingredients.length === 0) || (mode === 'image' && !imageData)}
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