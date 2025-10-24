import React from 'react';

interface FooterProps {
    onShowPrivacyPolicy: () => void;
    onShowAboutUs: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowPrivacyPolicy, onShowAboutUs }) => {
    return (
        <footer className="bg-gray-100 border-t border-border-color mt-16">
            <div className="container mx-auto px-4 py-6 text-center text-text-secondary text-sm">
                <p>&copy; {new Date().getFullYear()} recipe extracted. All Rights Reserved.</p>
                <div className="mt-2 space-x-4">
                    <button onClick={onShowAboutUs} className="hover:text-primary hover:underline">
                        About Us
                    </button>
                    <span className="text-gray-400">|</span>
                    <button onClick={onShowPrivacyPolicy} className="hover:text-primary hover:underline">
                        Privacy Policy
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;