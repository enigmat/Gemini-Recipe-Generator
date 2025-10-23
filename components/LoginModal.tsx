import React, { useState } from 'react';
import XIcon from './icons/XIcon';
import UserCircleIcon from './icons/UserCircleIcon';
import GoogleIcon from './icons/GoogleIcon';

interface LoginModalProps {
    onClose: () => void;
    onLogin: (email: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailPasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        setIsLoading(true);
        // Simulate API call for login
        setTimeout(() => {
            onLogin(email);
            setIsLoading(false);
        }, 1000);
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        // Simulate a Google Sign-In popup flow
        setTimeout(() => {
            const googleEmail = window.prompt("Simulating Google Sign-In.\nPlease enter your Google email address to continue:", "premium_user@example.com");
            if (googleEmail && googleEmail.includes('@')) {
                onLogin(googleEmail);
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
            role="dialog" 
            aria-modal="true"
            aria-labelledby="login-modal-title"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                 <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10" 
                    aria-label="Close login modal"
                    disabled={isLoading}
                >
                    <XIcon className="h-6 w-6" />
                </button>
                <div className="p-8">
                    <div className="text-center mb-6">
                         <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                            <UserCircleIcon className="h-7 w-7 text-primary" aria-hidden="true" />
                        </div>
                        <h2 id="login-modal-title" className="text-2xl font-bold text-text-primary mt-4">
                            Sign In
                        </h2>
                        <p className="text-text-secondary mt-1">
                            to access your saved recipes and premium features.
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                         <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60"
                        >
                            <GoogleIcon className="h-5 w-5" />
                            <span>Sign in with Google</span>
                        </button>
                        
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold uppercase">Or</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email Address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-border-color rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label htmlFor="password"  className="block text-sm font-medium text-text-secondary">Password</label>
                                 <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-border-color rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    disabled={isLoading}
                                />
                            </div>

                             <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus disabled:bg-gray-400 disabled:cursor-wait transition-colors duration-200"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    <span>Sign In with Email</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
