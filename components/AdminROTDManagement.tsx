import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import * as recipeService from '../services/recipeService';
import * as geminiService from '../services/geminiService';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';
import TrophyIcon from './icons/TrophyIcon';
import * as imageStore from '../services/imageStore';
import StoredImage from './StoredImage';

const AdminROTDManagement: React.FC = () => {
    const [scheduledRecipes, setScheduledRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setScheduledRecipes(recipeService.getScheduledRecipes());
    }, []);

    const handleGenerateNewPool = async () => {
        if (!window.confirm("Are you sure you want to generate 30 new recipes? This will replace the entire existing 'Recipe of the Day' pool. This action can take a few minutes and cannot be undone.")) {
            return;
        }

        setIsLoading(true);
        setError(null);
        // Clear the existing pool immediately to show progress from scratch
        setScheduledRecipes([]);
        recipeService.saveScheduledRecipes([]);

        try {
            // Step 1: Generate 30 recipe details
            const recipeDetailsList = await geminiService.generateBulkRecipes(30);

            // This will hold the successfully generated recipes
            const newRecipes: Recipe[] = [];

            // Step 2: Generate images for each recipe and save incrementally
            for (const details of recipeDetailsList) {
                // To avoid rate limiting, add a small delay
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const image = await geminiService.generateImageFromPrompt(details.title);
                const newId = Date.now() + Math.random(); // Temp unique ID
                
                await imageStore.setImage(String(newId), image);

                const newRecipe: Recipe = {
                    id: newId,
                    image: `indexeddb:${newId}`, 
                    ...details
                };

                newRecipes.push(newRecipe);

                // Update UI and save to localStorage on each successful generation
                setScheduledRecipes([...newRecipes]);
                recipeService.saveScheduledRecipes(newRecipes);
            }
            
            // Final state update
            setScheduledRecipes(newRecipes);

        } catch (err: any) {
            setError(err.message || 'An unknown error occurred during generation. Any recipes generated so far have been saved.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <TrophyIcon className="w-7 h-7 text-amber-500" />
                        Recipe of the Day Pool
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
                            <th className="pl-3 pr-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {scheduledRecipes.map((recipe, index) => (
                            <tr key={recipe.id}>
                                <td className="pl-6 pr-3 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">{index + 1}</td>
                                <td className="px-3 py-4 whitespace-nowrap">
                                    <StoredImage src={recipe.image} alt={recipe.title} className="w-20 h-14 object-cover rounded-md border border-slate-200" />
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{recipe.title}</td>
                                <td className="pl-3 pr-6 py-4">
                                    <p className="text-sm text-slate-500 line-clamp-2">{recipe.description}</p>
                                </td>
                            </tr>
                        ))}

                        {isLoading && (
                             <tr>
                                <td colSpan={4} className="text-center p-4">
                                    <div className="flex items-center justify-center gap-2 text-slate-600">
                                        <Spinner />
                                        <span>Generating recipe {Math.min(scheduledRecipes.length + 1, 30)} of 30...</span>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {!isLoading && scheduledRecipes.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-12 text-slate-500">
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

export default AdminROTDManagement;