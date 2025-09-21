import React from 'react';
import LinkIcon from './icons/LinkIcon';

interface UrlInputProps {
    recipeUrl: string;
    setRecipeUrl: (url: string) => void;
    onFetch: () => void;
    isLoading: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ recipeUrl, setRecipeUrl, onFetch, isLoading }) => {
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onFetch();
        }
    };

    return (
        <div className="w-full">
             <label htmlFor="url-input" className="block text-sm font-medium text-text-secondary mb-1">
                Import from Web
            </label>
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-md border border-border-color h-full">
                <input
                    id="url-input"
                    type="url"
                    value={recipeUrl}
                    onChange={(e) => setRecipeUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Paste a recipe URL..."
                    className="flex-grow p-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                    disabled={isLoading}
                />
                <button
                    onClick={onFetch}
                    disabled={isLoading}
                    className="bg-primary text-white p-2 rounded-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-wait flex items-center gap-2"
                    aria-label="Fetch ingredients from URL"
                >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        <LinkIcon className="h-6 w-6" />
                    )}
                    <span className="hidden sm:inline">{isLoading ? 'Fetching...' : 'Fetch'}</span>
                </button>
            </div>
        </div>
    );
};

export default UrlInput;