import React, { useState } from 'react';
import { Recipe } from '../types';
import TrashIcon from './icons/TrashIcon';
import SparklesIcon from './icons/SparklesIcon';
import Spinner from './Spinner';

interface AdminNewRecipeManagementProps {
    recipes: Recipe[];
    onRemoveFromNew: (recipeId: number) => void;
    onUpdateRecipeWithAI: (recipeId: number, title: string) => Promise<void>;
}

const AdminNewRecipeManagement: React.FC<AdminNewRecipeManagementProps> = ({ recipes, onRemoveFromNew, onUpdateRecipeWithAI }) => {
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [updateErrors, setUpdateErrors] = useState<Record<number, string>>({});
    
    const handleRemove = (recipeId: number, recipeTitle: string) => {
        if (window.confirm(`Are you sure you want to remove "${recipeTitle}" from the New Recipes list? It will NOT be deleted permanently.`)) {
            onRemoveFromNew(recipeId);
        }
    };
    
    const handleUpdate = async (recipeId: number, title: string) => {
        setUpdatingId(recipeId);
        setUpdateErrors(prev => ({ ...prev, [recipeId]: '' }));
        try {
            await onUpdateRecipeWithAI(recipeId, title);
        } catch (error: any) {
            console.error("Update failed:", error);
            setUpdateErrors(prev => ({ ...prev, [recipeId]: error.message || "An error occurred." }));
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md space-y-8">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">Manage "New This Month" Recipes</h2>
                {recipes.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">There are no recipes in the "New This Month" list.</p>
                ) : (
                    recipes.map(recipe => (
                        <div key={recipe.id}>
                            <div className="relative flex flex-col sm:flex-row items-center justify-between p-3 bg-gray-50 rounded-lg border gap-4">
                                {updatingId === recipe.id && (
                                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg z-10">
                                        <div className="flex items-center gap-2 text-gray-700 font-semibold">
                                            <Spinner />
                                            <span>Updating...</span>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <img src={recipe.image} alt={recipe.title} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-gray-800">{recipe.title}</h3>
                                        <p className="text-sm text-gray-500">ID: {recipe.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                                    <button onClick={() => handleUpdate(recipe.id, recipe.title)} disabled={!!updatingId} className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-800 font-semibold rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50">
                                        <SparklesIcon className="w-4 h-4" />
                                        <span>Update with AI</span>
                                    </button>
                                    <button onClick={() => handleRemove(recipe.id, recipe.title)} disabled={!!updatingId} className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 text-red-800 font-semibold rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50">
                                        <TrashIcon className="w-4 h-4" />
                                        <span>Remove from 'New'</span>
                                    </button>
                                </div>
                            </div>
                            {updateErrors[recipe.id] && (
                                <p className="text-red-500 text-sm mt-1 px-3 animate-fade-in">{updateErrors[recipe.id]}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminNewRecipeManagement;