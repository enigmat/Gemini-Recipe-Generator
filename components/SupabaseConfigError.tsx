import React from 'react';
import KeyIcon from './icons/KeyIcon';
import CodeBracketIcon from './icons/CodeBracketIcon';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

const SupabaseConfigError: React.FC = () => (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-2xl p-8 border-t-8 border-red-500">
            <div className="flex flex-col items-center text-center">
                <KeyIcon className="w-16 h-16 text-red-500" />
                <h1 className="text-3xl font-bold text-slate-800 mt-4">Configuration Needed</h1>
                <p className="text-lg text-slate-600 mt-2">
                    Your Supabase credentials are not set up yet. To connect the app to your database, you need to update one file.
                </p>
            </div>

            <div className="mt-8 space-y-6">
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
                        <CodeBracketIcon className="w-6 h-6" />
                        Step 1: Edit the `config.ts` file
                    </h2>
                    <p className="text-slate-600 mt-2">
                        Open the file named <code className="bg-slate-200 text-slate-800 font-mono py-1 px-2 rounded">config.ts</code> in the editor. You will see placeholder values for your Supabase URL and key.
                    </p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
                        <ClipboardIcon className="w-6 h-6" />
                        Step 2: Get your Supabase Credentials
                    </h2>
                    <p className="text-slate-600 mt-2 mb-4">
                        Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-teal-600 font-semibold hover:underline">Supabase project dashboard</a> and navigate to:
                    </p>
                    <p className="text-slate-600 mt-2">
                        <strong className="text-slate-800">Project Settings</strong> {'>'} <strong className="text-slate-800">API</strong>
                    </p>
                    <p className="text-slate-600 mt-4">
                        Copy the <strong className="text-slate-800">Project URL</strong> and the <strong className="text-slate-800">`anon` public key</strong>.
                    </p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h2 className="text-xl font-semibold text-green-700 flex items-center gap-2">
                        <CheckCircleIcon className="w-6 h-6" />
                        Step 3: Update and Save
                    </h2>
                    <p className="text-green-800 mt-2">
                        Replace the placeholder values in <code className="bg-green-200 text-green-900 font-mono py-1 px-2 rounded">config.ts</code> with your actual credentials. Once you save the file, this application will automatically reload and connect to your database.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default SupabaseConfigError;
