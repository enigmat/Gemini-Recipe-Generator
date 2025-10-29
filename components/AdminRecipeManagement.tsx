import React, { useState } from 'react';
import { Recipe } from '../types';
import TrashIcon from './icons/TrashIcon';
import SparklesIcon from './icons/SparklesIcon';
import Spinner from './Spinner';
import PlusIcon from './icons/PlusIcon';

interface AdminRecipeManagementProps {
    recipes: Recipe[];
    newRecipeIds: number[];
    onDeleteRecipe: (recipeId: number) => void;
    onUpdateRecipeWithAI: (recipeId: number, title: string) => Promise<void>;
    onUpdateAllRecipeImages: () => Promise<void>;
    isUpdatingAllImages: boolean;
    onAddToNew: (recipeId: number) => void;
}

const AdminRecipeManagement: React.FC<AdminRecipeManagementProps> = ({ recipes, newRecipeIds, onDeleteRecipe, onUpdateRecipeWithAI, onUpdateAllRecipeImages, isUpdatingAllImages, onAddToNew }) => {
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [updateErrors, setUpdateErrors] = useState<Record<number, string>>({});

    const handleDelete = (recipeId: number, recipeTitle: string) => {
        if (window.confirm(`Are you sure you want to permanently delete "${recipeTitle}"? This cannot be undone.`)) {
            onDeleteRecipe(recipeId);
        }
    };
    
    const handleUpdate = async (recipeId: number, title: string) => {
        setUpdatingId(recipeId);
        setUpdateErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[recipeId];
            return newErrors;
        });
        try {
            await onUpdateRecipeWithAI(recipeId, title);
        } catch (error: any) {
            console.error("Update failed:", error);
            setUpdateErrors(prev => ({ ...prev, [recipeId]: error.message || "An error occurred." }));
        } finally {
            setUpdatingId(null);
        }
    };

    const handleUpdateAll = async () => {
        if (window.confirm(`This will use AI to regenerate images for ALL ${recipes.length} recipes. This may take a long time. Are you sure you want to proceed?`)) {
            await onUpdateAllRecipeImages();
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md relative">
            {isUpdatingAllImages && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10 animate-fade-in">
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-2xl border">
                        <Spinner size="w-6 h-6" />
                        <span className="text-slate-700 font-semibold">Updating all recipe images...</span>
                    </div>
                </div>
            )}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-slate-800">All Recipes Management</h2>
                <button
                    onClick={handleUpdateAll}
                    disabled={isUpdatingAllImages}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                    <SparklesIcon className="w-5 h-5" />
                    <span>Update All Images</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="pl-6 pr-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Image</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                            <th scope="col" className="pl-3 pr-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {[...recipes].sort((a,b) => a.title.localeCompare(b.title)).map((recipe) => {
                            const isNew = newRecipeIds.includes(recipe.id);
                            return (
                                <React.Fragment key={recipe.id}>
                                    <tr className={updatingId === recipe.id ? 'opacity-50' : ''}>
                                        <td className="pl-6 pr-3 py-4 whitespace-nowrap">
                                            <img src={recipe.image} alt={recipe.title} className="w-20 h-14 object-cover rounded-md border border-slate-200" />
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">{recipe.title}</div>
                                        </td>
                                        <td className="pl-3 pr-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => onAddToNew(recipe.id)}
                                                    disabled={isNew || updatingId !== null || isUpdatingAllImages}
                                                    className="text-green-500 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    aria-label={`Add ${recipe.title} to New This Month`}
                                                    title={isNew ? "Already in New This Month" : "Add to New This Month"}
                                                >
                                                    <PlusIcon className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleUpdate(recipe.id, recipe.title)} disabled={updatingId !== null || isUpdatingAllImages} className="text-blue-500 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed" aria-label={`Update ${recipe.title} with AI`}>
                                                    {updatingId === recipe.id ? <Spinner size="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                                                </button>
                                                <button onClick={() => handleDelete(recipe.id, recipe.title)} disabled={updatingId !== null || isUpdatingAllImages} className="text-red-500 hover:text-red-800 disabled:opacity-50" aria-label={`Delete ${recipe.title}`}>
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {updateErrors[recipe.id] && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-2 text-sm text-red-600 bg-red-50/50">
                                                <strong>Update failed:</strong> {updateErrors[recipe.id]}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminRecipeManagement;
