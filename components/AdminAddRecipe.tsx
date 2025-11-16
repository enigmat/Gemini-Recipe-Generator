import React, { useState } from 'react';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';
import LinkIcon from './icons/LinkIcon';

interface AdminAddRecipeProps {
    onGenerate: (title: string, addToNew: boolean) => Promise<void>;
    onGenerateFromUrl: (url: string, addToNew: boolean) => Promise<void>;
}

const AdminAddRecipe: React.FC<AdminAddRecipeProps> = ({ onGenerate, onGenerateFromUrl }) => {
    const [title, setTitle] = useState('');
    const [isAddingByTitle, setIsAddingByTitle] = useState(false);
    const [titleError, setTitleError] = useState<string | null>(null);

    const [url, setUrl] = useState('');
    const [isAddingByUrl, setIsAddingByUrl] = useState(false);
    const [urlError, setUrlError] = useState<string | null>(null);

    const [addToNew, setAddToNew] = useState(false);

    const handleTitleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || isAddingByTitle || isAddingByUrl) return;

        setIsAddingByTitle(true);
        setTitleError(null);
        try {
            await onGenerate(title, addToNew);
            setTitle(''); // Clear on success
        } catch (err: any) {
            setTitleError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsAddingByTitle(false);
        }
    };

    const handleUrlSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim() || isAddingByUrl || isAddingByTitle) return;

        setIsAddingByUrl(true);
        setUrlError(null);
        try {
            await onGenerateFromUrl(url, addToNew);
            setUrl(''); // Clear on success
        } catch (err: any) {
            setUrlError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsAddingByUrl(false);
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Recipe with AI</h2>

            <form onSubmit={handleTitleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="recipe-title" className="block text-sm font-medium text-slate-700">
                        Generate from Title
                    </label>
                     <p className="text-slate-500 text-xs mb-2">AI will generate a full recipe from just a title.</p>
                    <input
                        type="text"
                        id="recipe-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Spicy Tuna Crispy Rice"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                        disabled={isAddingByTitle || isAddingByUrl}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isAddingByTitle || isAddingByUrl || !title.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors disabled:bg-teal-300 disabled:cursor-wait"
                >
                    {isAddingByTitle ? <Spinner /> : <SparklesIcon className="w-5 h-5" />}
                    <span>{isAddingByTitle ? 'Generating...' : 'Generate from Title'}</span>
                </button>
                {titleError && <p className="text-red-500 text-sm text-center mt-2">{titleError}</p>}
            </form>

            <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 font-semibold text-sm">OR</span>
                <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleUrlSubmit} className="space-y-4">
                <div>
                    <label htmlFor="recipe-url" className="block text-sm font-medium text-slate-700">
                        Import from URL
                    </label>
                    <p className="text-slate-500 text-xs mb-2">Paste a URL and AI will extract the recipe.</p>
                    <input
                        type="url"
                        id="recipe-url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/some-great-recipe"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                        disabled={isAddingByTitle || isAddingByUrl}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isAddingByTitle || isAddingByUrl || !url.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-wait"
                >
                    {isAddingByUrl ? <Spinner /> : <LinkIcon className="w-5 h-5" />}
                    <span>{isAddingByUrl ? 'Importing...' : 'Import from URL'}</span>
                </button>
                {urlError && <p className="text-red-500 text-sm text-center mt-2">{urlError}</p>}
            </form>
            
            <div className="pt-6 border-t mt-6">
                <div className="flex items-center">
                    <input
                        id="add-to-new"
                        type="checkbox"
                        checked={addToNew}
                        onChange={(e) => setAddToNew(e.target.checked)}
                        className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="add-to-new" className="ml-2 block text-sm text-slate-900">
                        Add to "New This Month" upon saving
                    </label>
                </div>
            </div>
        </div>
    );
};

export default AdminAddRecipe;
