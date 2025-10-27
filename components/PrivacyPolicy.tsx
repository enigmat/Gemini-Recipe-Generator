import React from 'react';
import XIcon from './icons/XIcon';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-11/12 md:max-w-3xl max-h-[90vh] flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors z-10" aria-label="Close modal">
          <XIcon className="h-6 w-6" />
        </button>
        
        <div className="p-6 md:p-8 border-b">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Privacy Policy</h2>
        </div>

        <div className="flex-grow overflow-y-auto px-6 md:px-8 py-8 space-y-4 text-gray-600 text-sm">
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
            
            <h3 className="text-lg font-semibold text-gray-700 pt-4">1. Introduction</h3>
            <p>Welcome to Recipe Extracter ("we", "our", "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.</p>

            <h3 className="text-lg font-semibold text-gray-700 pt-4">2. Information We Collect</h3>
            <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name and email address, that you voluntarily give to us when you register with the application.</li>
                <li><strong>Local Storage Data:</strong> We store data like your favorite recipes, user preferences, and shopping lists directly in your browser's local storage. This data is not sent to our servers and is private to your device.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 pt-4">3. Use of Your Information</h3>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
             <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Create and manage your account locally on your device.</li>
                <li>Personalize your experience (e.g., save favorites, manage shopping lists).</li>
                <li>Send you newsletters, only if you have explicitly subscribed.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 pt-4">4. Disclosure of Your Information</h3>
            <p>We do not share, sell, rent or trade your personal information with third parties for their commercial purposes. All data is stored locally in your browser.</p>

            <h3 className="text-lg font-semibold text-gray-700 pt-4">5. Security of Your Information</h3>
            <p>Your data is as secure as your browser's local storage. We do not transmit or store your personal data on external servers, which minimizes risks associated with data breaches on our end.</p>
            
            <h3 className="text-lg font-semibold text-gray-700 pt-4">6. Contact Us</h3>
            <p>If you have questions or comments about this Privacy Policy, please contact us at: privacy@recipeextracter.com</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
