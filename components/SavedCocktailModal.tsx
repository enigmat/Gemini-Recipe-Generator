import React from 'react';
import { SavedCocktail } from '../types';
import XIcon from './icons/XIcon';

interface SavedCocktailModalProps {
  cocktail: SavedCocktail | null;
  onClose: () => void;
}

const SavedCocktailModal: React.FC<SavedCocktailModalProps> = ({ cocktail, onClose }) => {
  if (!cocktail) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-11/12 md:max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors z-10" aria-label="Close modal">
          <XIcon className="h-6 w-6" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800 lg:pr-8">{cocktail.title}</h2>
            <img src={cocktail.image} alt={cocktail.title} className="w-full h-80 object-cover rounded-lg mb-6" />
            <p className="text-gray-600 mb-6">{cocktail.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4 bg-gray-50 p-4 rounded-lg border">
              <div>
                <p className="font-semibold text-gray-700">Glassware:</p>
                <p className="text-gray-600">{cocktail.glassware}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Garnish:</p>
                <p className="text-gray-600">{cocktail.garnish}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-xl mb-3 text-gray-700">Ingredients</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {cocktail.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
            <h3 className="font-semibold text-xl mt-6 mb-3 text-gray-700">Instructions</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              {cocktail.instructions.map((inst, i) => <li key={i} className="pl-2">{inst}</li>)}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedCocktailModal;
