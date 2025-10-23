

import React, { useState, useEffect } from 'react';
import { Recipe, User, Lead, Newsletter, CookingClass, Lesson, AboutUsInfo, VideoCategory, Video } from '../types';
import { generateImage, generateRecipeContentFromPrompt, generateVideoDetails } from '../services/geminiService';
import * as newsletterService from '../services/newsletterService';
import * as aboutUsService from '../services/aboutUsService';
import TrashIcon from './icons/TrashIcon';
import WrenchIcon from './icons/WrenchIcon';
import Spinner from './Spinner';
import PencilIcon from './icons/PencilIcon';
import EditUserModal from './EditUserModal';
import PlusIcon from './icons/PlusIcon';
import SparklesIcon from './icons/SparklesIcon';

interface AdminDashboardProps {
    onBackToApp: () => void;
    onAddRecipe: (recipe: Recipe) => void;
    allUsers: User[];
    allRecipes: Recipe[];
    allLeads: Lead[];
    cookingClasses: CookingClass[];
    videos: VideoCategory[];
    onDeleteUser: (email: string) => void;
    onGiveFreeTime: (email: string, months: number) => void;
    onUpdateUser: (email: string, updatedData: Partial<User>) => void;
    onDeleteRecipe: (title: string) => void;
    onUpdateRecipeStatus: (title: string, status: Recipe['status']) => void;
    onFixImage: (title: string) => Promise<void>;
    onAddCookingClass: (newClass: Omit<CookingClass, 'id'>) => void;
    onUpdateCookingClass: (classId: string, updatedData: Partial<Omit<CookingClass, 'id' | 'lessons'>>) => void;
    onDeleteCookingClass: (classId: string) => void;
    onAddLesson: (classId: string) => void;
    onUpdateLesson: (classId: string, lessonId: string, updatedData: Partial<Omit<Lesson, 'id'>>) => void;
    onDeleteLesson: (classId: string, lessonId: string) => void;
    onUpdateClassImage: (classId: string, prompt: string) => Promise<void>;
    onAddVideoCategory: () => void;
    onUpdateVideoCategory: (categoryId: string, newTitle: string) => void;
    onDeleteVideoCategory: (categoryId: string) => void;
    onAddVideo: (categoryId: string, video?: Omit<Video, 'id'>) => void;
    onUpdateVideo: (categoryId: string, videoId: string, updatedData: Partial<Omit<Video, 'id'>>) => void;
    onDeleteVideo: (categoryId: string, videoId: string) => void;
}

type AdminView = 'users' | 'recipes' | 'add_recipe' | 'leads' | 'newsletter' | 'classes' | 'about_us' | 'videos';

