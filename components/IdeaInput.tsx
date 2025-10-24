import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

interface IdeaInputProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
}

const IdeaInput: React.FC<IdeaInputProps> = ({ prompt, setPrompt, onGenerate, isLoading }) => {
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Submit on Enter, but allow new lines with Shift+Enter
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            onGenerate();
        }
    };

    return (
        <div className="w-full">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Have an Idea?</h2>
                <p className="text-text-secondary mb-4 max-w-2xl mx-auto">
                    Describe a dish you're craving, and our AI chef will create a unique recipe just for you.
                </p>
            </div>
            <div className="flex flex-col items-center gap-2">
                <textarea
                    id="idea-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g., a spicy vegan noodle soup with crispy tofu and coconut milk..."
                    className="w-full max-w-2xl p-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm resize-none"
                    rows={3}
                    disabled={isLoading}
                    aria-label="Recipe idea description"
                />
                <button
                    onClick={onGenerate}
                    disabled={isLoading || !prompt.trim()}
                    className="mt-2 w-full max-w-xs px-8 py-3 bg-primary text-white font-bold text-lg rounded-lg shadow-md hover:bg-primary-focus disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                    aria-label="Generate recipe from idea"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Creating...</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="h-6 w-6" />
                            <span>Create Recipe</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default IdeaInput;
