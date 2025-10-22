
import React from 'react';
import { Recipe } from '../types';
import HeartIcon from './icons/HeartIcon';
import * as ratingService from '../services/ratingService';
import Rating from './Rating';

interface RecipeCardProps {
    recipe: Recipe;
    onClick: () => void;
    isSaved: boolean;
    onToggleSave: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, isSaved, onToggleSave }) => {
    
    const handleSaveClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the modal from opening when saving
        onToggleSave();
    };

    const ratings = ratingService.getRatingsForRecipe(recipe.title);
    const ratingCount = ratings.length;
    const averageRating = ratingCount > 0 ? ratings.reduce((a, b) => a + b, 0) / ratingCount : 0;

    return (
        <div 
            onClick={onClick}
            className="group relative block bg-black rounded-xl overflow-hidden cursor-pointer shadow-lg aspect-w-4 aspect-h-5 printable-recipe-card"
            aria-label={`View recipe for ${recipe.title}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
        >
            <img 
                alt={recipe.title}
                src={recipe.imageUrl} 
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
             <button
                onClick={handleSaveClick}
                className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-200 ${isSaved ? 'text-red-500 bg-white/20' : 'text-white bg-black/30 hover:bg-black/50'}`}
                aria-label={isSaved ? 'Unsave recipe' : 'Save recipe'}
             >
                <HeartIcon isFilled={isSaved} className="w-5 h-5" />
            </button>


            <div className="relative p-4 h-full flex flex-col justify-end">
                <h3 className="text-lg font-bold text-white leading-tight">{recipe.title}</h3>
                <div className="mt-2 flex justify-between items-center">
                    <div className="flex flex-wrap gap-1.5">
                        {recipe.tags.slice(0, 2).map(tag => (
                            <span 
                                key={tag} 
                                className="px-2 py-0.5 bg-white/20 text-white backdrop-blur-sm text-xs font-semibold rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
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
