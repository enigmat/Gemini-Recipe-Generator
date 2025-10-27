import React, { useState, useMemo, useEffect } from 'react';
import { Recipe, RecipeVariation } from '../types';
import ShareIcon from './icons/ShareIcon';
import PrintIcon from './icons/PrintIcon';
import { formatIngredient, formatInstruction, adjustIngredient } from '../utils/recipeUtils';
import ChefHatIcon from './icons/ChefHatIcon';
import WineIcon from './icons/WineIcon';
import StarIcon from './icons/StarIcon';
import UsersIcon from './icons/UsersIcon';
import ClockIcon from './icons/ClockIcon';
import PlusIcon from './icons/PlusIcon';
import MinusIcon from './icons/MinusIcon';
import SparklesIcon from './icons/SparklesIcon';
import VariationModal from './VariationModal';
import { generateRecipeVariations } from '../services/geminiService';
import Spinner from './Spinner';
import XIcon from './icons/XIcon';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  measurementSystem: 'metric' | 'us';
  onEnterCookMode: (recipe: Recipe) => void;
  onAddRating: (recipeId: number, score: number) => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose, measurementSystem, onEnterCookMode, onAddRating }) => {
  const [shareText, setShareText] = useState('Share');
  
  const originalServings = useMemo(() => recipe ? parseInt(recipe.servings.split('-')[0], 10) || 1 : 1, [recipe]);
  const [currentServings, setCurrentServings] = useState(originalServings);
  const [adjustedIngredients, setAdjustedIngredients] = useState(recipe?.ingredients || []);
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(Math.round(recipe?.rating?.score || 0));
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);
  const [variations, setVariations] = useState<RecipeVariation[]>([]);
  const [isVariationModalOpen, setIsVariationModalOpen] = useState(false);
  const [variationError, setVariationError] = useState<string | null>(null);

  useEffect(() => {
    if (recipe) {
      const newOriginalServings = parseInt(recipe.servings.split('-')[0], 10) || 1;
      setCurrentServings(newOriginalServings);
      setAdjustedIngredients(recipe.ingredients);
      setCurrentRating(Math.round(recipe.rating?.score || 0));
      setVariations([]);
      setIsVariationModalOpen(false);
      setVariationError(null);
    }
  }, [recipe]);

  useEffect(() => {
    if (recipe && originalServings > 0 && currentServings > 0) {
      const newIngredients = recipe.ingredients.map(ing =>
        adjustIngredient(ing, originalServings, currentServings)
      );
      setAdjustedIngredients(newIngredients);
    }
  }, [currentServings, originalServings, recipe]);

  if (!recipe) return null;

  const handleShare = async () => {
    const shareData = {
      title: recipe.title,
      text: `Check out this recipe for ${recipe.title}!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setShareText('Copied!');
        setTimeout(() => setShareText('Share'), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        setShareText('Failed!');
        setTimeout(() => setShareText('Share'), 2000);
      }
    }
  };

  const handlePrint = () => window.print();

  const handleRatingSubmit = (score: number) => {
    setCurrentRating(score);
    onAddRating(recipe.id, score);
  };

  const handleGenerateVariations = async () => {
    setIsGeneratingVariations(true);
    setVariationError(null);
    try {
        const result = await generateRecipeVariations(recipe);
        setVariations(result);
        setIsVariationModalOpen(true);
    } catch (e: any) {
        setVariationError(e.message || 'Failed to generate variations.');
    } finally {
        setIsGeneratingVariations(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in print:hidden"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-11/12 md:max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative print:shadow-none print:rounded-none print:max-h-full print:w-full print:overflow-visible scrollbar-hide"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors print:hidden z-10" aria-label="Close recipe modal">
            <XIcon className="h-6 w-6" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Image & Meta */}
            <div>
                <h2 className="text-3xl font-bold mb-4 text-gray-800 lg:pr-8">{recipe.title}</h2>
                <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover rounded-lg mb-6" />
                <p className="text-gray-600 mb-6">{recipe.description}</p>
                 <div className="flex flex-wrap items-center justify-between text-gray-600 mb-6 border-y py-3 gap-4">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <ClockIcon className="h-5 w-5" />
                            <span className="font-medium">{recipe.cookTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <UsersIcon className="h-5 w-5" />
                            <span className="font-medium">{recipe.servings}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 print:hidden">
                        <button onClick={handlePrint} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors" aria-label="Print recipe"><PrintIcon className="w-5 h-5" /></button>
                        <button onClick={handleShare} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors" aria-label={shareText}><ShareIcon className="w-5 h-5" /></button>
                    </div>
                </div>
                
                 <div className="space-y-4">
                    {/* RATING */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2 text-center">Rate this recipe</h4>
                        <div className="flex justify-center items-center" onMouseLeave={() => setHoverRating(0)}>
                            {[...Array(5)].map((_, i) => {
                                const ratingValue = i + 1;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleRatingSubmit(ratingValue)}
                                        onMouseEnter={() => setHoverRating(ratingValue)}
                                        className="p-1"
                                        aria-label={`Rate ${ratingValue} out of 5 stars`}
                                    >
                                        <StarIcon className="w-8 h-8 transition-colors" fill={ratingValue <= (hoverRating || currentRating) ? '#fbbf24' : 'none'} stroke={ratingValue <= (hoverRating || currentRating) ? '#fbbf24' : 'currentColor'} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {recipe.winePairing && (
                        <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-200">
                            <div className="flex items-start gap-3">
                                <WineIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-amber-800">Wine Pairing Suggestion</h4>
                                    <p className="font-bold text-gray-800 mt-1">{recipe.winePairing.suggestion}</p>
                                    <p className="text-sm text-gray-600 mt-1">{recipe.winePairing.description}</p>
                                </div>
                            </div>
                        </div>
                    )}
                 </div>
            </div>

            {/* Right Column: Ingredients & Instructions */}
            <div>
                 <div className="mb-6">
                    <h3 className="font-semibold text-xl mb-2 text-gray-700">Ingredients</h3>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                        <p className="font-medium text-gray-700">Servings:</p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentServings(s => Math.max(1, s - 1))} className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300" aria-label="Decrease servings"><MinusIcon className="w-5 h-5" /></button>
                            <span className="font-bold text-lg w-10 text-center">{currentServings}</span>
                            <button onClick={() => setCurrentServings(s => s + 1)} className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300" aria-label="Increase servings"><PlusIcon className="w-5 h-5" /></button>
                        </div>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 mt-4">
                        {adjustedIngredients.map((ing, i) => <li key={i}>{formatIngredient({ ...ing }, measurementSystem)}</li>)}
                    </ul>
                </div>
                
                 <div>
                    <h3 className="font-semibold text-xl mb-3 text-gray-700">Instructions</h3>
                    <ol className="list-decimal list-inside space-y-3 text-gray-600">
                        {recipe.instructions.map((inst, i) => <li key={i} className="pl-2">{formatInstruction(inst, measurementSystem)}</li>)}
                    </ol>
                </div>

                 <div className="mt-8 border-t pt-6 space-y-4">
                     <button
                        onClick={() => onEnterCookMode(recipe)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors font-bold"
                        aria-label="Enter cook mode"
                     >
                        <ChefHatIcon className="w-6 h-6" />
                        <span>Enter Cook Mode</span>
                    </button>
                    <button
                        onClick={handleGenerateVariations}
                        disabled={isGeneratingVariations}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-bold disabled:bg-teal-300 disabled:cursor-wait"
                    >
                        {isGeneratingVariations ? <Spinner /> : <SparklesIcon className="w-6 h-6" />}
                        <span>{isGeneratingVariations ? "Thinking..." : "Suggest Variations"}</span>
                    </button>
                    {variationError && <p className="text-red-500 text-sm text-center">{variationError}</p>}
                </div>

            </div>
          </div>
        </div>
      </div>
      <VariationModal 
        isOpen={isVariationModalOpen}
        onClose={() => setIsVariationModalOpen(false)}
        variations={variations}
        originalTitle={recipe.title}
      />
    </>
  );
};

export default RecipeModal;
