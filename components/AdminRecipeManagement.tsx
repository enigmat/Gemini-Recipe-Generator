
import React, { useState, useRef } from 'react';
import { Recipe } from '../types';
import TrashIcon from './icons/TrashIcon';
import SparklesIcon from './icons/SparklesIcon';
import Spinner from './Spinner';
import PlusIcon from './icons/PlusIcon';
import StoredImage from './StoredImage';
import TrophyIcon from './icons/TrophyIcon';
import CameraIcon from './icons/CameraIcon';

interface AdminRecipeManagementProps {
    recipes: Recipe[];
    newRecipeIds: number[];
    scheduledRecipes: Recipe[];
    onDeleteRecipe: (recipeId: number) => void;
    onUpdateRecipeWithAI: (recipeId: number, title: string) => Promise<void>;
    onUpdateAllRecipeImages: () => Promise<void>;
    isUpdatingAllImages: boolean;
    imageUpdateProgress: string | null;
    onAddToNew: (recipeId: number) => void;
    onAddToRotd: (recipeId: number) => void;
    onUpdateRecipeImageManual?: (recipeId: number, base64Image: string) => Promise<void>;
}

const AdminRecipeManagement: React.FC<AdminRecipeManagementProps> = ({ recipes, newRecipeIds, scheduledRecipes, onDeleteRecipe, onUpdateRecipeWithAI, onUpdateAllRecipeImages, isUpdatingAllImages, imageUpdateProgress, onAddToNew, onAddToRotd, onUpdateRecipeImageManual }) => {
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [updateErrors, setUpdateErrors] = useState<Record<number, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingForId, setUploadingForId] = useState<number | null>(null);

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
    
    const triggerFileUpload = (recipeId: number) => {
        setUploadingForId(recipeId);
        // Delay click slightly to ensure state update has processed, although refs are synchronous
        setTimeout(() => {
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }
        }, 0);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const recipeId = uploadingForId;
        
        if (file && recipeId !== null && onUpdateRecipeImageManual) {
            setUpdatingId(recipeId); // Show spinner
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const base64String = (reader.result as string).split(',')[1];
                    await onUpdateRecipeImageManual(recipeId, base64String);
                } catch (error: any) {
                    console.error("Manual image update failed:", error);
                    setUpdateErrors(prev => ({ ...prev, [recipeId]: "Failed to upload image." }));
                } finally {
                    setUpdatingId(null);
                    setUploadingForId(null);
                    if(fileInputRef.current) fileInputRef.current.value = '';
                }
            };
            reader.readAsDataURL(file);
        } else {
            setUploadingForId(null);
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md relative">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/png, image/jpeg, image/webp" 
            />
            {isUpdatingAllImages && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10 animate-fade-in">
                    <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg shadow-2xl border text-center">
                        <Spinner size="w-6 h-6" />
                        <span className="text-slate-700 font-semibold">Updating all recipe images...</span>
                        {imageUpdateProgress && (
                            <span className="text-slate-500 text-sm max-w-xs truncate">{imageUpdateProgress}</span>
                        )}
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
                            <th scope="col" className="pl-6 pr-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-32">Image</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                            <th scope="col" className="pl-3 pr-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {[...recipes].sort((a,b) => a.title.localeCompare(b.title)).map((recipe) => {
                            const isNew = newRecipeIds.includes(recipe.id);
                            const isInRotd = scheduledRecipes.some(r => r.id === recipe.id);
                            return (
                                <React.Fragment key={recipe.id}>
                                    <tr className={updatingId === recipe.id ? 'opacity-50' : ''}>
                                        <td className="pl-6 pr-3 py-4 whitespace-nowrap">
                                            <div className="flex flex-col items-center gap-2 w-24">
                                                <StoredImage src={recipe.image} alt={recipe.title} className="w-24 h-16 object-cover rounded-md border border-slate-200" />
                                                <div className="flex justify-center gap-2 w-full">
                                                    <button 
                                                        onClick={() => triggerFileUpload(recipe.id)} 
                                                        disabled={updatingId !== null || isUpdatingAllImages}
                                                        className="flex-1 p-1.5 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 hover:text-slate-800 disabled:opacity-50 transition-colors flex justify-center"
                                                        title="Upload New Image"
                                                    >
                                                        <CameraIcon className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleUpdate(recipe.id, recipe.title)} 
                                                        disabled={updatingId !== null || isUpdatingAllImages}
                                                        className="flex-1 p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 hover:text-blue-800 disabled:opacity-50 transition-colors flex justify-center"
                                                        title="Regenerate Image with AI"
                                                    >
                                                        {updatingId === recipe.id ? <Spinner size="w-4 h-4" /> : <SparklesIcon className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">{recipe.title}</div>
                                        </td>
                                        <td className="pl-3 pr-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => onAddToRotd(recipe.id)}
                                                    disabled={isInRotd || updatingId !== null || isUpdatingAllImages}
                                                    className="text-amber-500 hover:text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    aria-label={`Add ${recipe.title} to Recipe of the Day Pool`}
                                                    title={isInRotd ? "Already in Recipe of the Day Pool" : "Add to Recipe of the Day Pool"}
                                                >
                                                    <TrophyIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => onAddToNew(recipe.id)}
                                                    disabled={isNew || updatingId !== null || isUpdatingAllImages}
                                                    className="text-green-500 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    aria-label={`Add ${recipe.title} to New This Month`}
                                                    title={isNew ? "Already in New This Month" : "Add to New This Month"}
                                                >
                                                    <PlusIcon className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleDelete(recipe.id, recipe.title)} disabled={updatingId !== null || isUpdatingAllImages} className="text-red-500 hover:text-red-800 disabled:opacity-50" aria-label={`Delete ${recipe.title}`} title="Delete Recipe">
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
