import React, { useState, useEffect } from 'react';
import { Recipe, Chef } from '../types';
import * as recipeService from '../services/recipeService';
import * as geminiService from '../services/geminiService';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';
import TrophyIcon from './icons/TrophyIcon';
import * as imageStore from '../services/imageStore';
import StoredImage from './StoredImage';
import DownloadIcon from './icons/DownloadIcon';

interface AdminFeaturedChefManagementProps {
    recipes: Recipe[];
    onMoveRecipe: (recipe: Recipe) => Promise<boolean>;
    onUpdateScheduledRecipes: (recipes: Recipe[]) => Promise<void>;
}

const AdminFeaturedChefManagement: React.FC<AdminFeaturedChefManagementProps> = ({ recipes, onMoveRecipe, onUpdateScheduledRecipes }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [movingId, setMovingId] = useState<number | null>(null);
    const [currentRecipes, setCurrentRecipes] = useState<Recipe[]>(recipes);

    useEffect(() => {
        setCurrentRecipes(recipes);
    }, [recipes]);

    const handleGenerateNewPool = async () => {
        if (!window.confirm("Are you sure you want to generate 30 new recipes? This will replace the entire existing 'Featured Chef Recipe' pool. This action can take a few minutes and cannot be undone.")) {
            return;
        }

        setIsLoading(true);
        setError(null);
        setCurrentRecipes([]); // Clear the UI immediately

        try {
            // Step 1: Generate 30 recipe details from AI
            const recipeDetailsList = await geminiService.generateBulkRecipes(30);

            const newRecipes: Recipe[] = [];

            // Step 2: Generate images for each recipe and chef, then update UI incrementally
            for (const details of recipeDetailsList) {
                // To avoid rate limiting, add a small delay
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const [recipeImage, chefImage] = await Promise.all([
                    geminiService.generateImageFromPrompt(details.title),
                    geminiService.generateImage(details.chef.imagePrompt)
                ]);

                const newId = Date.now() + Math.random(); // Temp unique ID
                
                await imageStore.setImage(String(newId), recipeImage);
                await imageStore.setImage(`chef-${newId}`, chefImage);

                const newRecipe: Recipe = {
                    id: newId,
                    image: `indexeddb:${newId}`, 
                    ...details,
                    chef: {
                        name: details.chef.name,
                        bio: details.chef.bio,
                        signatureDish: details.chef.signatureDish,
                        image: `indexeddb:chef-${newId}`
                    }
                };

                newRecipes.push(newRecipe);
                setCurrentRecipes([...newRecipes]); // Update UI for progress feedback
            }
            
            // Step 3: Save the entire new pool to the database AND update global state via callback
            await onUpdateScheduledRecipes(newRecipes);
            
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred during generation. The recipe pool may be empty. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMove = async (recipe: Recipe) => {
        setMovingId(recipe.id);
        const success = await onMoveRecipe(recipe);
        if (success) {
            // If move was successful, update local state to remove the item
            // The parent component (App.tsx) will handle the global state update and pass new props
        }
        setMovingId(null);
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <TrophyIcon className="w-7 h-7 text-amber-500" />
                        Featured Chef Recipe Pool
                    </h2>
                    <p className="text-slate-500 mt-1">This is the pool of 30 recipes that will rotate daily for all users.</p>
                </div>
                <button
                    onClick={handleGenerateNewPool}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-colors disabled:bg-teal-300 disabled:cursor-wait"
                >
                    {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5" />}
                    <span>{isLoading ? 'Generating...' : 'Generate 30 New Recipes'}</span>
                </button>
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="pl-6 pr-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-24">Day</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Image</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Chef</th>
                            <th className="pl-3 pr-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {currentRecipes.map((recipe, index) => (
                            <tr key={recipe.id} className={movingId === recipe.id ? 'opacity-50' : ''}>
                                <td className="pl-6 pr-3 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">{index + 1}</td>
                                <td className="px-3 py-4 whitespace-nowrap">
                                    <StoredImage src={recipe.image} alt={recipe.title} className="w-20 h-14 object-cover rounded-md border border-slate-200" />
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{recipe.title}</td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-500">{recipe.chef?.name}</td>
                                <td className="pl-3 pr-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleMove(recipe)}
                                        disabled={movingId === recipe.id || isLoading}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-100 text-blue-800 font-semibold rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-wait"
                                        title="Move to Main Recipe List"
                                    >
                                        {movingId === recipe.id ? <Spinner size="w-4 h-4" /> : <DownloadIcon className="w-4 h-4" />}
                                        <span>Move</span>
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {isLoading && (
                             <tr>
                                <td colSpan={5} className="text-center p-4">
                                    <div className="flex items-center justify-center gap-2 text-slate-600">
                                        <Spinner />
                                        <span>Generating recipe {Math.min(currentRecipes.length + 1, 30)} of 30...</span>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {!isLoading && currentRecipes.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-slate-500">
                                    The recipe pool is empty. Click the "Generate" button to populate it.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminFeaturedChefManagement;