import React, { useState, useEffect, useRef } from 'react';
import { Recipe, User, Newsletter, Lead, Product, SavedCocktail, AppDatabase } from '../types';
import AdminRecipeManagement from './AdminRecipeManagement';
import AdminUserManagement from './AdminUserManagement';
import AdminNewsletter from './AdminNewsletter';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import AdminAddRecipe from './AdminAddRecipe';
import AdminLeadsManagement from './AdminLeadsManagement';
import AdminCookingClasses from './AdminCookingClasses';
import AdminVideoManagement from './AdminVideoManagement';
import AdminMarketplace from './AdminMarketplace';
import EditUserModal from './EditUserModal';
import AdminNewRecipeManagement from './AdminNewRecipeManagement';
import Spinner from './Spinner';
import CheckIcon from './icons/CheckIcon';
import DownloadIcon from './icons/DownloadIcon';
import AdminFeaturedChefManagement from './AdminROTDManagement';
import AdminBulkImport from './AdminBulkImport';
import AdminDataExport from './AdminDataExport';
import AdminCocktailManagement from './AdminCocktailManagement';
import AdminCocktailDistribution from './AdminCocktailDistribution';
import AdminAboutUs from './AdminAboutUs';
import ChevronDownIcon from './icons/ChevronDownIcon';
import AdminDataSync from './AdminDataSync';
import GlobeAltIcon from './icons/GlobeAltIcon';

interface AdminDashboardProps {
    currentUser: User;
    allRecipes: Recipe[];
    newRecipes: Recipe[];
    scheduledRecipes: Recipe[];
    users: User[];
    sentNewsletters: Newsletter[];
    collectedLeads: Lead[];
    products: Product[];
    standardCocktails: SavedCocktail[];
    onAddRecipe: (title: string, addToNew: boolean, addToRecipeOfTheDayPool: boolean) => Promise<void>;
    onDeleteRecipe: (recipeId: number) => void;
    onUpdateRecipeWithAI: (recipeId: number, title: string) => Promise<void>;
    onUpdateAllRecipeImages: () => Promise<void>;
    isUpdatingAllImages: boolean;
    imageUpdateProgress: string | null;
    onUpdateUserRoles: (user: User) => void;
    onDeleteUser: (userEmail: string) => void;
    onSendNewsletter: (newsletter: Omit<Newsletter, 'id' | 'sentDate'>) => void;
    onUpdateProducts: (updatedProducts: Product[]) => void;
    onDeleteProduct: (productId: string) => void;
    onUpdateStandardCocktails: (cocktails: SavedCocktail[]) => void;
    onExit: () => void;
    onRemoveFromNew: (recipeId: number) => void;
    onAddToNew: (recipeId: number) => void;
    onAddToRotd: (recipeId: number) => void;
    onMoveRecipeFromRotdToMain: (recipe: Recipe) => Promise<boolean>;
    onUpdateScheduledRecipes: (recipes: Recipe[]) => Promise<void>;
    onImportData: (db: AppDatabase) => Promise<void>;
}

const PlaceholderPanel: React.FC<{ title: string }> = ({ title }) => (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <p className="mt-4 text-slate-500">This feature is coming soon.</p>
    </div>
);

