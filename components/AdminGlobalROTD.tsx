import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import * as globalRecipeService from '../services/globalRecipeService';
import * as geminiService from '../services/geminiService';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';
import TrophyIcon from './icons/TrophyIcon';
import * as imageStore from '../services/imageStore';
import StoredImage from './StoredImage';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import AdminEditRecipeModal from './AdminEditRecipeModal';

const AdminGlobalROTD: React.FC = () => {
    const [scheduledRecipes, setScheduledRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState('');

    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [updatingImageId, setUpdatingImageId] = useState<number | null>(null);

    useEffect(() => {
        setScheduledRecipes(globalRecipeService.getScheduledRecipes());
    }, []);

    const handleGenerateNewPool = async () => {
        if (!window.confirm("Are you sure you want to generate 30 new recipes? This will replace the entire global 'Recipe of the Day' pool. This can take a few minutes.")) {
            return;
        }

        setIsLoading(true);
        setError(null);
        setProgress('Starting recipe generation...');
        
        try {
            const recipeDetailsList = await geminiService.generateBulkRecipes(30);
            const newRecipes: Recipe[] = [];

            for (let i = 0; i < recipeDetailsList.length; i++) {
                const details = recipeDetailsList[i];
                setProgress(`(${i + 1}/30) Generating image for "${details.title}"...`);
                await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
                
                const image = await geminiService.generateImageFromPrompt(details.title);
                const newId = Date.now() + Math.random();
                
                await imageStore.setImage(String(newId), image);

                const newRecipe: Recipe = {
                    id: newId,
                    image: `indexeddb:${newId}`, 
                    ...details
                };
                newRecipes.push(newRecipe);
            }
            globalRecipeService.saveScheduledRecipes(newRecipes);
            setScheduledRecipes(newRecipes);
            setProgress('');
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred during generation.');
            setProgress('');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDelete = (recipeId: number, recipeTitle: string) => {
        if (window.confirm(`Are you sure you want to delete "${recipeTitle}" from the pool? This cannot be undone.`)) {
            const updatedRecipes = scheduledRecipes.filter(r => r.id !== recipeId);
            globalRecipeService.saveScheduledRecipes(updatedRecipes);
            setScheduledRecipes(updatedRecipes);
        }
    };

    const handleUpdateImage = async (recipeToUpdate: Recipe) => {
        setUpdatingImageId(recipeToUpdate.id);
        try {
            const image = await geminiService.generateImageFromPrompt(recipeToUpdate.title);
            const imageId = recipeToUpdate.id.toString();
            await imageStore.setImage(imageId, image);

            // create a new image src with a timestamp to bust cache
            const newImageSrc = `indexeddb:${imageId}?v=${Date.now()}`;
            
            const updatedRecipes = scheduledRecipes.map(r => 
                r.id === recipeToUpdate.id ? { ...r, image: newImageSrc } : r
            );
            globalRecipeService.saveScheduledRecipes(updatedRecipes);
            setScheduledRecipes(updatedRecipes);
        } catch (err) {
            console.error("Failed to update image:", err);
            alert('Failed to update image. See console for details.');
        } finally {
            setUpdatingImageId(null);
        }
    };

    const handleEdit = (recipe: Recipe) => {
        setEditingRecipe(recipe);
        setIsEditModalOpen(true);
    };

    const handleSaveRecipe = (updatedRecipe: Recipe) => {
        const updatedRecipes = scheduledRecipes.map(r => r.id === updatedRecipe.id ? updatedRecipe : r);
        globalRecipeService.saveScheduledRecipes(updatedRecipes);
        setScheduledRecipes(updatedRecipes);
        setIsEditModalOpen(false);
        setEditingRecipe(null);
    };

    return (
        <>
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <TrophyIcon className="w-7 h-7 text-amber-500" />
                            Global Recipe of the Day Pool
                        </h2>
                        <p className="text-slate-500 mt-1">This pool is used to automatically select a recipe of the day for all users.</p>
                    </div>
                    <button
                        onClick={handleGenerateNewPool}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-colors disabled:bg-teal-300 disabled:cursor-wait"
                    >
                        {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5" />}
                        <span>{isLoading ? 'Generating...' : 'Generate New Pool (30)'}</span>
                    </button>
                </div>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {progress && <p className="text-blue-600 text-center mb-4 font-semibold">{progress}</p>}
                
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="pl-6 pr-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-16">#</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Image</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                                <th className="pl-3 pr-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                                <th className="pl-3 pr-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
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
                                    <td className="pl-3 pr-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleUpdateImage(recipe)}
                                                disabled={updatingImageId !== null || isLoading}
                                                className="text-blue-500 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Regenerate Image with AI"
                                            >
                                                {updatingImageId === recipe.id ? <Spinner size="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                                            </button>
                                            <button
                                                onClick={() => handleEdit(recipe)}
                                                disabled={updatingImageId !== null || isLoading}
                                                className="text-slate-500 hover:text-slate-800 disabled:opacity-50"
                                                title="Edit Recipe"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(recipe.id, recipe.title)}
                                                disabled={updatingImageId !== null || isLoading}
                                                className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                                title="Delete Recipe"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!isLoading && scheduledRecipes.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-slate-500">
                                        The global recipe pool is empty. Click "Generate" to populate it.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isEditModalOpen && editingRecipe && (
                <AdminEditRecipeModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    recipe={editingRecipe}
                    onSave={handleSaveRecipe}
                />
            )}
        </>
    );
};

export default AdminGlobalROTD;