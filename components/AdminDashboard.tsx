import React, { useState, useEffect } from 'react';
import { Recipe, User, Lead, Newsletter } from '../types';
import { generateImage } from '../services/geminiService';
import * as newsletterService from '../services/newsletterService';
import TrashIcon from './icons/TrashIcon';
import WrenchIcon from './icons/WrenchIcon';
import Spinner from './Spinner';
import PencilIcon from './icons/PencilIcon';
import EditUserModal from './EditUserModal';

interface AdminDashboardProps {
    onBackToApp: () => void;
    onAddRecipe: (recipe: Recipe) => void;
    allUsers: User[];
    allRecipes: Recipe[];
    allLeads: Lead[];
    onDeleteUser: (email: string) => void;
    onGiveFreeTime: (email: string, months: number) => void;
    onUpdateUser: (email: string, updatedData: Partial<User>) => void;
    onDeleteRecipe: (title: string) => void;
    onUpdateRecipeStatus: (title: string, status: Recipe['status']) => void;
    onFixImage: (title: string) => Promise<void>;
}

type AdminView = 'users' | 'recipes' | 'add_recipe' | 'leads' | 'newsletter';

const statusMap: { [key in Recipe['status']]: string } = {
    active: 'All Recipes',
    new_this_month: 'New This Month',
    archived: 'Archived',
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({
    onBackToApp, onAddRecipe, allUsers, allRecipes, allLeads, onDeleteUser,
    onGiveFreeTime, onUpdateUser, onDeleteRecipe, onUpdateRecipeStatus, onFixImage
}) => {
    const [currentView, setCurrentView] = useState<AdminView>('users');
    const [fixingImageTitle, setFixingImageTitle] = useState<string | null>(null);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Add Recipe State
    const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
        title: '',
        description: '',
        ingredients: [],
        instructions: [],
        tags: [],
        prepTime: '',
        cookTime: '',
        servings: '',
        status: 'active',
        nutrition: { calories: '', protein: '', carbs: '', fat: '' }
    });
    const [imagePrompt, setImagePrompt] = useState('');
    const [isAddingRecipe, setIsAddingRecipe] = useState(false);
    
    // Newsletter State
    const [newsletterSubject, setNewsletterSubject] = useState('');
    const [newsletterBody, setNewsletterBody] = useState('');
    const [sentNewsletters, setSentNewsletters] = useState<Newsletter[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');


    useEffect(() => {
        if (currentView === 'newsletter') {
            const draft = newsletterService.getNewsletterDraft();
            setNewsletterSubject(draft.subject);
            setNewsletterBody(draft.body);
            setSentNewsletters(newsletterService.getSentNewsletters());
        }
    }, [currentView]);
    
    const sortedRecipes = [...allRecipes].sort((a,b) => a.title.localeCompare(b.title));

    const handleFixClick = async (title: string) => {
        setFixingImageTitle(title);
        await onFixImage(title);
        setFixingImageTitle(null);
    };

    const handleEditUserClick = (user: User) => {
        setEditingUser(user);
        setIsEditUserModalOpen(true);
    };
    
    const handleCloseEditModal = () => {
        setIsEditUserModalOpen(false);
        setEditingUser(null);
    };

    const handleAddRecipeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRecipe.title || !imagePrompt) {
            alert('Title and Image Prompt are required.');
            return;
        }
        setIsAddingRecipe(true);
        try {
            const imageUrl = await generateImage(imagePrompt);
            const finalRecipe: Recipe = {
                title: newRecipe.title,
                description: newRecipe.description || '',
                imageUrl: imageUrl,
                ingredients: Array.isArray(newRecipe.ingredients) ? newRecipe.ingredients.filter(i => i.trim() !== '') : [],
                instructions: Array.isArray(newRecipe.instructions) ? newRecipe.instructions.filter(i => i.trim() !== '') : [],
                tags: Array.isArray(newRecipe.tags) ? newRecipe.tags.filter(t => t.trim() !== '') : [],
                servings: newRecipe.servings || '4 servings',
                prepTime: newRecipe.prepTime || '15 min',
                cookTime: newRecipe.cookTime || '30 min',
                status: newRecipe.status || 'active',
                nutrition: newRecipe.nutrition || { calories: 'N/A', protein: 'N/A', carbs: 'N/A', fat: 'N/A' },
            };
            onAddRecipe(finalRecipe);
            // Reset form
            setNewRecipe({ status: 'active' });
            setImagePrompt('');
            setCurrentView('recipes');
        } catch (error) {
            console.error("Error adding new recipe:", error);
            alert("Failed to add recipe. Could not generate image.");
        } finally {
            setIsAddingRecipe(false);
        }
    };

    const handleInputChange = (field: keyof Recipe, value: any) => {
        setNewRecipe(prev => ({ ...prev, [field]: value }));
    };

    const handleNutritionChange = (field: keyof Recipe['nutrition'], value: string) => {
        setNewRecipe(prev => ({
            ...prev,
            nutrition: { ...prev.nutrition, [field]: value }
        }));
    };

    const handleSaveDraft = () => {
        newsletterService.saveNewsletterDraft(newsletterSubject, newsletterBody);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
    };
    
    const handleSendNewsletter = () => {
        if (window.confirm(`Are you sure you want to send this newsletter to ${allLeads.length} recipients?`)) {
            setIsSending(true);
            // Simulate network delay
            setTimeout(() => {
                newsletterService.sendNewsletter(newsletterSubject, newsletterBody, allLeads.length);
                setNewsletterSubject('');
                setNewsletterBody('');
                setSentNewsletters(newsletterService.getSentNewsletters());
                setIsSending(false);
                alert('Newsletter sent successfully!');
            }, 1000);
        }
    };

    const renderUserManagement = () => (
        <div className="bg-white p-6 rounded-lg shadow-md border border-border-color mt-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">User Management</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Premium Status</th>
                            <th scope="col" className="px-6 py-3">Plan End Date</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.map(user => {
                            const hasActiveSub = user.subscription && user.subscription.status === 'active' && new Date(user.subscription.endDate) >= new Date();
                            return (
                                <tr key={user.email} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className={`px-6 py-4 font-semibold ${hasActiveSub ? 'text-green-600' : 'text-gray-500'}`}>
                                        {hasActiveSub ? 'Active' : 'Inactive'}
                                    </td>
                                    <td className="px-6 py-4">{hasActiveSub ? user.subscription?.endDate : 'N/A'}</td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <button onClick={() => handleEditUserClick(user)} title="Edit User" className="p-1.5 text-gray-500 hover:text-gray-800"><PencilIcon className="w-5 h-5" /></button>
                                        <button onClick={() => onDeleteUser(user.email)} title="Delete User" className="p-1.5 text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5" /></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderLeadsManagement = () => (
        <div className="bg-white p-6 rounded-lg shadow-md border border-border-color mt-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Collected Leads ({allLeads.length})</h2>
            <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Date Collected</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allLeads.length > 0 ? (
                            allLeads.sort((a, b) => new Date(b.collectedDate).getTime() - new Date(a.collectedDate).getTime()).map(lead => (
                                <tr key={lead.email} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{lead.email}</td>
                                    <td className="px-6 py-4">{lead.collectedDate}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2} className="text-center py-8 text-gray-500">No leads collected yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderRecipeManagement = () => (
         <div className="bg-white p-6 rounded-lg shadow-md border border-border-color mt-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Recipe Management</h2>
            <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Image</th>
                            <th scope="col" className="px-6 py-3">Title</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRecipes.map(recipe => (
                            <tr key={recipe.title} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <img src={recipe.imageUrl} alt={recipe.title} className="w-16 h-12 object-cover rounded-md"/>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{recipe.title}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                         recipe.status === 'new_this_month' ? 'bg-yellow-100 text-yellow-800' : 
                                         recipe.status === 'archived' ? 'bg-red-100 text-red-800' :
                                         'bg-gray-100 text-gray-800'
                                         }`}>
                                        {statusMap[recipe.status]}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                     <select
                                        value={recipe.status}
                                        onChange={(e) => onUpdateRecipeStatus(recipe.title, e.target.value as Recipe['status'])}
                                        className="text-xs p-1.5 border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                     >
                                        <option value="active">All Recipes</option>
                                        <option value="new_this_month">New This Month</option>
                                        <option value="archived">Archive</option>
                                    </select>
                                    <button onClick={() => handleFixClick(recipe.title)} title="Fix Image with AI" className="p-1.5 text-blue-500 hover:text-blue-700 disabled:opacity-50 disabled:cursor-wait" disabled={fixingImageTitle === recipe.title}>
                                        {fixingImageTitle === recipe.title ? <Spinner /> : <WrenchIcon className="w-5 h-5" />}
                                    </button>
                                    <button onClick={() => onDeleteRecipe(recipe.title)} title="Delete Recipe" className="p-1.5 text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderAddRecipeForm = () => (
        <div className="bg-white p-6 rounded-lg shadow-md border border-border-color mt-6">
             <h2 className="text-xl font-bold text-text-primary mb-4">Add New Recipe</h2>
             <form onSubmit={handleAddRecipeSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Add to Section</label>
                    <div className="mt-2 flex gap-4 p-3 bg-gray-50 rounded-md border">
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" value="active" checked={newRecipe.status === 'active'} onChange={() => handleInputChange('status', 'active')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                            <span className="ml-2 text-sm font-medium text-gray-700">All Recipes</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" value="new_this_month" checked={newRecipe.status === 'new_this_month'} onChange={() => handleInputChange('status', 'new_this_month')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                            <span className="ml-2 text-sm font-medium text-gray-700">New This Month (Premium)</span>
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input type="text" value={newRecipe.title || ''} onChange={e => handleInputChange('title', e.target.value)} className="w-full p-2 border rounded"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea value={newRecipe.description || ''} onChange={e => handleInputChange('description', e.target.value)} className="w-full p-2 border rounded" rows={3}></textarea>
                </div>
                 <div>
                    <label className="block text-sm font-medium">Ingredients (one per line)</label>
                    <textarea value={(newRecipe.ingredients || []).join('\n')} onChange={e => handleInputChange('ingredients', e.target.value.split('\n'))} className="w-full p-2 border rounded" rows={5}></textarea>
                </div>
                 <div>
                    <label className="block text-sm font-medium">Instructions (one per line)</label>
                    <textarea value={(newRecipe.instructions || []).join('\n')} onChange={e => handleInputChange('instructions', e.target.value.split('\n'))} className="w-full p-2 border rounded" rows={5}></textarea>
                </div>
                 <div>
                    <label className="block text-sm font-medium">Tags (comma-separated)</label>
                    <input type="text" value={(newRecipe.tags || []).join(', ')} onChange={e => handleInputChange('tags', e.target.value.split(',').map(t => t.trim()))} className="w-full p-2 border rounded"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium">Prep Time</label>
                        <input type="text" value={newRecipe.prepTime || ''} onChange={e => handleInputChange('prepTime', e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Cook Time</label>
                        <input type="text" value={newRecipe.cookTime || ''} onChange={e => handleInputChange('cookTime', e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Servings</label>
                        <input type="text" value={newRecipe.servings || ''} onChange={e => handleInputChange('servings', e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                </div>
                 <div className="grid grid-cols-4 gap-4">
                     <div>
                        <label className="block text-sm font-medium">Calories</label>
                        <input type="text" value={newRecipe.nutrition?.calories || ''} onChange={e => handleNutritionChange('calories', e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Protein</label>
                        <input type="text" value={newRecipe.nutrition?.protein || ''} onChange={e => handleNutritionChange('protein', e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Carbs</label>
                        <input type="text" value={newRecipe.nutrition?.carbs || ''} onChange={e => handleNutritionChange('carbs', e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Fat</label>
                        <input type="text" value={newRecipe.nutrition?.fat || ''} onChange={e => handleNutritionChange('fat', e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium">Image Prompt</label>
                    <textarea value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} className="w-full p-2 border rounded" rows={3} placeholder="e.g., A juicy cheeseburger on a brioche bun with crispy fries on the side"></textarea>
                </div>
                <button type="submit" disabled={isAddingRecipe} className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus disabled:bg-gray-400">
                    {isAddingRecipe ? 'Adding Recipe...' : 'Add Recipe'}
                </button>
             </form>
        </div>
    );

    const renderNewsletterManagement = () => (
        <div className="bg-white p-6 rounded-lg shadow-md border border-border-color mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Editor */}
            <div>
                <h2 className="text-xl font-bold text-text-primary mb-4">Create Newsletter</h2>
                <div className="space-y-4">
                     <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            value={newsletterSubject}
                            onChange={(e) => setNewsletterSubject(e.target.value)}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="body" className="block text-sm font-medium text-gray-700">Body</label>
                        <textarea
                            id="body"
                            rows={12}
                            value={newsletterBody}
                            onChange={(e) => setNewsletterBody(e.target.value)}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            placeholder="Write your newsletter content here..."
                        />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                         <button
                            onClick={handleSaveDraft}
                            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            {saveStatus === 'saved' ? 'Draft Saved!' : 'Save Draft'}
                        </button>
                         <button
                            onClick={handleSendNewsletter}
                            disabled={isSending || !newsletterSubject || !newsletterBody}
                            className="flex-1 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
                        >
                            {isSending ? 'Sending...' : `Send to ${allLeads.length} Leads`}
                        </button>
                    </div>
                </div>
            </div>
            {/* Right: History */}
            <div>
                <h2 className="text-xl font-bold text-text-primary mb-4">Sent History</h2>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 border rounded-md p-4 bg-gray-50">
                    {sentNewsletters.length > 0 ? (
                        sentNewsletters.map(nl => (
                            <div key={nl.id} className="bg-white p-3 rounded-md border">
                                <p className="font-bold text-text-primary">{nl.subject}</p>
                                <p className="text-xs text-gray-500">
                                    Sent on {new Date(nl.sentDate).toLocaleDateString()} to {nl.recipientCount} recipients
                                </p>
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{nl.body}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-8">No newsletters have been sent yet.</p>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
                <button
                    onClick={onBackToApp}
                    className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors"
                >
                    &larr; Back to App
                </button>
            </div>

            <div className="flex border-b border-gray-200">
                <button onClick={() => setCurrentView('users')} className={`px-4 py-2 font-semibold ${currentView === 'users' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>User Management</button>
                <button onClick={() => setCurrentView('leads')} className={`px-4 py-2 font-semibold ${currentView === 'leads' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>Leads</button>
                <button onClick={() => setCurrentView('newsletter')} className={`px-4 py-2 font-semibold ${currentView === 'newsletter' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>Newsletter</button>
                <button onClick={() => setCurrentView('recipes')} className={`px-4 py-2 font-semibold ${currentView === 'recipes' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>Recipe Management</button>
                <button onClick={() => setCurrentView('add_recipe')} className={`px-4 py-2 font-semibold ${currentView === 'add_recipe' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>Add Recipe</button>
            </div>
            
            {currentView === 'users' && renderUserManagement()}
            {currentView === 'leads' && renderLeadsManagement()}
            {currentView === 'recipes' && renderRecipeManagement()}
            {currentView === 'add_recipe' && renderAddRecipeForm()}
            {currentView === 'newsletter' && renderNewsletterManagement()}

            {isEditUserModalOpen && editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={handleCloseEditModal}
                    onSave={onUpdateUser}
                    onGiveFreeTime={onGiveFreeTime}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
