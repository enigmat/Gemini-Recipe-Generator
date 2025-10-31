import React, { useState } from 'react';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';

interface AdminBulkImportProps {
    onImport: (htmlContent: string) => void;
    isImporting: boolean;
    importProgress: string;
}

const AdminBulkImport: React.FC<AdminBulkImportProps> = ({ onImport, isImporting, importProgress }) => {
    const [htmlContent, setHtmlContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!htmlContent.trim() || isImporting) return;
        onImport(htmlContent);
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Bulk Import Recipes from HTML</h2>
            
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <p><span className="font-bold">Premium Subscribers:</span> You will receive a monthly recipe file via email. Paste the content of that file here to add the new recipes to your collection.</p>
            </div>

            <p className="text-slate-600 mb-2">
                This tool allows you to import recipes from a Recipe Keeper HTML export file.
            </p>
            <ol className="list-decimal list-inside text-sm text-slate-500 mb-6 space-y-1">
                <li>Open your <code>recipes.html</code> file in a web browser or text editor.</li>
                <li>Select all the content (Ctrl+A or Cmd+A) and copy it (Ctrl+C or Cmd+C).</li>
                <li>Paste the entire copied content into the text box below.</li>
                <li>Click "Import Recipes". The AI will process each recipe title to generate a complete, formatted recipe with an image.</li>
            </ol>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="html-content" className="block text-sm font-medium text-slate-700">
                        Pasted HTML Content
                    </label>
                    <textarea
                        id="html-content"
                        value={htmlContent}
                        onChange={(e) => setHtmlContent(e.target.value)}
                        placeholder="Paste the full HTML content of your recipes file here..."
                        className="mt-1 block w-full h-64 px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-xs"
                        required
                        disabled={isImporting}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isImporting || !htmlContent.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors disabled:bg-teal-300 disabled:cursor-wait"
                >
                    {isImporting ? <Spinner /> : <SparklesIcon className="w-5 h-5" />}
                    <span>{isImporting ? 'Importing...' : 'Import Recipes'}</span>
                </button>
                {importProgress && (
                    <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-md text-center text-slate-700">
                        <p>{importProgress}</p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AdminBulkImport;