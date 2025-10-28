import React, { useState } from 'react';
import PlusIcon from './icons/PlusIcon';
import XIcon from './icons/XIcon';

interface IngredientInputProps {
  ingredients: string[];
  onChange: (ingredients: string[]) => void;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddIngredient = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !ingredients.map(i => i.toLowerCase()).includes(trimmedValue.toLowerCase())) {
      onChange([...ingredients, trimmedValue]);
      setInputValue('');
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    onChange(ingredients.filter(ing => ing !== ingredientToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  return (
    <div>
        <div className="relative">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., chicken breast, tomatoes, rice"
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow text-base text-gray-900 placeholder-gray-500"
                aria-label="Add an ingredient"
            />
            <button
                onClick={handleAddIngredient}
                className="absolute inset-y-0 right-0 m-1.5 w-9 h-9 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition-colors flex items-center justify-center disabled:bg-teal-300"
                disabled={!inputValue.trim()}
                aria-label="Add ingredient"
            >
                <PlusIcon className="w-6 h-6" />
            </button>
        </div>
        {ingredients.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
            {ingredients.map((ingredient) => (
                <div
                key={ingredient}
                className="flex items-center gap-2 bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1.5 rounded-full animate-fade-in"
                >
                <span>{ingredient}</span>
                <button onClick={() => handleRemoveIngredient(ingredient)} aria-label={`Remove ${ingredient}`}>
                    <XIcon className="w-4 h-4 text-teal-700 hover:text-teal-900" />
                </button>
                </div>
            ))}
            </div>
        )}
    </div>
  );
};

export default IngredientInput;
