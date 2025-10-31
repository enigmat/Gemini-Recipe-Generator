import React, { useState, useEffect } from 'react';
import { Recipe, User } from '../types';
import * as recipeService from '../services/recipeService';
import AdminRecipeManagement from './AdminRecipeManagement';
import AdminAddRecipe from './AdminAddRecipe';
import AdminBulkImport from './AdminBulkImport';
import AdminROTDManagement from './AdminROTDManagement';
import AdminMonthlyDrop from './AdminMonthlyDrop';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import DownloadIcon from './icons/DownloadIcon';
import Spinner from './Spinner';
import CheckIcon from './icons/CheckIcon';

interface RecipeHubProps {
    currentUser: User;
    onAddRecipe: (title: string, addToNew: boolean, addToScheduled: boolean) => Promise<void>;
    onDeleteRecipe: (recipeId: number) => void;
    onUpdateRecipeWithAI: (recipeId: number, title: string) => Promise<void>;
    onUpdateAllRecipeImages: () => Promise<void>;
    isUpdatingAllImages: boolean;
    onExit: () => void;
    onSaveChanges: () => Promise<void>;
}

const RecipeHub: React.FC<RecipeHubProps> = (props) => {
    const [activePanel, setActivePanel] = useState('Recipe Management');
    
    // State for this component's data
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
    const [newRecipes, setNewRecipes] = useState<Recipe[]>([]);
    const [scheduledRecipes, setScheduledRecipes] = useState<Recipe[]>([]);

    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importProgress, setImportProgress] = useState('');

    useEffect(() => {
        // Load this user's recipes when the component mounts
        setAllRecipes(recipeService.getAllRecipes(props.currentUser.email));
        setNewRecipes(recipeService.getNewRecipes(props.currentUser.email));
        setScheduledRecipes(recipeService.getScheduledRecipes(props.currentUser.email));
    }, [props.currentUser.email]);

    const menuItems = [
        'Recipe Management', 'Add Recipe', 'Scheduled Recipes', 'Bulk Import'
    ];
    if (props.currentUser.isAdmin) {
        menuItems.push('Monthly Recipe Drop');
    }


    const handleSave = () => {
        setIsSaving(true);
        setSaveSuccess(false);
        // Save the current state of recipes from this component back to the service
        recipeService.saveAllRecipes(props.currentUser.email, allRecipes);
        recipeService.saveNewRecipes(props.currentUser.email, newRecipes);
        recipeService.saveScheduledRecipes(props.currentUser.email, scheduledRecipes);
        
        // Also call the App-level save for good measure if needed, though this component is now self-contained
        props.onSaveChanges().then(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);
        });
    };

    const handleLocalAddRecipe = async (title: string, addToNew: boolean, addToScheduled: boolean) => {
        // This function will call the App-level handler and then refresh this component's local state
        await props.onAddRecipe(title, addToNew, addToScheduled);
        // Refresh local state after add
        setAllRecipes(recipeService.getAllRecipes(props.currentUser.email));
        setNewRecipes(recipeService.getNewRecipes(props.currentUser.email));
        setScheduledRecipes(recipeService.getScheduledRecipes(props.currentUser.email));
    };

    const handleBulkImport = async (htmlContent: string) => {
        setIsImporting(true);
        setImportProgress('Starting import... Parsing HTML file.');

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            
            const titles = Array.from(doc.querySelectorAll('.recipe-card h1.recipe-title, .recipe h1.fn'))
                .map(el => (el as HTMLElement).innerText.trim())
                .filter(title => title);

            if (titles.length === 0) {
                throw new Error("Could not find any recipe titles in the provided HTML. Please ensure you copied the entire file content.");
            }
            
            setImportProgress(`Found ${titles.length} recipes. Starting AI generation...`);

            for (let i = 0; i < titles.length; i++) {
                const title = titles[i];
                setImportProgress(`(${i + 1}/${titles.length}) Generating recipe for "${title}"...`);
                await handleLocalAddRecipe(title, false, false);
                await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
            }

            setImportProgress(`Import complete! Successfully added ${titles.length} new recipes.`);

        } catch (error: any) {
            console.error("Bulk import failed:", error);
            setImportProgress(`Error: ${error.message}`);
        } finally {
            setIsImporting(false);
        }
    };
    
    const handleMoveRecipeFromScheduledToMain = async (recipe: Recipe): Promise<boolean> => {
        // Add to main list
        const newAllRecipes = [...allRecipes, recipe];
        setAllRecipes(newAllRecipes);
        recipeService.saveAllRecipes(props.currentUser.email, newAllRecipes);

        // Remove from scheduled list
        const newScheduled = scheduledRecipes.filter(r => r.id !== recipe.id);
        setScheduledRecipes(newScheduled);
        recipeService.saveScheduledRecipes(props.currentUser.email, newScheduled);
        
        alert(`Recipe "${recipe.title}" has been moved to your main recipe list.`);
        return true;
    };


    const renderPanel = () => {
        switch (activePanel) {
            case 'Recipe Management':
                return (
                    <AdminRecipeManagement
                        recipes={allRecipes}
                        newRecipeIds={newRecipes.map(r => r.id)}
                        onDeleteRecipe={props.onDeleteRecipe}
                        onUpdateRecipeWithAI={props.onUpdateRecipeWithAI}
                        onUpdateAllRecipeImages={props.onUpdateAllRecipeImages}
                        isUpdatingAllImages={props.isUpdatingAllImages}
                        onAddToNew={(recipeId) => {
                            const recipe = allRecipes.find(r => r.id === recipeId);
                            if (recipe && !newRecipes.some(r => r.id === recipeId)) {
                                const updated = [recipe, ...newRecipes];
                                setNewRecipes(updated);
                                recipeService.saveNewRecipes(props.currentUser.email, updated);
                            }
                        }}
                    />
                );
            case 'Add Recipe':
                return <AdminAddRecipe onAddRecipe={handleLocalAddRecipe} />;
            case 'Scheduled Recipes':
                 return <AdminROTDManagement onMoveRecipe={handleMoveRecipeFromScheduledToMain} currentUser={props.currentUser}/>;
            case 'Bulk Import':
                return <AdminBulkImport onImport={handleBulkImport} isImporting={isImporting} importProgress={importProgress} />;
            case 'Monthly Recipe Drop':
                return <AdminMonthlyDrop />;
            default:
                return <div>Panel not found</div>;
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <header className="container mx-auto flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold text-slate-800">My Recipe Hub</h1>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors disabled:bg-green-300 disabled:cursor-wait"
                    >
                        {isSaving ? <Spinner size="w-5 h-5" /> : (saveSuccess ? <CheckIcon className="w-5 h-5" /> : <DownloadIcon className="w-5 h-5" />)}
                        <span>{isSaving ? 'Saving...' : (saveSuccess ? 'Saved!' : 'Save Changes')}</span>
                    </button>
                    <button 
                        onClick={props.onExit}
                        className="flex items-center gap-1 px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-colors"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                        <span>Back to App</span>
                    </button>
                </div>
            </header>

            <main className="container mx-auto">
                <div className="border-b border-slate-200 mb-6">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-hide" aria-label="Hub Panels">
                        {menuItems.map(item => (
                            <button
                                key={item}
                                onClick={() => setActivePanel(item)}
                                className={`flex-shrink-0 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none ${
                                    activePanel === item 
                                        ? 'border-teal-500 text-teal-600' 
                                        : 'border-transparent text-slate-500 hover:text-teal-600 hover:border-teal-400'
                                }`}
                                aria-current={activePanel === item ? 'page' : undefined}
                            >
                                {item}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="w-full animate-fade-in">
                    {renderPanel()}
                </div>
            </main>
        </div>
    );
};

export default RecipeHub;