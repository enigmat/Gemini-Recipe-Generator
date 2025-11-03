import React from 'react';
import ExclamationTriangleIcon from './icons/ExclamationTriangleIcon';

const SupabaseConnectionError: React.FC<{ details: string }> = ({ details }) => (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-2xl p-8 border-t-8 border-orange-500">
            <div className="flex flex-col items-center text-center">
                <ExclamationTriangleIcon className="w-16 h-16 text-orange-500" />
                <h1 className="text-3xl font-bold text-slate-800 mt-4">Database Connection Failed</h1>
                <p className="text-lg text-slate-600 mt-2">
                    {details}
                </p>
            </div>

            <div className="mt-8 text-left">
                <h2 className="text-xl font-bold text-center text-slate-700 mb-6">Troubleshooting Steps</h2>
                <ul className="space-y-4">
                    <li className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">1</div>
                        <div>
                            <h3 className="font-semibold text-slate-800">Verify Credentials</h3>
                            <p className="text-slate-600 text-sm mt-1">
                                Double-check that <code className="bg-slate-200 text-slate-800 text-xs font-mono py-0.5 px-1.5 rounded">SUPABASE_URL</code> and <code className="bg-slate-200 text-slate-800 text-xs font-mono py-0.5 px-1.5 rounded">SUPABASE_ANON_KEY</code> in your <code className="bg-slate-200 text-slate-800 text-xs font-mono py-0.5 px-1.5 rounded">config.ts</code> file exactly match your project's API settings.
                            </p>
                        </div>
                    </li>
                     <li className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">2</div>
                        <div>
                            <h3 className="font-semibold text-slate-800">Check CORS Settings</h3>
                            <p className="text-slate-600 text-sm mt-1">
                                In your Supabase dashboard, go to <strong className="text-slate-700">Authentication {'>'} URL Configuration</strong>. For development, add <code className="bg-slate-200 text-slate-800 text-xs font-mono py-0.5 px-1.5 rounded">*</code> to the list of "Allowed Origins (CORS)".
                            </p>
                        </div>
                    </li>
                     <li className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">3</div>
                        <div>
                            <h3 className="font-semibold text-slate-800">Project Status</h3>
                            <p className="text-slate-600 text-sm mt-1">
                                Ensure your Supabase project is active and not paused. Free-tier projects may be paused after a period of inactivity.
                            </p>
                        </div>
                    </li>
                </ul>
                <p className="text-center text-sm text-slate-500 mt-8">After making changes, please refresh the application.</p>
            </div>
        </div>
    </div>
);

export default SupabaseConnectionError;
