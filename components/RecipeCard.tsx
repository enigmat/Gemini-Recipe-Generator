import React from 'react';
import { Recipe } from '../types';
import HeartIcon from './icons/HeartIcon';
import ClockIcon from './icons/ClockIcon';
import UsersIcon from './icons/UsersIcon';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import CheckIcon from './icons/CheckIcon';
import StarIcon from './icons/StarIcon';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
  isFavorite: boolean;
  onToggleFavorite: (recipeId: number) => void;
  isSelected?: boolean;
  onToggleSelect?: (recipeId: number) => void;
  variant?: 'default' | 'cookbook';
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onClick, 
  isFavorite, 
  onToggleFavorite, 
  isSelected, 
  onToggleSelect,
  variant = 'default'
}) => {
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    onToggleFavorite(recipe.id);
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    if (onToggleSelect) {
      onToggleSelect(recipe.id);
    }
  };

  const showSelect = variant === 'default' && isSelected !== undefined && onToggleSelect;

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 relative group flex flex-col ${isSelected && showSelect ? 'ring-2 ring-green-500' : ''}`}
      onClick={() => onClick(recipe)}
      aria-label={`View recipe for ${recipe.title}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(recipe) }}
    >
      <div className="relative">
        <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
        {showSelect && (
          <button
            onClick={handleSelectClick}
            className={`absolute top-2 left-2 p-1.5 rounded-full transition-all duration-200 
                        ${isSelected ? 'bg-green-500 text-white' : 'bg-white/70 text-slate-700 backdrop-blur-sm hover:bg-white'}`}
            aria-label={isSelected ? 'Remove from shopping list' : 'Add to shopping list'}
          >
            {isSelected ? <CheckIcon className="w-5 h-5" /> : <ShoppingCartIcon className="w-5 h-5" />}
          </button>
        )}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 
                      ${isFavorite ? 'text-red-500 bg-white/80' : 'bg-white/70 text-slate-700'} backdrop-blur-sm hover:bg-white`}
          aria-label={isFavorite ? 'Remove from cookbook' : 'Add to cookbook'}
        >
          <HeartIcon isFilled={isFavorite} className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        {variant === 'cookbook' && recipe.tags && (
          <div className="flex flex-wrap gap-2 mb-2">
            {recipe.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full">{tag}</span>
            ))}
          </div>
        )}
        <h3 className="text-lg font-semibold text-slate-800 truncate mb-1">{recipe.title}</h3>
        
        {variant === 'default' && (
          <p className="text-sm text-slate-600 mb-3 line-clamp-2 flex-grow">{recipe.description}</p>
        )}
        
        {recipe.rating && (
            <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                    {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4 text-amber-400" fill={i < Math.round(recipe.rating?.score || 0) ? 'currentColor' : 'none'} />
                    ))}
                </div>
                <span className="text-xs text-slate-500 font-medium">
                    {recipe.rating.score.toFixed(1)} ({recipe.rating.count})
                </span>
            </div>
        )}

        <div className={`flex items-center text-slate-500 mt-auto border-t pt-3 ${variant === 'default' ? 'justify-between text-xs' : 'text-sm'}`}>
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-4 h-4" />
            <span>{recipe.cookTime}</span>
          </div>
          {variant === 'default' && (
            <div className="flex items-center space-x-1">
              <UsersIcon className="w-4 h-4" />
              <span>{recipe.servings} Servings</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;