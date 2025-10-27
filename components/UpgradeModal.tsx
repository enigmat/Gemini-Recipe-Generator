import React from 'react';
import XIcon from './icons/XIcon';
import CrownIcon from './icons/CrownIcon';
import CheckIcon from './icons/CheckIcon';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null;
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-11/12 md:max-w-md p-8 relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-10 transition-colors" aria-label="Close modal">
          <XIcon className="w-6 h-6" />
        </button>
        
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-amber-100 mb-5">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-amber-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Go Premium!</h2>
            <p className="text-gray-600 mt-2">Unlock exclusive features and take your cooking to the next level.</p>
        </div>

        <ul className="space-y-3 my-8 text-left">
            <li className="flex items-start">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Access to <span className="font-semibold text-gray-800">new, exclusive recipes</span> added every month.</span>
            </li>
            <li className="flex items-start">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Watch <span className="font-semibold text-gray-800">Advanced Cooking Classes</span> taught by professional chefs.</span>
            </li>
             <li className="flex items-start">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><span className="font-semibold text-gray-800">Ad-free browsing experience</span> for uninterrupted cooking.</span>
            </li>
             <li className="flex items-start">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><span className="font-semibold text-gray-800">Early access</span> to new features and video tutorials.</span>
            </li>
        </ul>

        <div className="mt-6">
            <button
              onClick={onUpgrade}
              className="w-full px-4 py-4 bg-amber-400 border border-transparent rounded-lg shadow-sm text-base font-bold text-gray-900 hover:bg-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Upgrade Now
            </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
