import React, { useState, useMemo } from 'react';
import { CocktailRecipe, SavedCocktail, User } from '../types';
import { generateCocktailRecipe, generateImageFromPrompt } from '../services/geminiService';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';

interface BartenderHelperProps {
  currentUser: User | null;
  savedCocktails: SavedCocktail[];
  onSaveCocktail: (recipe: CocktailRecipe, image: string) => void;
}

const BartenderHelper: React.FC<BartenderHelperProps> = ({ currentUser, savedCocktails, onSaveCocktail }) => {
  const [prompt, setPrompt] = useState('');
  const [recipe, setRecipe] = useState<CocktailRecipe | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAlreadySaved = useMemo(() => {
    if (!recipe) return false;
    return savedCocktails.some(c => c.title.toLowerCase() === recipe.title.toLowerCase());
  }, [recipe, savedCocktails]);

  const handleCreateDrink = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setRecipe(null);
    setImage(null);

    try {
      const generatedRecipe = await generateCocktailRecipe(prompt);
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
    setPrompt('');
    setRecipe(null);
    setImage(null);
    setError(null);
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
                onClick={() => recipe && image && onSaveCocktail(recipe, image)}
                disabled={isAlreadySaved}
                className="w-full py-3 px-4 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
              >
                {isAlreadySaved ? 'Saved in My Bar' : 'Save Drink'}
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
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800">Bartender Helper</h2>
        <p className="text-gray-600 mt-2 mb-6 max-w-md mx-auto">Describe the kind of drink you're in the mood for, and I'll mix up a recipe for you.</p>
        
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., a refreshing gin cocktail with cucumber and elderflower"
            className="w-full h-28 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow resize-none"
            aria-label="Describe your drink mood"
            disabled={isLoading}
          />
        </div>
        
        <button 
          onClick={handleCreateDrink} 
          disabled={isLoading || !prompt.trim()}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors disabled:bg-teal-300 disabled:cursor-wait"
        >
          {isLoading ? (
            <Spinner size="w-5 h-5" />
          ) : (
            <SparklesIcon className="w-5 h-5" />
          )}
          <span>{isLoading ? 'Creating Your Drink...' : 'Create My Drink'}</span>
        </button>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default BartenderHelper;