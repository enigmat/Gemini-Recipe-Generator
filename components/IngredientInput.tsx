
import React, { useState } from 'react';
import PlusIcon from './icons/PlusIcon';
import XIcon from './icons/XIcon';

interface IngredientInputProps {
    ingredients: string[];
    setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, setIngredients }) => {
    const [currentIngredient, setCurrentIngredient] = useState('');

    const handleAddIngredient = () => {
        const trimmedIngredient = currentIngredient.trim();
        if (trimmedIngredient && !ingredients.includes(trimmedIngredient)) {
            setIngredients([...ingredients, trimmedIngredient]);
            setCurrentIngredient('');
        }
    };

    const handleRemoveIngredient = (ingredientToRemove: string) => {
        setIngredients(ingredients.filter(ing => ing !== ingredientToRemove));
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddIngredient();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-md border border-border-color">
                <input
                    type="text"
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g., chicken breast, tomatoes, rice"
                    className="flex-grow p-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                />
                <button
                    onClick={handleAddIngredient}
                    className="bg-primary text-white p-2 rounded-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-colors duration-200"
                    aria-label="Add ingredient"
                >
                    <PlusIcon className="h-6 w-6" />
                </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
                {ingredients.map((ingredient) => (
                    <span key={ingredient} className="flex items-center bg-green-100 text-green-800 text-sm font-medium pl-3 pr-1 py-1 rounded-full">
                        {ingredient}
                        <button
                            onClick={() => handleRemoveIngredient(ingredient)}
                            className="ml-1.5 p-0.5 rounded-full text-green-600 hover:bg-green-200 focus:outline-none"
                            aria-label={`Remove ${ingredient}`}
                        >
                           <XIcon className="h-4 w-4" />
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default IngredientInput;