const statusMap: { [key in Recipe['status']]: string } = {
    active: 'All Recipes',
    new_this_month: 'New This Month',
    archived: 'Archived',
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({
    onBackToApp, onAddRecipe, allUsers, allRecipes, allLeads, cookingClasses, videos, onDeleteUser,
    onGiveFreeTime, onUpdateUser, onDeleteRecipe, onUpdateRecipeStatus, onFixImage,
    onAddCookingClass, onUpdateCookingClass, onDeleteCookingClass, onAddLesson, onUpdateLesson,
    onDeleteLesson, onUpdateClassImage, onAddVideoCategory, onUpdateVideoCategory,
    onDeleteVideoCategory, onAddVideo, onUpdateVideo, onDeleteVideo
}) => {
    const [currentView, setCurrentView] = useState<AdminView>('users');
    const [fixingImageTitle, setFixingImageTitle] = useState<string | null>(null);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [generatingClassImageId, setGeneratingClassImageId] = useState<string | null>(null);
    const [classImagePrompts, setClassImagePrompts] = useState<{ [key: string]: string }>({});
    const [videoPrompts, setVideoPrompts] = useState<{ [key: string]: string }>({});
    const [generatingVideoCatId, setGeneratingVideoCatId] = useState<string | null>(null);

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
    const [contentPrompt, setContentPrompt] = useState('');
    const [isGeneratingContent, setIsGeneratingContent] = useState(false);
    

    // Newsletter State
    const [newsletterSubject, setNewsletterSubject] = useState('');
    const [newsletterBody, setNewsletterBody] = useState('');
    const [sentNewsletters, setSentNewsletters] = useState<Newsletter[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

    // Add Class State
    const [showAddClassForm, setShowAddClassForm] = useState(false);
    const [newClass, setNewClass] = useState({ title: '', chef: '', description: '' });

    // About Us State
    const [aboutUsInfo, setAboutUsInfo] = useState<AboutUsInfo>(() => aboutUsService.getAboutUsInfo());
    const [aboutUsSaveStatus, setAboutUsSaveStatus] = useState<'idle' | 'saved'>('idle');


    useEffect(() => {
        if (currentView === 'newsletter') {
            const draft = newsletterService.getNewsletterDraft();
            setNewsletterSubject(draft.subject);
            setNewsletterBody(draft.body);
            setSentNewsletters(newsletterService.getSentNewsletters());
        }
    }, [currentView]);

    const sortedRecipes = [...allRecipes].sort((a, b) => a.title.localeCompare(b.title));

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
            setContentPrompt('');
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

    const handleGenerateContent = async () => {
        if (!contentPrompt.trim()) {
            alert("Please enter a recipe idea.");
            return;
        }
        setIsGeneratingContent(true);
        try {
            const { recipeData, imagePrompt } = await generateRecipeContentFromPrompt(contentPrompt);
            setNewRecipe(prev => ({
                ...prev,
                ...recipeData,
            }));
            setImagePrompt(imagePrompt);

        } catch (error) {
            console.error(error);
            alert("Failed to generate recipe details. Please try a different prompt.");
        } finally {
            setIsGeneratingContent(false);
        }
    };

    const handleSaveDraft = () => {
        newsletterService.saveNewsletterDraft(newsletterSubject, newsletterBody);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
    };

    const handleSendNewsletter = () => {
        if (window.confirm(`Are you sure you want to send this newsletter to ${allLeads.length} recipients?`)) {
            setIsSending(true);
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
    
    const handleGenerateClassImage = async (classId: string) => {
        const prompt = classImagePrompts[classId];
        if (!prompt) {
            alert("Please enter an image prompt.");
            return;
        }
        setGeneratingClassImageId(classId);
        await onUpdateClassImage(classId, prompt);
        setGeneratingClassImageId(null);
    };

    const handleAddNewClass = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newClass.title || !newClass.chef) {
            alert("Title and Chef are required.");
            return;
        }
        onAddCookingClass({
            ...newClass,
            imageUrl: 'https://via.placeholder.com/800x800.png?text=New+Class',
            lessons: [],
        });
        setNewClass({ title: '', chef: '', description: '' });
        setShowAddClassForm(false);
    };

    const handleGenerateAndAddVideo = async (categoryId: string) => {
        const prompt = videoPrompts[categoryId];
        if (!prompt || !prompt.trim()) {
            alert('Please enter a video idea prompt.');
            return;
        }
        setGeneratingVideoCatId(categoryId);
        try {
            const details = await generateVideoDetails(prompt);
            const thumbnailUrl = await generateImage(details.thumbnailImagePrompt);
            
            const newVideo: Omit<Video, 'id'> = {
                title: details.title,
                description: details.description,
                thumbnailUrl,
                videoUrl: '' // Admin needs to add this
            };

            onAddVideo(categoryId, newVideo);
            // Clear the prompt after successful generation
            setVideoPrompts(prev => ({ ...prev, [categoryId]: '' }));

        } catch (error) {
            console.error("Failed to generate and add video:", error);
            alert("Sorry, there was an error generating the video details. Please try again.");
        } finally {
            setGeneratingVideoCatId(null);
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
             
             <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-dashed">
                <h3 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-primary" />
                    Generate with AI
                </h3>
                <p className="text-sm text-text-secondary mb-3">
                    Describe the recipe you want, and AI will fill out the details for you. You can review and edit before adding.
                </p>
                <textarea
                    value={contentPrompt}
                    onChange={e => setContentPrompt(e.target.value)}
                    placeholder="e.g., A healthy one-pan lemon herb chicken with roasted asparagus and potatoes"
                    className="w-full p-2 border rounded"
                    rows={3}
                    disabled={isGeneratingContent}
                />
                <button
                    type="button"
                    onClick={handleGenerateContent}
                    disabled={isGeneratingContent || !contentPrompt.trim()}
                    className="mt-3 w-full px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-focus disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                    {isGeneratingContent ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Generating Details...</span>
                        </>
                    ) : (
                        'Generate Recipe Details'
                    )}
                </button>
             </div>
             
             <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t"></div>
                <span className="flex-shrink mx-4 text-xs font-semibold uppercase text-gray-400">Or Add Manually</span>
                <div className="flex-grow border-t"></div>
            </div>

             <form onSubmit={handleAddRecipeSubmit} className="space-y-4 mt-4">
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
                    <textarea value={Array.isArray(newRecipe.ingredients) ? newRecipe.ingredients.join('\n') : ''} onChange={e => handleInputChange('ingredients', e.target.value.split('\n'))} className="w-full p-2 border rounded" rows={5}></textarea>
                </div>
                 <div>
                    <label className="block text-sm font-medium">Instructions (one per line)</label>
                    <textarea value={Array.isArray(newRecipe.instructions) ? newRecipe.instructions.join('\n') : ''} onChange={e => handleInputChange('instructions', e.target.value.split('\n'))} className="w-full p-2 border rounded" rows={5}></textarea>
                </div>
                 <div>
                    <label className="block text-sm font-medium">Tags (comma-separated)</label>
                    <input type="text" value={Array.isArray(newRecipe.tags) ? newRecipe.tags.join(', ') : ''} onChange={e => handleInputChange('tags', e.target.value.split(',').map(t => t.trim()))} className="w-full p-2 border rounded"/>
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

    const renderClassManagement = () => (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text-primary">Cooking Class Management</h2>
                <button
                    onClick={() => setShowAddClassForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add New Class
                </button>
            </div>

            {showAddClassForm && (
                <form onSubmit={handleAddNewClass} className="bg-white p-4 rounded-lg shadow-md border mb-6 space-y-3">
                     <h3 className="font-semibold text-lg">New Class Details</h3>
                    <input
                        value={newClass.title}
                        onChange={e => setNewClass(p => ({ ...p, title: e.target.value }))}
                        placeholder="Class Title"
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        value={newClass.chef}
                        onChange={e => setNewClass(p => ({ ...p, chef: e.target.value }))}
                        placeholder="Chef Name"
                        className="w-full p-2 border rounded"
                        required
                    />
                    <textarea
                        value={newClass.description}
                        onChange={e => setNewClass(p => ({ ...p, description: e.target.value }))}
                        placeholder="Class Description"
                        className="w-full p-2 border rounded"
                        rows={3}
                    />
                    <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => setShowAddClassForm(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Save Class</button>
                    </div>
                </form>
            )}

            <div className="space-y-6">
                {cookingClasses.map(cls => (
                    <div key={cls.id} className="bg-white p-4 rounded-lg shadow-md border">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Class Details */}
                            <div className="space-y-3">
                                <h3 className="font-semibold">Class Details</h3>
                                <div>
                                    <label className="text-xs font-medium">Title</label>
                                    <input value={cls.title} onChange={e => onUpdateCookingClass(cls.id, { title: e.target.value })} className="w-full p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium">Chef</label>
                                    <input value={cls.chef} onChange={e => onUpdateCookingClass(cls.id, { chef: e.target.value })} className="w-full p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium">Description</label>
                                    <textarea value={cls.description} onChange={e => onUpdateCookingClass(cls.id, { description: e.target.value })} className="w-full p-2 border rounded" rows={4} />
                                </div>
                            </div>

                            {/* Image */}
                            <div className="space-y-3">
                                <h3 className="font-semibold">Class Image</h3>
                                <img src={cls.imageUrl} alt={cls.title} className="w-full h-40 object-cover rounded-md" />
                                <div>
                                    <label className="text-xs font-medium">New Image Prompt</label>
                                    <div className="flex gap-2">
                                        <input
                                            value={classImagePrompts[cls.id] || ''}
                                            onChange={e => setClassImagePrompts(p => ({ ...p, [cls.id]: e.target.value }))}
                                            placeholder="e.g., Rustic sourdough bread on a wooden board"
                                            className="w-full p-2 border rounded"
                                        />
                                        <button onClick={() => handleGenerateClassImage(cls.id)} disabled={generatingClassImageId === cls.id} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400">
                                            {generatingClassImageId === cls.id ? <Spinner/> : 'Gen'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Lessons */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold">Lessons</h3>
                                    <button onClick={() => onAddLesson(cls.id)} className="text-sm flex items-center gap-1 text-primary hover:underline"><PlusIcon className="w-4 h-4" /> Add</button>
                                </div>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    {cls.lessons.map(lesson => (
                                        <div key={lesson.id} className="bg-gray-50 p-2 rounded border space-y-1">
                                            <div className="flex items-center gap-2">
                                                <input value={lesson.title} onChange={e => onUpdateLesson(cls.id, lesson.id, { title: e.target.value })} className="w-full p-1 border rounded text-sm" placeholder="Lesson Title"/>
                                                <button onClick={() => onDeleteLesson(cls.id, lesson.id)}><TrashIcon className="w-4 h-4 text-red-500" /></button>
                                            </div>
                                            <input value={lesson.duration} onChange={e => onUpdateLesson(cls.id, lesson.id, { duration: e.target.value })} className="w-full p-1 border rounded text-xs" placeholder="Duration (e.g., 15:30)"/>
                                            <input value={lesson.videoUrl} onChange={e => onUpdateLesson(cls.id, lesson.id, { videoUrl: e.target.value })} className="w-full p-1 border rounded text-xs" placeholder="Video URL"/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-end">
                            <button onClick={() => onDeleteCookingClass(cls.id)} className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600">Delete Class</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderAboutUsEditor = () => {
        const handleAboutUsChange = (field: keyof AboutUsInfo, value: string) => {
            setAboutUsInfo(prev => ({ ...prev, [field]: value }));
        };
    
        const handleSaveAboutUs = () => {
            aboutUsService.saveAboutUsInfo(aboutUsInfo);
            setAboutUsSaveStatus('saved');
            setTimeout(() => setAboutUsSaveStatus('idle'), 2000);
        };
    
        return (
            <div className="bg-white p-6 rounded-lg shadow-md border border-border-color mt-6">
                <h2 className="text-xl font-bold text-text-primary mb-4">About Us Page Content</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Company Name</label>
                        <input type="text" value={aboutUsInfo.companyName} onChange={e => handleAboutUsChange('companyName', e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Mission Statement</label>
                        <textarea value={aboutUsInfo.missionStatement} onChange={e => handleAboutUsChange('missionStatement', e.target.value)} className="w-full p-2 border rounded" rows={3}></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Company History</label>
                        <textarea value={aboutUsInfo.history} onChange={e => handleAboutUsChange('history', e.target.value)} className="w-full p-2 border rounded" rows={5}></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Contact Email</label>
                        <input type="email" value={aboutUsInfo.contactEmail} onChange={e => handleAboutUsChange('contactEmail', e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Address</label>
                        <input type="text" value={aboutUsInfo.address} onChange={e => handleAboutUsChange('address', e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={handleSaveAboutUs} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus">
                            {aboutUsSaveStatus === 'saved' ? 'Saved!' : 'Save Information'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderVideoManagement = () => (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text-primary">Video Management</h2>
                <button
                    onClick={onAddVideoCategory}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add New Category
                </button>
            </div>

            <div className="space-y-6">
                {videos.map(category => (
                    <div key={category.id} className="bg-white p-4 rounded-lg shadow-md border">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b">
                            <input 
                                value={category.title}
                                onChange={(e) => onUpdateVideoCategory(category.id, e.target.value)}
                                className="text-lg font-bold text-text-primary border-none focus:ring-2 focus:ring-primary p-1 -m-1 rounded"
                            />
                            <button onClick={() => onDeleteVideoCategory(category.id)} className="p-1 text-red-500 hover:text-red-700">
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {category.videos.map(video => (
                                <div key={video.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-md border">
                                    <div className="space-y-2">
                                        <input value={video.title} onChange={(e) => onUpdateVideo(category.id, video.id, { title: e.target.value })} placeholder="Video Title" className="w-full p-2 border rounded text-sm"/>
                                        <textarea value={video.description} onChange={(e) => onUpdateVideo(category.id, video.id, { description: e.target.value })} placeholder="Description" className="w-full p-2 border rounded text-sm" rows={2}/>
                                    </div>
                                    <div className="space-y-2">
                                        <input value={video.thumbnailUrl} onChange={(e) => onUpdateVideo(category.id, video.id, { thumbnailUrl: e.target.value })} placeholder="Thumbnail URL" className="w-full p-2 border rounded text-sm"/>
                                        <div className="flex items-center gap-2">
                                            <input value={video.videoUrl} onChange={(e) => onUpdateVideo(category.id, video.id, { videoUrl: e.target.value })} placeholder="Video URL" className="w-full p-2 border rounded text-sm"/>
                                            <button onClick={() => onDeleteVideo(category.id, video.id)} className="p-1 text-red-500 hover:text-red-700">
                                                <TrashIcon className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                         <div className="mt-4 pt-4 border-t">
                            <div className="p-3 bg-blue-50 rounded-lg border border-dashed border-blue-200">
                                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1 text-blue-800">
                                    <SparklesIcon className="w-4 h-4 text-blue-500" />
                                    Generate with AI
                                </h4>
                                <textarea
                                    value={videoPrompts[category.id] || ''}
                                    onChange={(e) => setVideoPrompts(prev => ({ ...prev, [category.id]: e.target.value }))}
                                    placeholder="e.g., A quick tutorial on making a simple vinaigrette"
                                    className="w-full p-2 border rounded text-sm"
                                    rows={2}
                                    disabled={generatingVideoCatId === category.id}
                                />
                                <div className="flex items-center justify-end gap-2 mt-2">
                                    <button
                                        onClick={() => onAddVideo(category.id)}
                                        className="px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-lg hover:bg-gray-600 flex items-center gap-1"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        Add Blank
                                    </button>
                                    <button
                                        onClick={() => handleGenerateAndAddVideo(category.id)}
                                        disabled={generatingVideoCatId === category.id || !(videoPrompts[category.id] || '').trim()}
                                        className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-focus flex items-center gap-1 disabled:bg-gray-400"
                                    >
                                        {generatingVideoCatId === category.id ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        ) : (
                                            <SparklesIcon className="w-4 h-4" />
                                        )}
                                        <span>
                                            {generatingVideoCatId === category.id ? 'Generating...' : 'Generate & Add'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
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

            <div className="flex border-b border-gray-200 overflow-x-auto">
                <button onClick={() => setCurrentView('users')} className={`flex-shrink-0 px-4 py-2 font-semibold ${currentView === 'users' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>User Management</button>
                <button onClick={() => setCurrentView('leads')} className={`flex-shrink-0 px-4 py-2 font-semibold ${currentView === 'leads' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>Leads</button>
                <button onClick={() => setCurrentView('newsletter')} className={`flex-shrink-0 px-4 py-2 font-semibold ${currentView === 'newsletter' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>Newsletter</button>
                <button onClick={() => setCurrentView('recipes')} className={`flex-shrink-0 px-4 py-2 font-semibold ${currentView === 'recipes' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>Recipe Management</button>
                <button onClick={() => setCurrentView('add_recipe')} className={`flex-shrink-0 px-4 py-2 font-semibold ${currentView === 'add_recipe' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>Add Recipe</button>
                <button onClick={() => setCurrentView('classes')} className={`flex-shrink-0 px-4 py-2 font-semibold ${currentView === 'classes' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>Cooking Classes</button>
                <button onClick={() => setCurrentView('videos')} className={`flex-shrink-0 px-4 py-2 font-semibold ${currentView === 'videos' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>Video Management</button>
                <button onClick={() => setCurrentView('about_us')} className={`flex-shrink-0 px-4 py-2 font-semibold ${currentView === 'about_us' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>About Us</button>
            </div>
            
            {currentView === 'users' && renderUserManagement()}
            {currentView === 'leads' && renderLeadsManagement()}
            {currentView === 'recipes' && renderRecipeManagement()}
            {currentView === 'add_recipe' && renderAddRecipeForm()}
            {currentView === 'newsletter' && renderNewsletterManagement()}
            {currentView === 'classes' && renderClassManagement()}
            {currentView === 'videos' && renderVideoManagement()}
            {currentView === 'about_us' && renderAboutUsEditor()}

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