import React, { useState, useMemo } from 'react';
import { Recipe, User, Newsletter } from '../types';
import Spinner from './Spinner';
import { generateNewsletterMessage } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';

interface AdminNewsletterProps {
    allRecipes: Recipe[];
    users: User[];
    sentNewsletters: Newsletter[];
    onSendNewsletter: (newsletter: Omit<Newsletter, 'id' | 'sentDate'>) => void;
}

const AdminNewsletter: React.FC<AdminNewsletterProps> = ({ allRecipes, users, sentNewsletters, onSendNewsletter }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [selectedRecipeIds, setSelectedRecipeIds] = useState<number[]>([]);
    const [target, setTarget] = useState<'all' | 'premium'>('all');
    const [isSending, setIsSending] = useState(false);
    const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [recipeSearchQuery, setRecipeSearchQuery] = useState('');

    const subscriberCount = useMemo(() => {
        if (target === 'all') {
            return users.filter(u => u.isSubscribed).length;
        }
        return users.filter(u => u.isSubscribed && u.isPremium).length;
    }, [users, target]);

    const handleToggleRecipe = (recipeId: number) => {
        setSelectedRecipeIds(prev =>
            prev.includes(recipeId)
                ? prev.filter(id => id !== recipeId)
                : [...prev, recipeId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !message || selectedRecipeIds.length === 0) {
            alert('Please fill out the subject, message, and select at least one recipe.');
            return;
        }
        
        if (window.confirm(`You are about to send this newsletter to ${subscriberCount} user(s). Are you sure?`)) {
            setIsSending(true);
            const newsletterData = {
                subject,
                message,
                recipeIds: selectedRecipeIds,
                target,
            };
            // Simulate network delay
            setTimeout(() => {
                onSendNewsletter(newsletterData);
                // Reset form
                setSubject('');
                setMessage('');
                setSelectedRecipeIds([]);
                setTarget('all');
                setIsSending(false);
            }, 1000);
        }
    };
    
    const getRecipeTitle = (id: number) => allRecipes.find(r => r.id === id)?.title || `Recipe ID: ${id}`;

    const handleGenerateMessage = async () => {
        if (!subject.trim() || selectedRecipeIds.length === 0) {
            setGenerationError("Please provide a subject and select at least one recipe first.");
            return;
        }
        
        setIsGeneratingMessage(true);
        setGenerationError(null);
        try {
            const selectedRecipeTitles = selectedRecipeIds.map(id => allRecipes.find(r => r.id === id)?.title || '').filter(Boolean);
            const generatedMessage = await generateNewsletterMessage(subject, selectedRecipeTitles);
            setMessage(generatedMessage);
        } catch (error: any) {
            setGenerationError(error.message || "Failed to generate message.");
        } finally {
            setIsGeneratingMessage(false);
        }
    };

    const filteredRecipes = useMemo(() => {
        if (!recipeSearchQuery) {
            return allRecipes;
        }
        return allRecipes.filter(recipe =>
            recipe.title.toLowerCase().includes(recipeSearchQuery.toLowerCase())
        );
    }, [allRecipes, recipeSearchQuery]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Newsletter Panel */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md space-y-6">
                <h2 className="text-2xl font-bold text-slate-800">Create Newsletter</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-slate-700">Subject</label>
                        <input
                            id="subject"
                            type="text"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message</label>
                            <button type="button" onClick={handleGenerateMessage} disabled={isGeneratingMessage} className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-800 disabled:opacity-50">
                                {isGeneratingMessage ? (<><Spinner size="w-4 h-4" /><span>Generating...</span></>) : (<><SparklesIcon className="w-4 h-4" /><span>Generate with AI</span></>)}
                            </button>
                        </div>
                        <textarea
                            id="message"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={4}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="e.g., Check out our favorite picks for this week!"
                            required
                        />
                        {generationError && <p className="text-red-500 text-xs mt-1">{generationError}</p>}
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-slate-700 mb-2">Select Recipes to Feature</h3>
                         <div className="mb-2">
                            <input
                                type="search" value={recipeSearchQuery} onChange={e => setRecipeSearchQuery(e.target.value)}
                                placeholder="Search for recipes..."
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                        <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-1">
                            {filteredRecipes.map(recipe => (
                                <label key={recipe.id} className="flex items-center p-2 hover:bg-slate-50 rounded-md cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRecipeIds.includes(recipe.id)}
                                        onChange={() => handleToggleRecipe(recipe.id)}
                                        className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                                    />
                                    <span className="ml-3 text-sm text-slate-800">{recipe.title}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                         <h3 className="text-sm font-medium text-slate-700 mb-2">Target Audience</h3>
                         <div className="flex gap-4">
                            <label className="flex items-center">
                                <input type="radio" value="all" checked={target === 'all'} onChange={() => setTarget('all')} className="h-4 w-4 text-teal-600 border-slate-300 focus:ring-teal-500"/>
                                <span className="ml-2 text-sm text-slate-800">All Subscribers</span>
                            </label>
                             <label className="flex items-center">
                                <input type="radio" value="premium" checked={target === 'premium'} onChange={() => setTarget('premium')} className="h-4 w-4 text-teal-600 border-slate-300 focus:ring-teal-500"/>
                                <span className="ml-2 text-sm text-slate-800">Premium Users Only</span>
                            </label>
                         </div>
                    </div>
                    
                    <div className="text-right">
                        <button type="submit" className="flex items-center justify-center gap-2 px-6 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-colors disabled:bg-teal-300" disabled={isSending}>
                            {isSending ? <Spinner size="w-5 h-5"/> : null}
                            {isSending ? 'Sending...' : `Send to ${subscriberCount} user(s)`}
                        </button>
                    </div>
                </form>
            </div>

             {/* Sent Newsletters Panel */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">Sent Newsletters</h2>
                {sentNewsletters.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">No newsletters have been sent yet.</p>
                ) : (
                    <div className="max-h-[80vh] overflow-y-auto space-y-4">
                        {sentNewsletters.map(nl => (
                            <div key={nl.id} className="p-4 border rounded-lg bg-slate-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-slate-800">{nl.subject}</h3>
                                        <p className="text-sm text-slate-500">
                                            Sent: {new Date(nl.sentDate).toLocaleString()} to {nl.target} users
                                        </p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${nl.target === 'premium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-800'}`}>
                                        {nl.target}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 mt-2 italic">"{nl.message}"</p>
                                <div className="mt-3">
                                    <h4 className="text-xs font-semibold text-slate-700 uppercase">Featured Recipes:</h4>
                                    <ul className="list-disc list-inside text-sm text-slate-600 mt-1">
                                        {nl.recipeIds.map(id => (
                                            <li key={id}>{getRecipeTitle(id)}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNewsletter;