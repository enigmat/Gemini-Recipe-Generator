import React, { useState } from 'react';
import { Recipe, User } from '../types';
import * as userService from '../services/userService';
import { generateImage } from '../services/geminiService';
import TrashIcon from './icons/TrashIcon';
import CrownIcon from './icons/CrownIcon';
import WrenchIcon from './icons/WrenchIcon';
import Spinner from './Spinner';

interface AdminDashboardProps {
    onBackToApp: () => void;
    onAddRecipe: (recipe: Recipe) => void;
    allUsers: User[];
    allRecipes: Recipe[];
    onDeleteUser: (email: string) => void;
    onGrantPremium: (email: string) => void;
    onDeleteRecipe: (title: string) => void;
    onFixImage: (title: string) => Promise<void>;
}

type AdminView = 'users' | 'recipes' | 'add_recipe';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp, onAddRecipe, allUsers, allRecipes, onDeleteUser, onGrantPremium, onDeleteRecipe, onFixImage }) => {
    const [currentView, setCurrentView] = useState<AdminView>('users');
    const [fixingImageTitle, setFixingImageTitle] = useState<string | null>(null);
    const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
        title: '',
        description: '',
        ingredients: [],
        instructions: [],
        tags: [],
        prepTime: '',
        cookTime: '',
        servings: '',
        nutrition: { calories: '', protein: '', carbs: '', fat: '' }
    });
    const [imagePrompt, setImagePrompt] = useState('');
    const [isAddingRecipe, setIsAddingRecipe] = useState(false);

    const handleFixClick = async (title: string) => {
        setFixingImageTitle(title);
        await onFixImage(title);
        setFixingImageTitle(null);
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
                ...newRecipe,
                title: newRecipe.title,
                description: newRecipe.description || '',
                imageUrl: imageUrl,
                ingredients: Array.isArray(newRecipe.ingredients) ? newRecipe.ingredients.filter(i => i.trim() !== '') : [],
                instructions: Array.isArray(newRecipe.instructions) ? newRecipe.instructions.filter(i => i.trim() !== '') : [],
                tags: Array.isArray(newRecipe.tags) ? newRecipe.tags.filter(t => t.trim() !== '') : [],
                servings: newRecipe.servings || '4 servings',
                prepTime: newRecipe.prepTime || '15 min',
                cookTime: newRecipe.cookTime || '30 min',
                nutrition: newRecipe.nutrition || { calories: 'N/A', protein: 'N/A', carbs: 'N/A', fat: 'N/A' },
            };
            onAddRecipe(finalRecipe);
            // Reset form
            setNewRecipe({});
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

    const renderUserManagement = () => (
        <div className="bg-white p-6 rounded-lg shadow-md border border-border-color mt-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">User Management</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Premium Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.map(user => (
                            <tr key={user.email} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4">{user.isAdmin ? 'Admin' : 'User'}</td>
                                <td className="px-6 py-4">{userService.getPremiumStatus() ? 'Active' : 'None'}</td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <button onClick={() => onGrantPremium(user.email)} title="Grant Premium" className="p-1.5 text-yellow-500 hover:text-yellow-700 disabled:opacity-50" disabled={userService.getPremiumStatus()}><CrownIcon className="w-5 h-5" /></button>
                                    <button onClick={() => onDeleteUser(user.email)} title="Delete User" className="p-1.5 text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5" /></button>
                                </td>
                            </tr>
                        ))}
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
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allRecipes.map(recipe => (
                            <tr key={recipe.title} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <img src={recipe.imageUrl} alt={recipe.title} className="w-16 h-12 object-cover rounded-md"/>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{recipe.title}</td>
                                <td className="px-6 py-4 flex items-center gap-2">
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
                    <label className="block text-sm font-medium">Title</label>
                    <input type="text" value={newRecipe.title} onChange={e => handleInputChange('title', e.target.value)} className="w-full p-2 border rounded"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea value={newRecipe.description} onChange={e => handleInputChange('description', e.target.value)} className="w-full p-2 border rounded" rows={3}></textarea>
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
                        <input type="text" value={newRecipe.prepTime} onChange={e => handleInputChange('prepTime', e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Cook Time</label>
                        <input type="text" value={newRecipe.cookTime} onChange={e => handleInputChange('cookTime', e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Servings</label>
                        <input type="text" value={newRecipe.servings} onChange={e => handleInputChange('servings', e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                </div>
                 <div className="grid grid-cols-4 gap-4">
                     <div>
                        <label className="block text-sm font-medium">Calories</label>
                        <input type="text" value={newRecipe.nutrition?.calories} onChange={e => handleNutritionChange('calories', e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Protein</label>
                        <input type="text" value={newRecipe.nutrition?.protein} onChange={e => handleNutritionChange('protein', e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Carbs</label>
                        <input type="text" value={newRecipe.nutrition?.carbs} onChange={e => handleNutritionChange('carbs', e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Fat</label>
                        <input type="text" value={newRecipe.nutrition?.fat} onChange={e => handleNutritionChange('fat', e.target.value)} className="w-full p-2 border rounded"/>
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
                <button onClick={() => setCurrentView('recipes')} className={`px-4 py-2 font-semibold ${currentView === 'recipes' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>Recipe Management</button>
                <button onClick={() => setCurrentView('add_recipe')} className={`px-4 py-2 font-semibold ${currentView === 'add_recipe' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>Add Recipe</button>
            </div>
            
            {currentView === 'users' && renderUserManagement()}
            {currentView === 'recipes' && renderRecipeManagement()}
            {currentView === 'add_recipe' && renderAddRecipeForm()}

        </div>
    );
};

export default AdminDashboard;