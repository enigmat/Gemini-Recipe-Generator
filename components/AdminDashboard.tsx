import React, { useState } from 'react';
import { Recipe, User, Newsletter, Lead, Product } from '../types';
import AdminRecipeManagement from './AdminRecipeManagement';
import AdminUserManagement from './AdminUserManagement';
import AdminNewsletter from './AdminNewsletter';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import AdminAddRecipe from './AdminAddRecipe';
import AdminLeadsManagement from './AdminLeadsManagement';
import AdminCookingClasses from './AdminCookingClasses';
import AdminVideoManagement from './AdminVideoManagement';
import AdminAboutUs from './AdminAboutUs';
import AdminMarketplace from './AdminMarketplace';
import EditUserModal from './EditUserModal';
import AdminApiKeyManagement from './AdminApiKeyManagement';
import AdminNewRecipeManagement from './AdminNewRecipeManagement';
import Spinner from './Spinner';
import CheckIcon from './icons/CheckIcon';
import DownloadIcon from './icons/DownloadIcon';
import AdminROTDManagement from './AdminROTDManagement';

interface AdminDashboardProps {
    allRecipes: Recipe[];
    newRecipes: Recipe[];
    users: User[];
    sentNewsletters: Newsletter[];
    collectedLeads: Lead[];
    products: Product[];
    onAddRecipe: (title: string, addToNew: boolean) => Promise<void>;
    onDeleteRecipe: (recipeId: number) => void;
    onUpdateRecipeWithAI: (recipeId: number, title: string) => Promise<void>;
    onUpdateAllRecipeImages: () => Promise<void>;
    isUpdatingAllImages: boolean;
    onUpdateUserRoles: (user: User) => void;
    onDeleteUser: (userEmail: string) => void;
    onSendNewsletter: (newsletter: Omit<Newsletter, 'id' | 'sentDate'>) => void;
    onUpdateProducts: (updatedProducts: Product[]) => void;
    onExit: () => void;
    onRemoveFromNew: (recipeId: number) => void;
    onAddToNew: (recipeId: number) => void;
    onSaveChanges: () => Promise<void>;
}

const PlaceholderPanel: React.FC<{ title: string }> = ({ title }) => (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <p className="mt-4 text-slate-500">This feature is coming soon.</p>
    </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const [activePanel, setActivePanel] = useState('User Management');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const menuItems = [
        'User Management', 'API Key Management', 'Leads', 'Newsletter', 'Recipe Management', 
        'Add Recipe', 'Recipe of the Day Pool', 'Cooking Classes', 'Video Management', 'Marketplace Management', 'About Us'
    ];

    const handleSave = () => {
        setIsSaving(true);
        setSaveSuccess(false);
        props.onSaveChanges().then(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);
        });
    };

    const renderPanel = () => {
        switch (activePanel) {
            case 'User Management':
                return (
                    <AdminUserManagement
                        users={props.users}
                        onDeleteUser={props.onDeleteUser}
                        onEditUser={setEditingUser}
                    />
                );
            case 'API Key Management':
                return <AdminApiKeyManagement />;
            case 'Leads':
                return <AdminLeadsManagement leads={props.collectedLeads} />;
            case 'Recipe Management':
                 return (
                    <div className="space-y-8">
                        <AdminNewRecipeManagement
                            recipes={props.newRecipes}
                            onRemoveFromNew={props.onRemoveFromNew}
                            onUpdateRecipeWithAI={props.onUpdateRecipeWithAI}
                        />
                        <AdminRecipeManagement
                            recipes={props.allRecipes}
                            newRecipeIds={props.newRecipes.map(r => r.id)}
                            onDeleteRecipe={props.onDeleteRecipe}
                            onUpdateRecipeWithAI={props.onUpdateRecipeWithAI}
                            onUpdateAllRecipeImages={props.onUpdateAllRecipeImages}
                            isUpdatingAllImages={props.isUpdatingAllImages}
                            onAddToNew={props.onAddToNew}
                        />
                    </div>
                );
            case 'Add Recipe':
                 return <AdminAddRecipe onAddRecipe={props.onAddRecipe} />;
            case 'Recipe of the Day Pool':
                 return <AdminROTDManagement />;
            case 'Newsletter':
                 return (
                    <AdminNewsletter
                        allRecipes={props.allRecipes}
                        users={props.users}
                        sentNewsletters={props.sentNewsletters}
                        onSendNewsletter={props.onSendNewsletter}
                    />
                );
            case 'Cooking Classes':
                return <AdminCookingClasses />;
            case 'Video Management':
                return <AdminVideoManagement />;
            case 'Marketplace Management':
                return <AdminMarketplace products={props.products} onUpdateProducts={props.onUpdateProducts} />;
            case 'About Us':
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
                    <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-hide" aria-label="Admin Panels">
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