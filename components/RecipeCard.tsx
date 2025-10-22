
import React from 'react';
import { Recipe } from '../types';
import HeartIcon from './icons/HeartIcon';
import * as ratingService from '../services/ratingService';
import Rating from './Rating';
import ClockIcon from './icons/ClockIcon';

interface RecipeCardProps {
    recipe: Recipe;
    onClick: () => void;
    isSaved: boolean;
    onToggleSave: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, isSaved, onToggleSave }) => {
    
    const handleSaveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleSave();
    };

    const ratings = ratingService.getRatingsForRecipe(recipe.title);
    const ratingCount = ratings.length;
    const averageRating = ratingCount > 0 ? ratings.reduce((a, b) => a + b, 0) / ratingCount : 0;

    return (
        <div 
            onClick={onClick}
            className="group block bg-white rounded-xl overflow-hidden cursor-pointer shadow-md border border-border-color hover:shadow-xl hover:border-primary/50 transition-all duration-300 printable-recipe-card"
            aria-label={`View recipe for ${recipe.title}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
        >
            <div className="relative aspect-[16/9] overflow-hidden">
                <img 
                    alt={recipe.title}
                    src={recipe.imageUrl} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
                <button
                    onClick={handleSaveClick}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-colors duration-200 ${isSaved ? 'text-red-500 bg-white/80' : 'text-gray-600 bg-white/70 backdrop-blur-sm hover:bg-white'}`}
                    aria-label={isSaved ? 'Unsave recipe' : 'Save recipe'}
                 >
                    <HeartIcon isFilled={isSaved} className="w-5 h-5" />
                </button>
            </div>
            
            <div className="p-4">
                <div className="flex flex-wrap gap-1.5 min-h-[26px]">
                    {recipe.tags.slice(0, 3).map(tag => (
                        <span 
                            key={tag} 
                            className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <h3 className="mt-1 text-md font-bold text-text-primary leading-tight group-hover:text-primary transition-colors duration-200 h-12 line-clamp-2" title={recipe.title}>
                    {recipe.title}
                </h3>
                <div className="mt-2 pt-2 border-t border-border-color flex justify-between items-center text-xs text-text-secondary">
                    <div className="flex items-center gap-1.5">
                        <ClockIcon className="w-4 h-4" />
                        <span>{recipe.cookTime}</span>
                    </div>
                    {ratingCount > 0 && (
                        <Rating averageRating={averageRating} ratingCount={ratingCount} size="sm" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
