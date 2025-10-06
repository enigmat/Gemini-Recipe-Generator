import React, { useState } from 'react';
import XIcon from './icons/XIcon';
import SparklesIcon from './icons/SparklesIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface UpgradeModalProps {
    onClose: () => void;
}

const premiumFeatures = [
    "Exclusive 'New This Month' Recipes",
    "Advanced Cooking Classes",
    "Ask an Expert Q&A",
];

const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpgradeClick = async () => {
        setIsLoading(true);
        setError(null);
        
        if (!process.env.STRIPE_PUBLISHABLE_KEY || !process.env.STRIPE_PRICE_ID) {
            setError("Stripe is not configured correctly. Please contact support.");
            setIsLoading(false);
            return;
        }

        try {
            const stripe = window.Stripe(process.env.STRIPE_PUBLISHABLE_KEY);
            const { error } = await stripe.redirectToCheckout({
                lineItems: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
                mode: 'subscription',
                successUrl: `${window.location.origin}${window.location.pathname}?checkout=success`,
                cancelUrl: `${window.location.origin}${window.location.pathname}?checkout=cancel`,
            });

            if (error) {
                throw new Error(error.message);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred during checkout.");
            }
            setIsLoading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
            role="dialog" 
            aria-modal="true"
            aria-labelledby="upgrade-modal-title"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 text-center">
                    <button 
                        onClick={onClose} 
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10" 
                        aria-label="Close upgrade modal"
                    >
                        <XIcon className="h-6 w-6" />
                    </button>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                        <SparklesIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                    </div>
                    <h2 id="upgrade-modal-title" className="text-2xl font-bold text-text-primary mt-4">
                        Upgrade to Premium
                    </h2>
                    <p className="text-text-secondary mt-2">
                        Unlock your full culinary potential with our exclusive features.
                    </p>
                </div>
                <div className="bg-gray-50 px-6 py-4">
                    <ul className="space-y-3">
                        {premiumFeatures.map((feature, index) => (
                            <li key={index} className="flex items-start">
                                <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-primary mr-2 mt-0.5" />
                                <span className="text-text-secondary">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="p-6">
                     {error && (
                        <div className="mb-4 text-center bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm" role="alert">
                           {error}
                        </div>
                    )}
                    <button
                        onClick={handleUpgradeClick}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus disabled:bg-gray-400 disabled:cursor-wait transition-colors duration-200"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Redirecting...</span>
                            </>
                        ) : (
                            <span>Upgrade for $4.99 / month</span>
                        )}
                    </button>
                    <p className="text-xs text-gray-400 mt-3 text-center">
                        Secure payment processing by Stripe. You can cancel anytime.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
