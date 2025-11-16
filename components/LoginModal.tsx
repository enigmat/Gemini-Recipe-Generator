import React, { useState } from 'react';
import * as userService from '../services/userService';
import { User } from '../types';
import EyeIcon from './icons/EyeIcon';
import EyeSlashIcon from './icons/EyeSlashIcon';
  
interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');

    try {
        if (isLoginView) {
            await userService.signIn(email, password);
        } else {
            await userService.signup(email, password);
        }
        // On success, the onAuthStateChange listener in App.tsx will handle
        // setting the user and closing the modal. We can just call onClose here
        // for a faster UI response.
        onClose();
    } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
          {isLoginView ? 'Welcome Back' : 'Create an Account'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow text-slate-900 placeholder-slate-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
                <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow text-slate-900 placeholder-slate-500"
                    placeholder="******************"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword 
                        ? <EyeSlashIcon className="h-5 w-5" /> 
                        : <EyeIcon className="h-5 w-5" />
                    }
                </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
            >
              {isLoginView ? 'Log In' : 'Sign Up'}
            </button>
          </div>
        </form>
        <p className="text-center text-slate-600 text-sm mt-6">
          {isLoginView ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => {
                setIsLoginView(!isLoginView);
                setError('');
            }}
            className="font-bold text-amber-600 hover:text-amber-500 ml-2"
          >
            {isLoginView ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
