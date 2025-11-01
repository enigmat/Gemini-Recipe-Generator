import React from 'react';
import { SavedCocktail } from '../types';
import StoredImage from './StoredImage';
import PlusIcon from './icons/PlusIcon';
import CheckIcon from './icons/CheckIcon';

interface CocktailCardProps {
  cocktail: SavedCocktail;
  isSaved: boolean;
  onSave: () => void;
}

const CocktailCard: React.FC<CocktailCardProps> = ({ cocktail, isSaved, onSave }) => {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300 relative group flex flex-col">
        <div className="relative">
            <StoredImage src={cocktail.image} alt={cocktail.title} className="w-full h-48 object-cover" />
            <button
            onClick={handleSaveClick}
            disabled={isSaved}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white disabled:bg-green-500 disabled:text-white disabled:cursor-not-allowed"
            aria-label={isSaved ? 'Saved to My Bar' : 'Save to My Bar'}
            >
            {isSaved ? <CheckIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5 text-slate-700" />}
            </button>
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{cocktail.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 flex-grow">{cocktail.description}</p>
        </div>
    </div>
  );
};

export default CocktailCard;
