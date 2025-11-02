import React, { useState } from 'react';
import { SavedCocktail, CocktailRecipe } from '../types';
import * as geminiService from '../services/geminiService';
import * as imageStore from '../services/imageStore';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';
import StoredImage from './StoredImage';
import TrashIcon from './icons/TrashIcon';

interface AdminCocktailManagementProps {
    standardCocktails: SavedCocktail[];
    onUpdateStandardCocktails: (cocktails: SavedCocktail[]) => void;
}

const AdminCocktailManagement: React.FC<AdminCocktailManagementProps> = ({ standardCocktails, onUpdateStandardCocktails }) => {
    const [jsonInput, setJsonInput] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [progress, setProgress] = useState('');
    const [error, setError] = useState('');
    const [updatingImageId, setUpdatingImageId] = useState<string | null>(null);

    const handleDelete = (cocktailId: string) => {
        if (window.confirm("Are you sure you want to delete this cocktail from the standard list?")) {
            const cocktailToDelete = standardCocktails.find(c => c.id === cocktailId);
            if (cocktailToDelete && cocktailToDelete.image.startsWith('indexeddb:')) {
                imageStore.deleteImage(cocktailId);
            }
            const updatedCocktails = standardCocktails.filter(c => c.id !== cocktailId);
            onUpdateStandardCocktails(updatedCocktails);
        }
    };

    const handleBulkImport = async () => {
        let importData: CocktailRecipe[];
        try {
            importData = JSON.parse(jsonInput);
            if (!Array.isArray(importData)) {
                throw new Error('JSON is not an array.');
            }
        } catch (e) {
            setError('Invalid JSON format. Please provide an array of cocktail recipe objects.');
            return;
        }

        setIsImporting(true);
        setError('');
        setProgress(`Found ${importData.length} cocktails. Starting import...`);

        const newCocktails: SavedCocktail[] = [];
        for (let i = 0; i < importData.length; i++) {
            const recipe = importData[i];
            try {
                if (!recipe.title || !recipe.imagePrompt) {
                    throw new Error("Each cocktail object must have 'title' and 'imagePrompt' properties.");
                }
                setProgress(`(${i + 1}/${importData.length}) Generating image for "${recipe.title}"...`);
                
                // Add a small delay
                await new Promise(resolve => setTimeout(resolve, 500));

                const image = await geminiService.generateImageFromPrompt(recipe.imagePrompt);
                const newId = `std-cocktail-${Date.now()}-${i}`;
                await imageStore.setImage(newId, image);
                
                const newCocktail: SavedCocktail = {
                    ...recipe,
                    id: newId,
                    image: `indexeddb:${newId}`
                };
                newCocktails.push(newCocktail);
            } catch (e: any) {
                setError(prev => `${prev}\nFailed on "${recipe.title || 'Unknown Title'}": ${e.message}. Skipping.`);
            }
        }
        
        const existingTitles = new Set(standardCocktails.map(c => c.title.toLowerCase()));
        const uniqueNewCocktails = newCocktails.filter(nc => !existingTitles.has(nc.title.toLowerCase()));
        
        onUpdateStandardCocktails([...uniqueNewCocktails, ...standardCocktails]);

        setProgress(`Import complete. Added ${uniqueNewCocktails.length} new cocktails. ${newCocktails.length - uniqueNewCocktails.length} were duplicates and skipped.`);
        setIsImporting(false);
        setJsonInput('');
        setTimeout(() => setProgress(''), 5000);
    };

    const handleRegenerateImage = async (cocktail: SavedCocktail) => {
        if (!window.confirm(`Are you sure you want to regenerate the image for "${cocktail.title}" using its image prompt?`)) {
            return;
        }

        setUpdatingImageId(cocktail.id);
        try {
            const newImageBase64 = await geminiService.generateImageFromPrompt(cocktail.imagePrompt);

            // The image is stored with the cocktail's ID as the key.
            await imageStore.setImage(cocktail.id, newImageBase64);

            // The new image is in IndexedDB, so the source must be updated to point there.
            // We add a timestamp for cache-busting to ensure React re-renders the component with the new image.
            const newImageSrc = `indexeddb:${cocktail.id}?t=${Date.now()}`;
            const updatedCocktail = { ...cocktail, image: newImageSrc };
            const updatedCocktails = standardCocktails.map(c => c.id === cocktail.id ? updatedCocktail : c);
            onUpdateStandardCocktails(updatedCocktails);

        } catch (error) {
            console.error("Failed to regenerate image:", error);
            alert(`Failed to regenerate image for "${cocktail.title}". Please check the console.`);
        } finally {
            setUpdatingImageId(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
                 <h2 className="text-2xl font-bold text-slate-800 mb-4">Bulk Import Cocktails</h2>
                 <p className="text-slate-600 mb-4 text-sm">Paste a JSON array of cocktail objects. Each object must conform to the <code>CocktailRecipe</code> type (title, description, imagePrompt, glassware, garnish, ingredients, instructions).</p>
                 <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='[{"title": "Mojito", "description": "...", "imagePrompt": "...", ...}]'
                    className="w-full h-48 p-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    disabled={isImporting}
                 />
                 <button onClick={handleBulkImport} disabled={isImporting || !jsonInput.trim()} className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 disabled:bg-teal-300">
                    {isImporting ? <Spinner /> : <SparklesIcon />}
                    {isImporting ? 'Importing...' : 'Import from JSON'}
                 </button>
                 {progress && <p className="text-sm text-slate-600 mt-2">{progress}</p>}
                 {error && <p className="text-sm text-red-600 mt-2 whitespace-pre-wrap">{error}</p>}
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Standard Cocktail List ({standardCocktails.length})</h2>
                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-2">
                    {standardCocktails.map(cocktail => (
                        <div key={cocktail.id} className="flex items-center gap-4 p-2 bg-slate-50 rounded-md border">
                            <StoredImage src={cocktail.image} alt={cocktail.title} className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
                            <p className="font-semibold text-slate-800 flex-grow">{cocktail.title}</p>
                            <button
                                onClick={() => handleRegenerateImage(cocktail)}
                                disabled={updatingImageId !== null}
                                className="text-blue-500 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 disabled:opacity-50"
                                title="Regenerate Image with AI"
                            >
                                {updatingImageId === cocktail.id ? <Spinner size="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                            </button>
                            <button onClick={() => handleDelete(cocktail.id)} disabled={updatingImageId !== null} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 disabled:opacity-50">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminCocktailManagement;