



import React, { useState, useMemo, useEffect } from 'react';
import { Recipe } from '../types';
import XIcon from './icons/XIcon';
import HeartIcon from './icons/HeartIcon';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import ChefHatIcon from './icons/ChefHatIcon';
import { parseIngredient, parseServings, convertToAmerican } from '../utils/recipeUtils';
import ClockIcon from './icons/ClockIcon';
import UsersIcon from './icons/UsersIcon';
import FireIcon from './icons/FireIcon';
import * as ratingService from '../services/ratingService';
import Rating from './Rating';
import { findRecipeVideo } from '../services/geminiService';
import FilmIcon from './icons/FilmIcon';

interface RecipeModalProps {
    recipe: Recipe;
    onClose: () => void;
    isSaved: boolean;
    onToggleSave: () => void;
    onGenerateShoppingList: () => void;
    isGeneratingList: boolean;
    onStartCookMode: () => void;
    onPlayVideo: (videoUrl: string) => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose, isSaved, onToggleSave, onGenerateShoppingList, isGeneratingList, onStartCookMode, onPlayVideo }) => {
    
    const originalServings = useMemo(() => parseServings(recipe.servings), [recipe.servings]);
    const [targetServings, setTargetServings] = useState(originalServings);
    const [ratings, setRatings] = useState(() => ratingService.getRatingsForRecipe(recipe.title));
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isFindingVideo, setIsFindingVideo] = useState(true);

    useEffect(() => {
        const fetchVideo = async () => {
            setIsFindingVideo(true);
            try {
                const url = await findRecipeVideo(recipe.title);
                setVideoUrl(url);
            } catch (error) {
                console.error("Error fetching video for recipe:", error);
                setVideoUrl(null);
            } finally {
                setIsFindingVideo(false);
            }
        };

        fetchVideo();
    }, [recipe.title]);

    const averageRating = useMemo(() => {
        return ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    }, [ratings]);

    const handleRateRecipe = (newRating: number) => {
        ratingService.saveRatingForRecipe(recipe.title, newRating);
        setRatings(prev => [...prev, newRating]);
    };

    const handleServingChange = (change: number) => {
        setTargetServings(prev => Math.max(1, prev + change));
    };

    const adjustedIngredients = useMemo(() => {
        if (!originalServings || originalServings === 0 || !recipe.ingredients) {
            return recipe.ingredients || [];
        }
        
        const multiplier = targetServings / originalServings;

        return recipe.ingredients.map(ingStr => {
            const parsed = parseIngredient(ingStr);

            if (!parsed || parsed.quantity === 0) {
                return ingStr; // Return original string if not parsable or no quantity
            }

            const newQuantity = parsed.quantity * multiplier;
            
            if (newQuantity === 0) return parsed.name;

            const { newQuantityStr, newUnit } = convertToAmerican(newQuantity, parsed.unit);
            
            const formattedString = `${newQuantityStr} ${newUnit} ${parsed.name}`.replace(/\s+/g, ' ').trim();
            // Handle pluralization for non-standard units
            if (newQuantity > 1 && !newUnit.endsWith('s')) {
                 if (parsed.unit && !convertToAmerican(1, parsed.unit).newUnit.endsWith('s')) {
                    return `${newQuantityStr} ${newUnit}s ${parsed.name}`.replace(/\s+/g, ' ').trim();
                 }
            }

            return formattedString;
        });

    }, [recipe.ingredients, originalServings, targetServings]);
    
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
                        
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                        {recipe.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{tag}</span>
                        ))}
                    </div>
                    <p className="text-text-secondary mb-6">{recipe.description}</p>
                    
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-6 border-y border-border-color py-4">
                        <div>
                            <ClockIcon className="w-6 h-6 mx-auto text-primary mb-1" />
                            <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">Prep Time</p>
                            <p className="font-semibold text-text-primary">{recipe.prepTime}</p>
                        </div>
                        <div>
                            <ClockIcon className="w-6 h-6 mx-auto text-primary mb-1" />
                            <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">Cook Time</p>
                            <p className="font-semibold text-text-primary">{recipe.cookTime}</p>
                        </div>
                        <div>
                            <UsersIcon className="w-6 h-6 mx-auto text-primary mb-1" />
                            <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">Servings</p>
                            <p className="font-semibold text-text-primary">{parseServings(recipe.servings)}</p>
                        </div>
                        <div>
                            <FireIcon className="w-6 h-6 mx-auto text-primary mb-1" />
                            <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">Calories</p>
                            <p className="font-semibold text-text-primary">{recipe.nutrition.calories}</p>
                        </div>
                    </div>

                    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-border-color">
                        <h4 className="text-md font-semibold text-text-primary mb-2 text-center">Rate this recipe</h4>
                        <div className="flex justify-center">
                            <Rating
                                averageRating={averageRating}
                                ratingCount={ratings.length}
                                onRate={handleRateRecipe}
                                size="lg"
                            />
                        </div>
                    </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        <button
                            onClick={onToggleSave}
                            className={`flex items-center justify-center gap-2 px-4 py-2 border-2 rounded-lg font-semibold transition-colors duration-200 ${isSaved ? 'border-red-500 bg-red-50 text-red-600' : 'border-border-color bg-white text-text-secondary hover:bg-gray-100'}`}
                        >
                            <HeartIcon isFilled={isSaved} className="w-5 h-5" />
                            <span>{isSaved ? 'Saved' : 'Save'}</span>
                        </button>
                         <button
                            onClick={onGenerateShoppingList}
                            disabled={isGeneratingList}
                            className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-semibold transition-colors duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-500"
                        >
                            {isGeneratingList ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                            ) : (
                                <ShoppingCartIcon className="w-5 h-5" />
                            )}
                            <span>{isGeneratingList ? 'Generating...' : 'Shopping List'}</span>
                        </button>
                        <button
                            onClick={onStartCookMode}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold shadow-sm hover:bg-primary-focus transition-colors duration-200"
                        >
                            <ChefHatIcon className="w-5 h-5" />
                            <span>Cook Mode</span>
                        </button>
                        {isFindingVideo ? (
                             <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 rounded-lg font-semibold">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                                <span>Finding Video...</span>
                            </div>
                        ) : videoUrl ? (
                             <button
                                onClick={() => onPlayVideo(videoUrl)}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow-sm hover:bg-blue-600 transition-colors duration-200"
                            >
                                <FilmIcon className="w-5 h-5" />
                                <span>Watch Video</span>
                            </button>
                        ) : null}
                    </div>


                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-primary mb-3 border-b-2 border-primary/20 pb-1">Ingredients</h3>
                         {/* Servings Adjuster */}
                        <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg my-4 border border-border-color">
                            <span className="font-semibold text-text-secondary">Servings:</span>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => handleServingChange(-1)}
                                    disabled={targetServings <= 1}
                                    className="p-1 w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-lg font-bold text-text-secondary hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Decrease servings"
                                >
                                    -
                                </button>
                                <span className="text-lg font-bold text-text-primary w-10 text-center" aria-live="polite">{targetServings}</span>
                                <button 
                                    onClick={() => handleServingChange(1)}
                                    className="p-1 w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-lg font-bold text-text-secondary hover:bg-gray-300"
                                    aria-label="Increase servings"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <ul className="list-disc list-inside space-y-1.5 text-text-secondary pl-2">
                            {adjustedIngredients.map((ingredient, index) => (
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