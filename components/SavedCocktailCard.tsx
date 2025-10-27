import React from 'react';
import { SavedCocktail } from '../types';
import TrashIcon from './icons/TrashIcon';

interface SavedCocktailCardProps {
  cocktail: SavedCocktail;
  onView: (cocktail: SavedCocktail) => void;
  onDelete: (cocktailId: string) => void;
}

const SavedCocktailCard: React.FC<SavedCocktailCardProps> = ({ cocktail, onView, onDelete }) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${cocktail.title}"?`)) {
      onDelete(cocktail.id);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 relative group flex flex-col"
      onClick={() => onView(cocktail)}
    >
      <div className="relative">
        <img src={cocktail.image} alt={cocktail.title} className="w-full h-48 object-cover" />
        <button
          onClick={handleDeleteClick}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/70 text-red-600 backdrop-blur-sm hover:bg-white"
          aria-label={`Delete ${cocktail.title}`}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{cocktail.title}</h3>
      </div>
    </div>
  );
};

export default SavedCocktailCard;
