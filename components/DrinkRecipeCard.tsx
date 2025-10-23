import React from 'react';
import { DrinkRecipe } from '../types';
import HeartIcon from './icons/HeartIcon';

interface DrinkRecipeCardProps {
    drink: DrinkRecipe;
    onClick: () => void;
    isSaved: boolean;
    onToggleSave: () => void;
}

const DrinkRecipeCard: React.FC<DrinkRecipeCardProps> = ({ drink, onClick, isSaved, onToggleSave }) => {
    
    const handleSaveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleSave();
    };

    return (
        <div 
            onClick={onClick}
            className="group block bg-white rounded-xl overflow-hidden cursor-pointer shadow-md border border-border-color hover:shadow-xl hover:border-primary/50 transition-all duration-300"
            aria-label={`View recipe for ${drink.name}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
        >
            <div className="relative aspect-[16/9] overflow-hidden">
                <img 
                    alt={drink.name}
                    src={drink.imageUrl} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
                <button
                    onClick={handleSaveClick}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-colors duration-200 ${isSaved ? 'text-red-500 bg-white/80' : 'text-gray-600 bg-white/70 backdrop-blur-sm hover:bg-white'}`}
                    aria-label={isSaved ? 'Unsave drink' : 'Save drink'}
                 >
                    <HeartIcon isFilled={isSaved} className="w-5 h-5" />
                </button>
            </div>
            
            <div className="p-4">
                <h3 className="mt-1 text-md font-bold text-text-primary leading-tight group-hover:text-primary transition-colors h-12 line-clamp-2" title={drink.name}>
                    {drink.name}
                </h3>
                <p className="mt-2 text-xs text-text-secondary line-clamp-2">
                    {drink.description}
                </p>
            </div>
        </div>
    );
};

export default DrinkRecipeCard;
