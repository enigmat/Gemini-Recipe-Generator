import React, { useState } from 'react';
import SparklesIcon from './icons/SparklesIcon';

interface MarketplaceSearchProps {
    onSearch: (prompt: string) => void;
    isLoading: boolean;
}

const MarketplaceSearch: React.FC<MarketplaceSearchProps> = ({ onSearch, isLoading }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading) {
            onSearch(prompt);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-lg shadow-md border border-border-color">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Search for kitchenware, spices, and more with AI..."
                    className="flex-grow w-full p-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-focus disabled:bg-gray-400 disabled:cursor-wait transition-colors"
                >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        <SparklesIcon className="h-5 w-5" />
                    )}
                    <span>{isLoading ? 'Searching...' : 'Search'}</span>
                </button>
            </div>
        </form>
    );
};

export default MarketplaceSearch;
