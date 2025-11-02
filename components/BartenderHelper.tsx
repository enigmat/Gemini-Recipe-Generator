import React, { useState, useMemo } from 'react';
import { CocktailRecipe, SavedCocktail, User } from '../types';
import { generateCocktailRecipe, generateImageFromPrompt } from '../services/geminiService';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';
import CrownIcon from './icons/CrownIcon';
import IngredientInput from './IngredientInput';

interface BartenderHelperProps {
  currentUser: User;
  savedCocktails: SavedCocktail[];
  onSaveCocktail: (recipe: CocktailRecipe, image: string) => void;
  onUpgradeRequest: () => void;
}

const BartenderHelper: React.FC<BartenderHelperProps> = ({ currentUser, savedCocktails, onSaveCocktail, onUpgradeRequest }) => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [recipe, setRecipe] = useState<CocktailRecipe | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAlreadySaved = useMemo(() => {
    if (!recipe) return false;
    return savedCocktails.some(c => c.title.toLowerCase() === recipe.title.toLowerCase());
  }, [recipe, savedCocktails]);

  const handleCreateDrink = async () => {
    let finalPrompt = '';
    if (ingredients.length > 0) {
      finalPrompt += `Create a cocktail recipe using these ingredients: ${ingredients.join(', ')}. `;
    }
    if (notes.trim()) {
      finalPrompt += `Additional request: ${notes.trim()}`;
    }

    if (!finalPrompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setRecipe(null);
    setImage(null);

    try {
      const generatedRecipe = await generateCocktailRecipe(finalPrompt);
      setRecipe(generatedRecipe);
      
      const generatedImage = await generateImageFromPrompt(generatedRecipe.imagePrompt);
      setImage(generatedImage);

    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIngredients([]);
    setNotes('');
    setRecipe(null);
    setImage(null);
    setError(null);
  };

  const handleSaveClick = () => {
    if (!currentUser.isPremium) {
        onUpgradeRequest();
        return;
    }
    if (recipe && image) {
        onSaveCocktail(recipe, image);
    }
  };

  if (recipe && image) {
    return (
      <div className="bg-white rounded-2xl shadow-xl w-full md:max-w-4xl mx-auto my-8 animate-fade-in">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <img src={image} alt={recipe.title} className="w-full h-64 md:h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" />
          </div>
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
            <h2 className="text-3xl font-bold mb-3 text-gray-800">{recipe.title}</h2>
            <p className="text-gray-600 mb-4">{recipe.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="font-semibold text-gray-700">Glassware:</p>
                <p className="text-gray-600">{recipe.glassware}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Garnish:</p>
                <p className="text-gray-600">{recipe.garnish}</p>
              </div>
            </div>

            <div className="flex-grow">
                <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800 border-b pb-2">Ingredients</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 mt-3">
                {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800 border-b pb-2">Instructions</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 mt-3">
                {recipe.instructions.map((inst, i) => <li key={i}>{inst}</li>)}
                </ol>
            </div>
            
            <div className="mt-8 space-y-3">
              <button
                onClick={handleSaveClick}
                disabled={isAlreadySaved}
                className={`w-full py-3 px-4 font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 ${
                    isAlreadySaved 
                        ? 'bg-green-300 text-white cursor-not-allowed'
                        : currentUser.isPremium 
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-amber-400 text-slate-900 hover:bg-amber-500'
                }`}
              >
                {isAlreadySaved 
                    ? 'Saved in My Bar' 
                    : currentUser.isPremium 
                        ? 'Save Drink'
                        : <>
                            <CrownIcon className="w-5 h-5" />
                            <span>Save to My Bar (Premium)</span>
                          </>
                }
              </button>
              <button 
                onClick={handleReset} 
                className="w-full py-3 px-4 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Make Another Drink
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800">AI Bartender</h2>
        <p className="text-gray-600 mt-2 mb-8 max-w-lg mx-auto">
          Create a unique cocktail from ingredients you have, or just describe the drink you're craving.
        </p>
        
        <div className="space-y-6 text-left">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredients You Have (Optional)
                </label>
                <IngredientInput ingredients={ingredients} onChange={setIngredients} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe Your Mood or Request (Optional)
                </label>
                 <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., something refreshing for a summer day, or a non-alcoholic version"
                    className="w-full h-24 p-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow text-base text-gray-900 placeholder-gray-500 resize-none"
                    aria-label="Describe your drink mood"
                    disabled={isLoading}
                />
            </div>
        </div>
        
        <button 
          onClick={handleCreateDrink} 
          disabled={isLoading || (ingredients.length === 0 && !notes.trim())}
          className="w-full mt-8 flex items-center justify-center gap-2 py-3 px-4 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors disabled:bg-teal-300 disabled:cursor-wait"
        >
          {isLoading ? (
            <Spinner size="w-5 h-5" />
          ) : (
            <SparklesIcon className="w-5 h-5" />
          )}
          <span>{isLoading ? 'Mixing Your Drink...' : 'Create My Drink'}</span>
        </button>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default BartenderHelper;
