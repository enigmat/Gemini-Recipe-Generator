import React, { useState } from 'react';
import { Recipe } from '../types';
import { generateRecipeFromUrl, generateImageFromPrompt } from '../services/geminiService';
import UrlInput from './UrlInput';
import LinkIcon from './icons/LinkIcon';

interface RecipeUrlFinderProps {
  onRecipeGenerated: (recipeDetails: Omit<Recipe, 'id' | 'image'>, image: string) => void;
}

const RecipeUrlFinder: React.FC<RecipeUrlFinderProps> = ({ onRecipeGenerated }) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async (url: string) => {
    setIsExtracting(true);
    setError(null);
    try {
      const recipeDetails = await generateRecipeFromUrl(url);
      const image = await generateImageFromPrompt(recipeDetails.title);
      onRecipeGenerated(recipeDetails, image);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try a different URL.');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in">
        <LinkIcon className="w-12 h-12 text-teal-500 mx-auto" />
        <h2 className="text-3xl font-bold text-gray-800 mt-4">Find Recipe By URL</h2>
        <p className="text-gray-600 mt-2 mb-8 max-w-lg mx-auto">
          Found a recipe online? Paste the URL below and let our AI extract, format, and add it to your collection.
        </p>
        <UrlInput
          onExtract={handleExtract}
          isExtracting={isExtracting}
          error={error}
        />
      </div>
    </div>
  );
};

export default RecipeUrlFinder;