const menuStructure = [
    {
        title: 'User Management',
        items: ['User Management']
    },
    {
        title: 'Marketing',
        items: ['Leads', 'Newsletter']
    },
    {
        title: 'Recipe Management',
        items: ['Recipe Management', 'Add Recipe', 'Featured Chef Recipe Pool']
    },
    {
        title: 'Import/Export',
        items: ['Bulk Import', 'Export Recipes (CSV)', 'Application Data Sync']
    },
    {
        title: 'Cocktail',
        items: ['Cocktail Management', 'Cocktail Distribution']
    },
    {
        title: 'Classes',
        items: ['Cooking Classes', 'Video Management']
    },
    {
        title: 'Management',
        items: ['Marketplace Management', 'About Us Management']
    }
];

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const [activePanel, setActivePanel] = useState('User Management');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [importProgress, setImportProgress] = useState('');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBulkImport = async (htmlContent: string) => {
        setIsImporting(true);
        setImportProgress('Starting import... Parsing HTML file.');

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            
            const titleSelectors = [
                '.recipe h1.fn', '.recipe-title', 'h1.recipe-title', 'h2.recipe-title',
                '[itemprop="name"]', 'h1[class*="recipe-title"]', 'h1.fn', '.fn',
                '.recipe-name', '.recipe_name', 'h1.recipe-name', 'h2.recipe-name',
                '[class*="recipe"] [class*="title"]', '.recipe-index a', '.rk-recipe-card a h2',
                'div.recipe-list a', 'ul.recipe-list li a', 'body > ul > li > a', '#toc a',
                'table td a', 'td.recipe a', '.recipe a', "a[href*='recipe']", "a[title*='recipe']"
            ].join(', ');

            const titleElements = doc.querySelectorAll(titleSelectors);
            const titles = [...new Set(Array.from(titleElements).map(el => (el as HTMLElement).innerText.trim()))].filter(Boolean);

            if (titles.length === 0) {
                throw new Error("Could not find any recipe titles. Please ensure you have copied the entire content of the HTML file.");
            }
            
            setImportProgress(`Found ${titles.length} recipes. Starting AI generation...`);

            for (let i = 0; i < titles.length; i++) {
                const title = titles[i];
                setImportProgress(`(${i + 1}/${titles.length}) Generating recipe for "${title}"...`);
                await props.onAddRecipe(title, false, false);
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            setImportProgress(`Import complete! Successfully added ${titles.length} new recipes.`);

        } catch (error: any) {
            console.error("Bulk import failed:", error);
            setImportProgress(`Error: ${error.message}`);
        } finally {
            setIsImporting(false);
        }
    };

    const renderPanel = () => {
        switch (activePanel) {
            case 'User Management':
                return <AdminUserManagement users={props.users} onDeleteUser={props.onDeleteUser} onEditUser={setEditingUser} />;
            case 'Leads':
                return <AdminLeadsManagement leads={props.collectedLeads} />;
            case 'Recipe Management':
                 return (
                    <div className="space-y-8">
                        <AdminNewRecipeManagement recipes={props.newRecipes} onRemoveFromNew={props.onRemoveFromNew} onUpdateRecipeWithAI={props.onUpdateRecipeWithAI} />
                        <AdminRecipeManagement 
                            {...props}
                            newRecipeIds={props.newRecipes.map(r => r.id)}
                            recipes={props.allRecipes}
                            scheduledRecipes={props.scheduledRecipes}
                            onAddToRotd={props.onAddToRotd}
                            imageUpdateProgress={props.imageUpdateProgress}
                        />
                    </div>
                );
            case 'Add Recipe':
                 return <AdminAddRecipe onAddRecipe={props.onAddRecipe} />;
            case 'Featured Chef Recipe Pool':
                 return <AdminFeaturedChefManagement 
                    recipes={props.scheduledRecipes} 
                    onMoveRecipe={props.onMoveRecipeFromRotdToMain}
                    onUpdateScheduledRecipes={props.onUpdateScheduledRecipes}
                 />;
            case 'Bulk Import':
                return <AdminBulkImport onImport={handleBulkImport} isImporting={isImporting} importProgress={importProgress} />;
            case 'Export Recipes (CSV)':
                return <AdminDataExport allRecipes={props.allRecipes} />;
            case 'Application Data Sync':
                return <AdminDataSync onImportData={props.onImportData} />;
            case 'Cocktail Management':
                return <AdminCocktailManagement standardCocktails={props.standardCocktails} onUpdateStandardCocktails={props.onUpdateStandardCocktails} />;
            case 'Cocktail Distribution':
                return <AdminCocktailDistribution users={props.users} currentUser={props.currentUser} />;
            case 'Newsletter':
                 return <AdminNewsletter {...props} />;
            case 'Cooking Classes':
                return <AdminCookingClasses />;
            case 'Video Management':
                return <AdminVideoManagement />;
            case 'Marketplace Management':
                return <AdminMarketplace products={props.products} onUpdateProducts={props.onUpdateProducts} onDeleteProduct={props.onDeleteProduct} />;
            case 'About Us Management':
                return <AdminAboutUs />;
            default:
                return <PlaceholderPanel title={activePanel} />;
        }
    }

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <header className="container mx-auto flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold text-slate-800">Admin Dashboard</h1>
                 <div className="flex items-center gap-4">
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
                    <nav className="flex flex-wrap gap-2 pb-2" ref={navRef} aria-label="Admin Panels">
                        {menuStructure.map(group => {
                            const isGroupActive = group.items.includes(activePanel);
                            return (
                                <div key={group.title} className="relative">
                                    <button
                                        onClick={() => setOpenDropdown(openDropdown === group.title ? null : group.title)}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-md shadow-sm text-sm font-medium border transition-colors ${
                                            isGroupActive
                                            ? 'bg-teal-50 text-teal-700 border-teal-200'
                                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span>{group.title}</span>
                                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${openDropdown === group.title ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openDropdown === group.title && (
                                        <div className="absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 py-1">
                                            {group.items.map(item => (
                                                <button
                                                    key={item}
                                                    onClick={() => { setActivePanel(item); setOpenDropdown(null); }}
                                                    className={`block w-full text-left px-4 py-2 text-sm ${
                                                        activePanel === item ? 'bg-teal-100 text-teal-800' : 'text-slate-700 hover:bg-slate-100'
                                                    }`}
                                                    aria-current={activePanel === item ? 'page' : undefined}
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </div>
                <div className="w-full animate-fade-in">
                    {renderPanel()}
                </div>
            </main>

            {editingUser && (
                <EditUserModal
                    isOpen={!!editingUser}
                    onClose={() => setEditingUser(null)}
                    user={editingUser}
                    onSave={(updatedUser) => {
                        props.onUpdateUserRoles(updatedUser);
                        setEditingUser(null);
                    }}
                />
            )}
        </div>
    );
};

export default AdminDashboard;