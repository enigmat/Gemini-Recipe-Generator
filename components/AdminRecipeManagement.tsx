import React, { useState } from 'react';
import { Recipe } from '../types';
import TrashIcon from './icons/TrashIcon';
import SparklesIcon from './icons/SparklesIcon';
import Spinner from './Spinner';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface AdminRecipeManagementProps {
    recipes: Recipe[];
    onDeleteRecipe: (recipeId: number) => void;
    onUpdateRecipeWithAI: (recipeId: number, title: string) => Promise<void>;
}

const AdminRecipeManagement: React.FC<AdminRecipeManagementProps> = ({ recipes, onDeleteRecipe, onUpdateRecipeWithAI }) => {
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [updateErrors, setUpdateErrors] = useState<Record<number, string>>({});

    const handleDelete = (recipeId: number, recipeTitle: string) => {
        if (window.confirm(`Are you sure you want to permanently delete "${recipeTitle}"? This cannot be undone.`)) {
            onDeleteRecipe(recipeId);
        }
    };
    
    const handleUpdate = async (recipeId: number, title: string) => {
        if (window.confirm(`This will use AI to completely regenerate the image and info for "${title}". Are you sure?`)) {
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
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recipe Management</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="pl-6 pr-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="pl-3 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {[...recipes].sort((a,b) => a.title.localeCompare(b.title)).map((recipe) => (
                            <React.Fragment key={recipe.id}>
                                <tr className="relative">
                                    {updatingId === recipe.id && (
                                        <td colSpan={4} className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                                            <div className="flex items-center gap-2 text-gray-700 font-semibold">
                                                <Spinner />
                                                <span>Updating with AI...</span>
                                            </div>
                                        </td>
                                    )}
                                    <td className="pl-6 pr-3 py-4 whitespace-nowrap">
                                        <img src={recipe.image} alt={recipe.title} className="w-20 h-14 object-cover rounded-md border border-gray-200" />
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{recipe.title}</div>
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                            All Recipes
                                        </span>
                                    </td>
                                    <td className="pl-3 pr-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <select disabled={!!updatingId} className="appearance-none bg-white border border-gray-300 rounded-md py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800 disabled:opacity-50">
                                                    <option>All Recipes</option>
                                                </select>
                                                <ChevronDownIcon className="w-4 h-4 text-gray-500 absolute top-1/2 right-2.5 transform -translate-y-1/2 pointer-events-none" />
                                            </div>
                                            <button onClick={() => handleUpdate(recipe.id, recipe.title)} disabled={!!updatingId} className="text-blue-500 hover:text-blue-800 disabled:opacity-50" aria-label={`Update ${recipe.title} with AI`}>
                                                <SparklesIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(recipe.id, recipe.title)} disabled={!!updatingId} className="text-red-500 hover:text-red-800 disabled:opacity-50" aria-label={`Delete ${recipe.title}`}>
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {updateErrors[recipe.id] && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-2 text-sm text-red-600 bg-red-50/50">
                                            <strong>Update failed:</strong> {updateErrors[recipe.id]}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminRecipeManagement;