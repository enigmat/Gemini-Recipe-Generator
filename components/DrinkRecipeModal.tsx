import React from 'react';
import { DrinkRecipe } from '../types';
import XIcon from './icons/XIcon';
import HeartIcon from './icons/HeartIcon';

interface DrinkRecipeModalProps {
    drink: DrinkRecipe;
    onClose: () => void;
    isSaved: boolean;
    onToggleSave: () => void;
}

const DrinkRecipeModal: React.FC<DrinkRecipeModalProps> = ({ drink, onClose, isSaved, onToggleSave }) => {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drink-modal-title"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                    <img
                        src={drink.imageUrl}
                        alt={drink.name}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 bg-black/50 p-1.5 rounded-full text-white hover:bg-black/75 z-10 transition-colors"
                        aria-label="Close recipe modal"
                    >
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto">
                    <h2 id="drink-modal-title" className="text-3xl font-bold text-text-primary mb-2">
                        {drink.name}
                    </h2>
                    
                    <p className="text-text-secondary mb-6">{drink.description}</p>
                    
                    <div className="text-sm font-medium grid grid-cols-2 gap-x-4 gap-y-2 mb-6 border-y border-border-color py-4">
                        <p><strong className="text-text-primary">Glassware:</strong> {drink.glassware}</p>
                        <p><strong className="text-text-primary">Garnish:</strong> {drink.garnish}</p>
                    </div>

                    <div className="mb-6">
                        <button
                            onClick={onToggleSave}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg font-semibold transition-colors duration-200 ${isSaved ? 'border-red-500 bg-red-50 text-red-600' : 'border-border-color bg-white text-text-secondary hover:bg-gray-100'}`}
                        >
                            <HeartIcon isFilled={isSaved} className="w-5 h-5" />
                            <span>{isSaved ? 'Saved in My Drinks' : 'Save to My Drinks'}</span>
                        </button>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-primary mb-3 border-b-2 border-primary/20 pb-1">Ingredients</h3>
                        <ul className="list-disc list-inside space-y-1.5 text-text-secondary pl-2">
                            {drink.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-primary mb-3 border-b-2 border-primary/20 pb-1">Instructions</h3>
                        <ol className="list-decimal list-inside space-y-4 text-text-secondary pl-2">
                            {drink.instructions.map((step, index) => (
                                <li key={index} className="pl-1">{step}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrinkRecipeModal;
