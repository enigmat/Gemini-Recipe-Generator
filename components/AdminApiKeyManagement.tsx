import React, { useState, useEffect } from 'react';
import KeyIcon from './icons/KeyIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import Spinner from './Spinner';

// The TypeScript error indicates this is declared elsewhere, so this redeclaration was causing a conflict.

const AdminApiKeyManagement: React.FC = () => {
    const [isKeySet, setIsKeySet] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkApiKeyStatus = async () => {
        // FIX: Add `(window as any)` type casting when accessing the `window.aistudio` object.
        if ((window as any).aistudio && typeof (window as any).aistudio.hasSelectedApiKey === 'function') {
            try {
                const hasKey = await (window as any).aistudio.hasSelectedApiKey();
                setIsKeySet(hasKey);
            } catch (error) {
                console.error("Error checking API key status:", error);
                setIsKeySet(false);
            }
        } else {
            // Fallback for environments where the aistudio object isn't available
            setIsKeySet(false); 
            console.warn("aistudio API not found. API key status cannot be checked.");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        checkApiKeyStatus();
    }, []);

    const handleSetKey = async () => {
        // FIX: Add `(window as any)` type casting when accessing the `window.aistudio` object.
        if ((window as any).aistudio && typeof (window as any).aistudio.openSelectKey === 'function') {
            try {
                await (window as any).aistudio.openSelectKey();
                // Optimistically update the UI, as per guidelines, to reflect the change immediately.
                setIsKeySet(true);
            } catch(error) {
                console.error("Error opening select key dialog:", error);
                alert("Could not open the API key selection dialog.");
            }
        } else {
            alert('API Key management is not available in this environment.');
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <KeyIcon className="w-7 h-7 text-slate-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">API Key Management</h2>
                    <p className="text-slate-600 mt-2">
                        Your Google AI API key is required for all generative AI features to work. This key is managed securely by the platform and is never stored within the application itself.
                    </p>
                </div>
            </div>

            <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Current Status</h3>
                
                {isLoading ? (
                    <div className="p-4 rounded-md bg-slate-100 text-center text-slate-500">
                        Checking API key status...
                    </div>
                ) : (
                    <div className={`p-4 rounded-md flex items-center gap-3 ${isKeySet ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        {isKeySet ? (
                            <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                        ) : (
                            <XCircleIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                        )}
                        <p className={`font-medium ${isKeySet ? 'text-green-800' : 'text-red-800'}`}>
                            {isKeySet ? 'An API key is configured and ready to use.' : 'No API key has been configured. AI features will not work.'}
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-6">
                <button
                    onClick={handleSetKey}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-6 py-3 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors text-base disabled:bg-teal-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Spinner size="w-5 h-5" />
                            <span>Checking...</span>
                        </>
                    ) : (
                        isKeySet ? 'Update API Key' : 'Set API Key'
                    )}
                </button>
            </div>
        </div>
    );
};

export default AdminApiKeyManagement;