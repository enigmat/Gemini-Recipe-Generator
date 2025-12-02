
import React, { useState } from 'react';
import KeyIcon from './icons/KeyIcon';
import CodeBracketIcon from './icons/CodeBracketIcon';

const SupabaseConfigError: React.FC = () => {
    const [url, setUrl] = useState('');
    const [key, setKey] = useState('');
    const [showManual, setShowManual] = useState(false);

    const handleConnect = () => {
        if (url && key) {
            localStorage.setItem('recipe_app_supabase_url', url.trim());
            localStorage.setItem('recipe_app_supabase_key', key.trim());
            window.location.reload();
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-white rounded-xl shadow-2xl p-8 border-t-8 border-red-500">
                <div className="flex flex-col items-center text-center mb-8">
                    <KeyIcon className="w-16 h-16 text-red-500" />
                    <h1 className="text-3xl font-bold text-slate-800 mt-4">Connect to Database</h1>
                    <p className="text-lg text-slate-600 mt-2">
                        To get started, you need to link this app to your Supabase project.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                        <h2 className="text-xl font-semibold text-slate-700 mb-4">Your Project Details</h2>
                        
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                            <p className="font-bold mb-2">Where to find these credentials:</p>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Log in to your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="underline hover:text-blue-900">Supabase Dashboard</a>.</li>
                                <li>Select your project.</li>
                                <li>Click on the ⚙️ <strong>Settings</strong> icon (bottom left sidebar).</li>
                                <li>Click on <strong>API</strong> in the list.</li>
                                <li>Copy the <strong>Project URL</strong> and the <strong>anon public</strong> Key.</li>
                            </ol>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Supabase Project URL</label>
                                <input 
                                    type="text" 
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://your-project.supabase.co"
                                    className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Supabase Anon Key</label>
                                <input 
                                    type="password" 
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    placeholder="your-anon-key"
                                    className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <button 
                                onClick={handleConnect}
                                disabled={!url || !key}
                                className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-md hover:bg-teal-600 transition-colors disabled:bg-teal-300"
                            >
                                Save & Connect
                            </button>
                        </div>
                    </div>

                    <div className="text-center">
                        <button 
                            onClick={() => setShowManual(!showManual)}
                            className="text-slate-500 hover:text-slate-700 text-sm font-medium flex items-center justify-center gap-1 mx-auto"
                        >
                            {showManual ? 'Hide developer instructions' : 'I am a developer, show me file instructions'}
                        </button>
                    </div>

                    {showManual && (
                        <div className="animate-fade-in space-y-6 pt-4 border-t">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <h3 className="font-semibold text-slate-700 flex items-center gap-2 text-sm">
                                    <CodeBracketIcon className="w-4 h-4" />
                                    Edit `config.ts`
                                </h3>
                                <p className="text-slate-600 text-xs mt-1">
                                    Alternatively, replace the placeholder values in <code className="bg-slate-200 text-slate-800 font-mono py-0.5 px-1 rounded">config.ts</code> with your actual credentials.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupabaseConfigError;
