import React, { useState } from 'react';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';

interface AdminAddRecipeProps {
    onAddRecipe: (title: string, addToNew: boolean) => Promise<void>;
}

const AdminAddRecipe: React.FC<AdminAddRecipeProps> = ({ onAddRecipe }) => {
    const [title, setTitle] = useState('');
    const [addToNew, setAddToNew] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsAdding(true);
        setError(null);
        setSuccess(null);
        try {
            await onAddRecipe(title, addToNew);
            setSuccess(`Successfully added recipe for "${title}"!`);
            setTitle('');
            setAddToNew(false);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Recipe with AI</h2>
            <p className="text-gray-600 mb-6">
                Enter the title of a dish, and our AI will generate the full recipe details, including an image, ingredients, and instructions.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="recipe-title" className="block text-sm font-medium text-gray-700">
                        Recipe Title
                    </label>
                    <input
                        type="text"
                        id="recipe-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Spicy Tuna Crispy Rice"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        required
                    />
                </div>
                <div className="flex items-center">
                    <input
                        id="add-to-new"
                        type="checkbox"
                        checked={addToNew}
                        onChange={(e) => setAddToNew(e.target.checked)}
                        className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <label htmlFor="add-to-new" className="ml-2 block text-sm text-gray-900">
                        Add to "New This Month" section
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={isAdding || !title.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors disabled:bg-green-300 disabled:cursor-wait"
                >
                    {isAdding ? <Spinner /> : <SparklesIcon className="w-5 h-5" />}
                    <span>{isAdding ? 'Adding Recipe...' : 'Generate & Add Recipe'}</span>
                </button>
                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                {success && <p className="text-green-600 text-sm text-center mt-2">{success}</p>}
            </form>
        </div>
    );
};

export default AdminAddRecipe;