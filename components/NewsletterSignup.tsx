import React, { useState } from 'react';
import MailIcon from './icons/MailIcon';
import { User } from '../types';

interface NewsletterSignupProps {
  onSubscribe: (email: string) => void;
  currentUser: User | null;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ onSubscribe, currentUser }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailToSubmit = currentUser ? currentUser.email : email;
    if (!emailToSubmit.trim() || !emailToSubmit.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    onSubscribe(emailToSubmit);
    setSubmitted(true);
    if (!currentUser) {
        setEmail('');
    }
  };

  const content = submitted ? (
      <div className="text-center">
        <h3 className="text-2xl font-bold text-teal-600">Thank You!</h3>
        <p className="text-gray-600 mt-2">You're subscribed! Keep an eye on your inbox for delicious recipes.</p>
      </div>
  ) : (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
      <div className="text-center lg:text-left">
          <div className="flex items-center gap-3 justify-center lg:justify-start">
               <MailIcon className="w-8 h-8 text-teal-500" />
               <h3 className="text-3xl font-bold text-teal-500">Join Our Newsletter</h3>
          </div>
        <p className="text-gray-600 mt-2 max-w-md">Get our latest recipes, cooking tips, and exclusive content delivered right to your inbox.</p>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-md flex-shrink-0">
        <div className="flex gap-2">
            <input
            type="email"
            value={currentUser?.email || email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow shadow-sm w-full disabled:bg-gray-100"
            aria-label="Email address"
            required
            disabled={!!currentUser}
            />
            <button
            type="submit"
            className="px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-colors"
            >
            Subscribe
            </button>
        </div>
         {error && <p className="text-red-500 text-sm mt-2 text-right">{error}</p>}
      </form>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 border">
        {content}
    </div>
  );
};

export default NewsletterSignup;