import React, { useState } from 'react';
import { importRecipeFromUrl } from '../services/geminiService';
import { Recipe } from '../types';
import Spinner from './Spinner';
import UrlInput from './UrlInput';

interface AdminDashboardProps {
    onBackToApp: () => void;
    onAddRecipe: (recipe: Recipe) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp, onAddRecipe }) => {
    const [recipeUrl, setRecipeUrl] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [importedRecipe, setImportedRecipe] = useState<Recipe | null>(null);
    const [importError, setImportError] = useState<string | null>(null);
    const [addSuccessMessage, setAddSuccessMessage] = useState<string | null>(null);


    const handleImport = async () => {
        if (!recipeUrl) {
            setImportError("Please enter a URL.");
            return;
        }
        setIsImporting(true);
        setImportError(null);
        setImportedRecipe(null);
        setAddSuccessMessage(null);
        try {
            const recipe = await importRecipeFromUrl(recipeUrl);
            setImportedRecipe(recipe);
        } catch (error) {
            if (error instanceof Error) {
                setImportError(error.message);
            } else {
                setImportError("An unknown error occurred while importing.");
            }
        } finally {
            setIsImporting(false);
        }
    };

    const handleAddToCookbook = () => {
        if (importedRecipe) {
            onAddRecipe(importedRecipe);
            setAddSuccessMessage(`"${importedRecipe.title}" has been successfully added to the cookbook!`);
            setImportedRecipe(null);
            setRecipeUrl('');
            setTimeout(() => setAddSuccessMessage(null), 5000);
        }
    };


    return (
        <div className="animate-fade-in py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
                <button
                    onClick={onBackToApp}
                    className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors"
                >
                    &larr; Back to Recipes
                </button>
            </div>
            
            {/* Import Section */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-border-color mb-8">
                <h2 className="text-xl font-bold text-text-primary mb-4">Import Recipe from URL</h2>
                <div className="max-w-xl">
                    <UrlInput
                        recipeUrl={recipeUrl}
                        setRecipeUrl={setRecipeUrl}
                        onFetch={handleImport}
                        isLoading={isImporting}
                    />
                </div>
                {isImporting && <div className="mt-4"><Spinner /></div>}
                {importError && (
                    <div className="mt-4 text-red-600 bg-red-50 p-3 rounded-md">{importError}</div>
                )}
                 {addSuccessMessage && (
                    <div className="mt-4 text-green-700 bg-green-50 p-3 rounded-md">{addSuccessMessage}</div>
                )}
            </div>

            {/* Imported Recipe Preview */}
            {importedRecipe && (
                 <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-border-color">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">Imported Recipe Preview</h2>
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Image Column */}
                        <div className="w-full md:w-1/3">
                            <img src={importedRecipe.imageUrl} alt={importedRecipe.title} className="rounded-lg shadow-md w-full object-cover aspect-square" />
                        </div>
                        {/* Details Column */}
                        <div className="w-full md:w-2/3">
                            <h3 className="text-2xl font-bold text-text-primary">{importedRecipe.title}</h3>
                            <p className="text-text-secondary mt-2 mb-4">{importedRecipe.description}</p>
                            <div className="mb-4 flex flex-wrap gap-2">
                                {importedRecipe.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{tag}</span>
                                ))}
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
                                <div>
                                    <h4 className="text-lg font-semibold text-primary mb-2">Ingredients</h4>
                                    <ul className="list-disc list-inside space-y-1 text-text-secondary">
                                        {importedRecipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-primary mb-2">Instructions</h4>
                                    <ol className="list-decimal list-inside space-y-2 text-text-secondary">
                                        {importedRecipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                                    </ol>
                                </div>
                            </div>

                            <div className="mt-6 border-t pt-6">
                                <p className="text-sm text-text-secondary mb-4">This is a preview. Click the button below to add this recipe to the main cookbook.</p>
                                <button
                                    onClick={handleAddToCookbook}
                                    className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-colors duration-200"
                                >
                                    Add to Cookbook
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder cards for admin features */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-border-color">
                    <h2 className="text-xl font-bold text-text-primary mb-2">User Management</h2>
                    <p className="text-text-secondary">View, edit, or remove user accounts. Assign roles and permissions.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-border-color">
                    <h2 className="text-xl font-bold text-text-primary mb-2">Recipe Analytics</h2>
                    <p className="text-text-secondary">Track popular recipes, user engagement, and search trends.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-border-color">
                    <h2 className="text-xl font-bold text-text-primary mb-2">Content Management</h2>
                    <p className="text-text-secondary">Add, edit, or feature recipes, meal plans, and cooking classes.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;