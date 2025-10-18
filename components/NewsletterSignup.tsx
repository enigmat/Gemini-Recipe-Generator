import React, { useState } from 'react';
import * as leadService from '../services/leadService';
import MailIcon from './icons/MailIcon';

const NewsletterSignup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        
        // Simulate network delay
        setTimeout(() => {
            const result = leadService.addLead(email);
            setMessage(result.message);
            if (result.success) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        }, 500);
    };

    if (status === 'success') {
        return (
            <div className="bg-primary/10 border-2 border-dashed border-primary/30 p-8 rounded-lg text-center my-12">
                <h3 className="text-2xl font-bold text-primary">Thank You for Subscribing!</h3>
                <p className="mt-2 text-text-secondary">{message}</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 my-12 border border-border-color max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center md:text-left">
                    <div className="flex justify-center md:justify-start items-center gap-3 text-primary">
                        <MailIcon className="w-8 h-8" />
                        <h2 className="text-3xl font-bold">Join Our Newsletter</h2>
                    </div>
                    <p className="mt-2 text-lg text-text-secondary">
                        Get our latest recipes, cooking tips, and exclusive content delivered right to your inbox.
                    </p>
                </div>
                <div className="flex-1 w-full">
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            required
                            className="flex-grow w-full p-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                            aria-label="Email address for newsletter"
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus disabled:bg-gray-400 disabled:cursor-wait transition-colors"
                        >
                            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </form>
                    {status === 'error' && <p className="mt-2 text-sm text-red-600 text-center sm:text-left">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default NewsletterSignup;