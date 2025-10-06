import React from 'react';
import { Recipe } from '../types';
import XIcon from './icons/XIcon';
import HeartIcon from './icons/HeartIcon';

interface RecipeModalProps {
    recipe: Recipe;
    onClose: () => void;
    isSaved: boolean;
    onToggleSave: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose, isSaved, onToggleSave }) => {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="recipe-modal-title"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
                onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
                <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
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
                    <div className="flex justify-between items-start">
                        <h2 id="recipe-modal-title" className="text-3xl font-bold text-text-primary mb-2 flex-1 pr-4">
                            {recipe.title}
                        </h2>
                        <button
                            onClick={onToggleSave}
                            className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg font-semibold transition-colors duration-200 ${isSaved ? 'border-red-500 bg-red-50 text-red-600' : 'border-border-color bg-white text-text-secondary hover:bg-gray-100'}`}
                        >
                            <HeartIcon isFilled={isSaved} className="w-5 h-5" />
                            <span>{isSaved ? 'Saved' : 'Save'}</span>
                        </button>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                        {recipe.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{tag}</span>
                        ))}
                    </div>
                    <p className="text-text-secondary mb-6">{recipe.description}</p>


                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-primary mb-3 border-b-2 border-primary/20 pb-1">Ingredients</h3>
                        <ul className="list-disc list-inside space-y-1.5 text-text-secondary pl-2">
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-primary mb-3 border-b-2 border-primary/20 pb-1">Instructions</h3>
                        <ol className="list-decimal list-inside space-y-4 text-text-secondary pl-2">
                            {recipe.instructions.map((step, index) => (
                                <li key={index} className="pl-1">{step}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeModal;