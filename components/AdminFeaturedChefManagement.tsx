
import React, { useState, useEffect, useMemo } from 'react';
import { Recipe } from '../types';
import * as geminiService from '../services/geminiService';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';
import TrophyIcon from './icons/TrophyIcon';
import * as imageStore from '../services/imageStore';
import StoredImage from './StoredImage';
import DownloadIcon from './icons/DownloadIcon';
import StarIcon from './icons/StarIcon';
import CheckIcon from './icons/CheckIcon';
import TrashIcon from './icons/TrashIcon';
import PlusIcon from './icons/PlusIcon';

interface AdminFeaturedChefManagementProps {
    recipes: Recipe[];
    featuredChefs: Recipe[];
    allRecipes: Recipe[];
    onMoveRecipe: (recipe: Recipe) => Promise<boolean>;
    onUpdateScheduledRecipes: (recipes: Recipe[]) => Promise<void>;
    onFeatureChef: (recipe: Recipe) => void;
    onAddToPool: (recipeId: number) => void;
}

const AdminFeaturedChefManagement: React.FC<AdminFeaturedChefManagementProps> = ({ recipes, featuredChefs, allRecipes, onMoveRecipe, onUpdateScheduledRecipes, onFeatureChef, onAddToPool }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [movingId, setMovingId] = useState<number | null>(null);
    const [featuringId, setFeaturingId] = useState<number | null>(null);
    const [currentRecipes, setCurrentRecipes] = useState<Recipe[]>(recipes);
    const [activeTab, setActiveTab] = useState<'pool' | 'library'>('pool');
    const [searchTerm, setSearchTerm] = useState('');

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
            const recipeDetailsList = await geminiService.generateBulkRecipes(30);
            const newRecipes: Recipe[] = [];
            for (const details of recipeDetailsList) {
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const [recipeImage, chefImage] = await Promise.all([
                    geminiService.generateImageFromPrompt(details.title),
                    geminiService.generateImage((details.chef as any).imagePrompt)
                ]);

                const newId = Date.now() + Math.random();
                
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
                setCurrentRecipes([...newRecipes]);
            }
            await onUpdateScheduledRecipes(newRecipes);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred during generation. The recipe pool may be empty. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMove = async (recipe: Recipe) => {
        setMovingId(recipe.id);
        await onMoveRecipe(recipe);
        setMovingId(null);
    };
    
    const handleFeature = (recipe: Recipe) => {
        setFeaturingId(recipe.id);
        onFeatureChef(recipe);
        setTimeout(() => setFeaturingId(null), 500);
    };

    const isChefFeatured = (recipe: Recipe): boolean => {
        if (!recipe.chef) return false;
        return featuredChefs.some(fc => fc.chef?.name === recipe.chef?.name);
    };
    
    const handleDeleteAll = async () => {
        if (window.confirm(`Are you sure you want to delete all ${currentRecipes.length} recipes from this pool? This action cannot be undone.`)) {
            setIsLoading(true);
            setError(null);
            try {
                await onUpdateScheduledRecipes([]);
            } catch (err: any) {
                setError("Failed to delete the recipe pool. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const filteredLibraryRecipes = useMemo(() => {
        if (!allRecipes) return [];
        return allRecipes
            .filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => a.title.localeCompare(b.title));
    }, [allRecipes, searchTerm]);

    const scheduledRecipeIds = useMemo(() => new Set(recipes.map(r => r.id)), [recipes]);

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <TrophyIcon className="w-7 h-7 text-amber-500" />
                        Featured Chef Recipe Pool
                    </h2>
                    <p className="text-slate-500 mt-1">This is the pool of recipes that will rotate daily for all users.</p>
                </div>
            </div>

            <div className="border-b border-slate-200 mb-6">
                <nav className="flex gap-4 -mb-px">
                    <button onClick={() => setActiveTab('pool')} className={`py-3 px-1 border-b-2 text-sm font-medium ${activeTab === 'pool' ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                        Current Pool ({recipes.length})
                    </button>
                    <button onClick={() => setActiveTab('library')} className={`py-3 px-1 border-b-2 text-sm font-medium ${activeTab === 'library' ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                        Add from Library
                    </button>
                </nav>
            </div>

            {activeTab === 'pool' && (
                <div className="animate-fade-in">
                    <div className="flex items-center gap-2 mb-6">
                        <button
                            onClick={handleDeleteAll}
                            disabled={isLoading || recipes.length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
                        >
                            <TrashIcon className="w-5 h-5" />
                            <span>Delete All</span>
                        </button>
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
                                {currentRecipes.map((recipe, index) => {
                                    const isFeatured = isChefFeatured(recipe);
                                    return (
                                        <tr key={recipe.id} className={(movingId === recipe.id || featuringId === recipe.id) ? 'opacity-50' : ''}>
                                            <td className="pl-6 pr-3 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">{index + 1}</td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <StoredImage src={recipe.image} alt={recipe.title} className="w-20 h-14 object-cover rounded-md border border-slate-200" />
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{recipe.title}</td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-500">{recipe.chef?.name}</td>
                                            <td className="pl-3 pr-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleFeature(recipe)}
                                                        disabled={isFeatured || isLoading || movingId !== null}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-yellow-100 text-yellow-800 font-semibold rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title={isFeatured ? "Chef is already featured" : "Add to public 'Featured Chefs' list"}
                                                    >
                                                        {featuringId === recipe.id ? <Spinner size="w-4 h-4" /> : isFeatured ? <CheckIcon className="w-4 h-4" /> : <StarIcon className="w-4 h-4" />}
                                                        <span>{isFeatured ? 'Featured' : 'Feature'}</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleMove(recipe)}
                                                        disabled={movingId === recipe.id || isLoading || featuringId !== null}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-100 text-blue-800 font-semibold rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-wait"
                                                        title="Move to Main Recipe List & remove from pool"
                                                    >
                                                        {movingId === recipe.id ? <Spinner size="w-4 h-4" /> : <DownloadIcon className="w-4 h-4" />}
                                                        <span>Move</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

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
            )}
            
            {activeTab === 'library' && (
                <div className="animate-fade-in">
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">Add Recipes from Your Main Library</h3>
                    <p className="text-sm text-slate-500 mb-4">Click "Add to Pool" to include a recipe in the daily rotation. Recipes added here will appear in the "Current Pool" tab.</p>
                    <input
                        type="text"
                        placeholder="Search library by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-sm mb-4 px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <div className="overflow-x-auto max-h-[60vh]">
                        <table className="min-w-full">
                            <thead className="bg-slate-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {filteredLibraryRecipes.map(recipe => {
                                    const isInPool = scheduledRecipeIds.has(recipe.id);
                                    return (
                                        <tr key={recipe.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StoredImage src={recipe.image} alt={recipe.title} className="w-16 h-12 object-cover rounded-md border" />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{recipe.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => onAddToPool(recipe.id)}
                                                    disabled={isInPool}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-100 text-blue-800 font-semibold rounded-lg hover:bg-blue-200 transition-colors disabled:bg-green-100 disabled:text-green-800 disabled:cursor-not-allowed"
                                                >
                                                    {isInPool ? <CheckIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
                                                    <span>{isInPool ? 'In Pool' : 'Add to Pool'}</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFeaturedChefManagement;
