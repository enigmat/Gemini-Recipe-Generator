import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import LeafIcon from './icons/LeafIcon';
import StarIcon from './icons/StarIcon';
import { getRatingsForRecipe, saveRatingForRecipe } from '../services/ratingService';
import ClockIcon from './icons/ClockIcon';
import FireIcon from './icons/FireIcon';
import UsersIcon from './icons/UsersIcon';
import SparklesIcon from './icons/SparklesIcon';

interface RecipeCardProps {
    recipe: Recipe;
    onGenerateVariation: (recipe: Recipe) => void;
}

const ImagePlaceholder: React.FC = () => (
    <div className="w-full h-56 bg-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/50 to-transparent -translate-x-full animate-shimmer"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
    </div>
);

const ImageErrorPlaceholder: React.FC = () => (
    <div className="w-full h-56 bg-red-100 flex flex-col items-center justify-center text-red-500">
       <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
       </svg>
       <p className="mt-2 text-sm font-medium">Image failed to load</p>
   </div>
);


const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onGenerateVariation }) => {
    const shoppingList = recipe.ingredients.filter(ing => !ing.isAvailable);
    const [ratings, setRatings] = useState<number[]>([]);
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        setRatings(getRatingsForRecipe(recipe.recipeName));
    }, [recipe.recipeName]);

    const handleRateRecipe = (rating: number) => {
        saveRatingForRecipe(recipe.recipeName, rating);
        setRatings(prevRatings => [...prevRatings, rating]);
    };

    const averageRating = ratings.length > 0
        ? ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length
        : 0;

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 ease-in-out border border-border-color">
            {recipe.imageUrl === 'error' ? (
                <ImageErrorPlaceholder />
            ) : recipe.imageUrl ? (
                <img src={recipe.imageUrl} alt={recipe.recipeName} className="w-full h-56 object-cover" loading="lazy" />
            ) : (
                <ImagePlaceholder />
            )}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-text-primary">{recipe.recipeName}</h3>
                    <button 
                        onClick={() => onGenerateVariation(recipe)}
                        className="flex-shrink-0 ml-4 p-2 rounded-full text-primary hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        aria-label="Create a variation of this recipe"
                        title="Create Variation"
                    >
                        <SparklesIcon className="h-6 w-6" />
                    </button>
                </div>
                <p className="text-text-secondary mb-4">{recipe.description}</p>
                
                <div 
                    className="flex items-center gap-2 mb-4"
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Current rating: ${averageRating.toFixed(1)} stars`}
                >
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                                key={star}
                                isFilled={star <= (hoverRating || Math.round(averageRating))}
                                className={`h-6 w-6 cursor-pointer transition-colors ${
                                    star <= (hoverRating || Math.round(averageRating)) ? 'text-amber-400' : 'text-gray-300'
                                }`}
                                onMouseEnter={() => setHoverRating(star)}
                                onClick={() => handleRateRecipe(star)}
                                aria-hidden="true" // Decorative, label is on the container
                            />
                        ))}
                    </div>
                    <div className="text-sm text-text-secondary pt-0.5">
                        {averageRating > 0 ? `${averageRating.toFixed(1)}` : 'No ratings'}
                        <span className="ml-1">({ratings.length})</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 border-t border-b border-border-color py-3">
                    <div className="flex items-center text-sm text-text-secondary">
                        <ClockIcon className="h-5 w-5 mr-1.5 text-gray-500" />
                        <span>{recipe.prepTime} Prep</span>
                    </div>
                    <div className="flex items-center text-sm text-text-secondary">
                        <FireIcon className="h-5 w-5 mr-1.5 text-gray-500" />
                        <span>{recipe.cookTime} Cook</span>
                    </div>
                    <div className="flex items-center text-sm text-text-secondary">
                        <UsersIcon className="h-5 w-5 mr-1.5 text-gray-500" />
                        <span>{recipe.servings}</span>
                    </div>
                </div>

                {recipe.nutrition && (
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center">
                            <LeafIcon className="h-5 w-5 mr-2 text-primary" />
                            Nutrition Guide <span className="text-sm font-normal text-text-secondary ml-1">(approx. per serving)</span>
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center bg-green-50 p-3 rounded-lg">
                            <div>
                                <p className="font-bold text-primary">{recipe.nutrition.calories}</p>
                                <p className="text-sm text-text-secondary">Calories</p>
                            </div>
                            <div>
                                <p className="font-bold text-primary">{recipe.nutrition.protein}</p>
                                <p className="text-sm text-text-secondary">Protein</p>
                            </div>
                            <div>
                                <p className="font-bold text-primary">{recipe.nutrition.carbs}</p>
                                <p className="text-sm text-text-secondary">Carbs</p>
                            </div>
                             <div>
                                <p className="font-bold text-primary">{recipe.nutrition.fat}</p>
                                <p className="text-sm text-text-secondary">Fat</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-lg font-semibold text-text-primary mb-2">Ingredients</h4>
                        <ul className="space-y-1.5">
                            {recipe.ingredients.map((ing, index) => (
                                <li key={index} className="flex items-start">
                                    <span className={`mr-2 mt-1 text-sm ${ing.isAvailable ? 'text-green-500' : 'text-orange-500'}`}>
                                        {ing.isAvailable ? '✓' : '•'}
                                    </span>
                                    <span className="text-text-secondary">{ing.quantity} {ing.name}</span>
                                </li>
                            ))}
                        </ul>
                        {shoppingList.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-border-color">
                                <h4 className="text-lg font-semibold text-text-primary mb-2 flex items-center">
                                    <ShoppingCartIcon className="h-5 w-5 mr-2 text-primary"/>
                                    Shopping List
                                </h4>
                                <ul className="space-y-1.5">
                                    {shoppingList.map((ing, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="mr-2 mt-1 text-sm text-text-secondary">•</span>
                                            <span className="text-text-secondary">{ing.quantity} {ing.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-text-primary mb-2">Instructions</h4>
                        <ol className="list-decimal list-inside space-y-2 text-text-secondary">
                            {recipe.instructions.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;