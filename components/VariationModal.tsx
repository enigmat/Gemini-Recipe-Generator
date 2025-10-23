import React, { useState } from 'react';
import { Recipe } from '../types';
import XIcon from './icons/XIcon';
import SparklesIcon from './icons/SparklesIcon';

interface VariationModalProps {
    recipe: Recipe;
    onClose: () => void;
    onGenerate: (originalRecipe: Recipe, variationRequest: string) => void;
    isLoading: boolean;
    error?: string | null;
}

const VariationModal: React.FC<VariationModalProps> = ({ recipe, onClose, onGenerate, isLoading, error }) => {
    const [variationRequest, setVariationRequest] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (variationRequest.trim()) {
            onGenerate(recipe, variationRequest);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity"
            role="dialog" 
            aria-modal="true"
            aria-labelledby="variation-modal-title"
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden relative transform transition-all">
                <div className="p-6">
                     <button 
                        onClick={onClose} 
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10" 
                        aria-label="Close variation modal"
                        disabled={isLoading}
                    >
                        <XIcon className="h-6 w-6" />
                    </button>
                    <h2 id="variation-modal-title" className="text-2xl font-bold text-text-primary mb-2">
                        Create a Variation
                    </h2>
                    <p className="text-text-secondary mb-4">
                        How would you like to change <strong className="text-primary">{recipe.title}</strong>?
                    </p>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="variation-request" className="block text-sm font-medium text-text-secondary mb-1">
                            Your Request
                        </label>
                        <textarea
                            id="variation-request"
                            value={variationRequest}
                            onChange={(e) => setVariationRequest(e.target.value)}
                            placeholder="e.g., Make this vegetarian, add more spice, make it low-carb..."
                            className="w-full p-2 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={3}
                            required
                            disabled={isLoading}
                        />

                        {error && (
                            <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading || !variationRequest.trim()}
                                className="w-full md:w-auto px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="h-5 w-5" />
                                        <span>Generate Variation</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VariationModal;