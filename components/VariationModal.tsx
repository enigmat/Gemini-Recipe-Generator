import React from 'react';
import { RecipeVariation } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import XIcon from './icons/XIcon';

interface VariationModalProps {
  isOpen: boolean;
  onClose: () => void;
  variations: RecipeVariation[];
  originalTitle: string;
}

const VariationModal: React.FC<VariationModalProps> = ({ isOpen, onClose, variations, originalTitle }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-11/12 md:max-w-2xl max-h-[90vh] flex flex-col p-6 md:p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-10 transition-colors" aria-label="Close modal">
          <XIcon className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-6">
          <SparklesIcon className="w-10 h-10 text-teal-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800 mt-3">Recipe Variations</h2>
          <p className="text-gray-600 mt-1">Creative twists on "{originalTitle}"</p>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-2 space-y-4">
          {variations.map((variation, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-bold text-teal-700">{variation.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{variation.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
            <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-2.5 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors text-base"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default VariationModal;