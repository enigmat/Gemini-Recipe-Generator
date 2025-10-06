import React, { useState } from 'react';
import { importRecipeFromUrl } from '../services/geminiService';
import { Recipe } from '../types';
import RecipeCard from './RecipeCard';
import Spinner from './Spinner';
import UrlInput from './UrlInput';

interface AdminDashboardProps {
    onBackToApp: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp }) => {
    const [recipeUrl, setRecipeUrl] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [importedRecipe, setImportedRecipe] = useState<Recipe | null>(null);
    const [importError, setImportError] = useState<string | null>(null);

    const handleImport = async () => {
        if (!recipeUrl) {
            setImportError("Please enter a URL.");
            return;
        }
        setIsImporting(true);
        setImportError(null);
        setImportedRecipe(null);
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
            </div>

            {/* Imported Recipe Preview */}
            {importedRecipe && (
                 <div className="mb-8">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">Imported Recipe Preview</h2>
                    <div className="max-w-xs">
                        <RecipeCard
                            recipe={importedRecipe}
                            onClick={() => { /* No-op for now */ }}
                            isSaved={false}
                            onToggleSave={() => { /* No-op for now */ }}
                        />
                    </div>
                     <p className="text-sm text-text-secondary mt-4">This is a preview. The recipe has not been added to the main list yet.</p>
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