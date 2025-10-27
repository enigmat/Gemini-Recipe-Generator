import React, { useState, useMemo } from 'react';
import { Recipe, User, Newsletter } from '../types';
import Spinner from './Spinner';

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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Newsletter Panel */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Create Newsletter</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                        <input
                            id="subject"
                            type="text"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={4}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                            placeholder="e.g., Check out our favorite picks for this week!"
                            required
                        />
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Select Recipes to Feature</h3>
                        <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-1">
                            {allRecipes.map(recipe => (
                                <label key={recipe.id} className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRecipeIds.includes(recipe.id)}
                                        onChange={() => handleToggleRecipe(recipe.id)}
                                        className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                    />
                                    <span className="ml-3 text-sm text-gray-800">{recipe.title}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                         <h3 className="text-sm font-medium text-gray-700 mb-2">Target Audience</h3>
                         <div className="flex gap-4">
                            <label className="flex items-center">
                                <input type="radio" value="all" checked={target === 'all'} onChange={() => setTarget('all')} className="h-4 w-4 text-amber-600 border-gray-300 focus:ring-amber-500"/>
                                <span className="ml-2 text-sm text-gray-800">All Subscribers</span>
                            </label>
                             <label className="flex items-center">
                                <input type="radio" value="premium" checked={target === 'premium'} onChange={() => setTarget('premium')} className="h-4 w-4 text-amber-600 border-gray-300 focus:ring-amber-500"/>
                                <span className="ml-2 text-sm text-gray-800">Premium Users Only</span>
                            </label>
                         </div>
                    </div>
                    
                    <div className="text-right">
                        <button type="submit" className="flex items-center justify-center gap-2 px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 transition-colors disabled:bg-amber-300" disabled={isSending}>
                            {isSending ? <Spinner size="w-5 h-5"/> : null}
                            {isSending ? 'Sending...' : `Send to ${subscriberCount} user(s)`}
                        </button>
                    </div>
                </form>
            </div>

             {/* Sent Newsletters Panel */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">Sent Newsletters</h2>
                {sentNewsletters.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No newsletters have been sent yet.</p>
                ) : (
                    <div className="max-h-[80vh] overflow-y-auto space-y-4">
                        {sentNewsletters.map(nl => (
                            <div key={nl.id} className="p-4 border rounded-lg bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{nl.subject}</h3>
                                        <p className="text-sm text-gray-500">
                                            Sent: {new Date(nl.sentDate).toLocaleString()} to {nl.target} users
                                        </p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${nl.target === 'premium' ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-800'}`}>
                                        {nl.target}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-2 italic">"{nl.message}"</p>
                                <div className="mt-3">
                                    <h4 className="text-xs font-semibold text-gray-700 uppercase">Featured Recipes:</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
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