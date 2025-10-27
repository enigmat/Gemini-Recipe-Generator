import React, { useState } from 'react';
import LinkIcon from './icons/LinkIcon';
import Spinner from './Spinner';

interface UrlInputProps {
  onExtract: (url: string) => void;
  isExtracting: boolean;
  error: string | null;
}

const UrlInput: React.FC<UrlInputProps> = ({ onExtract, isExtracting, error }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onExtract(url.trim());
    }
  };

  return (
    <div>
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste a recipe URL..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow text-sm"
                aria-label="Recipe URL"
                disabled={isExtracting}
            />
            <button
              type="submit"
              className="p-3 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition-colors flex items-center justify-center disabled:bg-teal-300 disabled:cursor-wait aspect-square"
              disabled={!url.trim() || isExtracting}
              aria-label="Fetch recipe from URL"
            >
                {isExtracting ? (
                    <Spinner size="w-5 h-5" />
                ) : (
                    <LinkIcon className="w-5 h-5" />
                )}
            </button>
        </form>
        <div className="h-4">
            {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
        </div>
    </div>
  );
};

export default UrlInput;