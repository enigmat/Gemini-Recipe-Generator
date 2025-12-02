

import React, { useState } from 'react';
import ExclamationTriangleIcon from './icons/ExclamationTriangleIcon';
import TrashIcon from './icons/TrashIcon';
import ArrowPathIcon from './icons/ArrowPathIcon';

const SupabaseConnectionError: React.FC<{ details: string }> = ({ details }) => {
    // Pre-fill inputs with currently stored values to allow easy editing
    const [url, setUrl] = useState(localStorage.getItem('recipe_app_supabase_url') || '');
    const [key, setKey] = useState(localStorage.getItem('recipe_app_supabase_key') || '');

    const handleUpdate = () => {
        if (url && key) {
            localStorage.setItem('recipe_app_supabase_url', url.trim());
            localStorage.setItem('recipe_app_supabase_key', key.trim());
            window.location.reload();
        }
    };

    const handleClearSettings = () => {
        if (window.confirm("This will clear any manually saved Supabase settings. Proceed?")) {
            localStorage.removeItem('recipe_app_supabase_url');
            localStorage.removeItem('recipe_app_supabase_key');
            window.location.reload();
        }
    };

    const handleResetDefaults = () => {
        // This clears local storage, forcing the app to re-read config.ts
        localStorage.removeItem('recipe_app_supabase_url');
        localStorage.removeItem('recipe_app_supabase_key');
        window.location.reload();
    };

    const isDashboardUrl = (u: string) => u.includes('supabase.com/dashboard') || u.includes('supabase.io/dashboard');

    return (
        <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-white rounded-xl shadow-2xl p-8 border-t-8 border-orange-500">
                <div className="flex flex-col items-center text-center">
                    <ExclamationTriangleIcon className="w-16 h-16 text-orange-500" />
                    <h1 className="text-3xl font-bold text-slate-800 mt-4">Connection Issue</h1>
                    <p className="text-lg text-slate-600 mt-2">
                        We couldn't connect to the database. Please check your settings.
                    </p>
                    <div className="text-sm text-red-500 mt-4 bg-red-50 p-3 rounded border border-red-100 font-mono text-left w-full overflow-auto max-h-32 whitespace-pre-wrap break-words">
                        <strong>Error Details:</strong> {details}
                    </div>
                </div>

                <div className="mt-8 bg-slate-50 p-6 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-slate-700">Update Connection Details</h2>
                        <div className="flex gap-2">
                             <button 
                                onClick={handleResetDefaults}
                                className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                                title="Reset to default configuration from code"
                            >
                                <ArrowPathIcon className="w-4 h-4" /> Reset to Config Defaults
                            </button>
                            <button 
                                onClick={handleClearSettings}
                                className="text-xs flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold px-3 py-2 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition-colors"
                                title="Clear manually saved settings"
                            >
                                <TrashIcon className="w-4 h-4" /> Clear Saved
                            </button>
                        </div>
                    </div>
                    
                    <div className="mb-6 p-4 bg-white border border-slate-200 rounded-md text-sm text-slate-600">
                        <p className="font-semibold mb-2">Where to find your credentials:</p>
                        <p>Supabase Dashboard &gt; Select Project &gt; Settings (Cog Icon) &gt; API</p>
                        <p className="mt-2 text-xs text-orange-600 font-bold">
                            IMPORTANT: Use the "Project URL" (ends in .supabase.co), NOT the browser URL.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Supabase Project URL</label>
                            <input 
                                type="text" 
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://your-project.supabase.co"
                                className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 ${isDashboardUrl(url) ? 'border-red-300 ring-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50' : 'border-slate-300 focus:ring-orange-500 focus:border-orange-500'}`}
                            />
                            {isDashboardUrl(url) && (
                                <p className="text-xs text-red-600 mt-1 font-semibold">
                                    Warning: This looks like a Dashboard URL. Please use the API URL ending in .supabase.co
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Supabase Anon Key</label>
                            <input 
                                type="password" 
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                placeholder="your-anon-key"
                                className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                        <button 
                            onClick={handleUpdate}
                            disabled={!url || !key}
                            className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-md hover:bg-orange-600 transition-colors disabled:bg-orange-300"
                        >
                            Update & Retry
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-left">
                    <h2 className="text-sm font-bold text-slate-700 mb-2">Other Troubleshooting Steps</h2>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                        <li>Check if your Supabase project is paused (common for free tier).</li>
                        <li>Ensure your internet connection is stable.</li>
                        <li>Verify that you copied the <strong>anon</strong> key, not the service_role key.</li>
                        <li>Try the "Reset to Config Defaults" button above if you think you made a typo.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SupabaseConnectionError;
