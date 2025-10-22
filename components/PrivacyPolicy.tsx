import React from 'react';
import XIcon from './icons/XIcon';

interface PrivacyPolicyProps {
    onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
            role="dialog" 
            aria-modal="true"
            aria-labelledby="privacy-policy-title"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border-color flex justify-between items-center">
                    <h2 id="privacy-policy-title" className="text-2xl font-bold text-text-primary">Privacy Policy</h2>
                    <button onClick={onClose} className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto text-text-secondary space-y-4">
                    <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

                    <h3 className="text-lg font-semibold text-text-primary pt-2">1. Introduction</h3>
                    <p>Welcome to Marshmellow Recipes ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.</p>

                    <h3 className="text-lg font-semibold text-text-primary pt-2">2. Information We Collect</h3>
                    <p>We may collect information about you in a variety of ways. The information we may collect via the Application includes:</p>
                    <ul className="list-disc list-inside pl-4 space-y-1">
                        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name and email address, that you voluntarily give to us when you register with the Application.</li>
                        <li><strong>Usage Data:</strong> Information our servers automatically collect when you access the Application, such as your IP address, browser type, and the pages you have viewed.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-text-primary pt-2">3. Use of Your Information</h3>
                    <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:</p>
                     <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Create and manage your account.</li>
                        <li>Email you regarding your account or order.</li>
                        <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Application.</li>
                        <li>Increase the efficiency and operation of the Application.</li>
                    </ul>
                    
                    <h3 className="text-lg font-semibold text-text-primary pt-2">4. Camera and Media Permissions</h3>
                    <p>Our application requests access to your device's camera to allow you to scan ingredients. This functionality is optional. Images captured are processed to identify ingredients and are not stored on our servers long-term. We do not use your camera or media for any other purpose without your explicit consent.</p>

                    <h3 className="text-lg font-semibold text-text-primary pt-2">5. Security of Your Information</h3>
                    <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
                    
                    <h3 className="text-lg font-semibold text-text-primary pt-2">6. Contact Us</h3>
                    <p>If you have questions or comments about this Privacy Policy, please contact us at: contact@marshmellowrecipes.com</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
