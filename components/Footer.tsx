import React from 'react';

interface FooterProps {
  onAboutClick: () => void;
  onPrivacyClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAboutClick, onPrivacyClick }) => {
  return (
    <footer className="w-full mt-16 py-8 bg-gray-100 print:hidden">
      <div className="container mx-auto text-center text-gray-500 text-sm">
        <p>© 2025 Recipe Extracter. All Rights Reserved.</p>
        <div className="mt-2">
          <button onClick={onAboutClick} className="hover:text-gray-800 transition-colors">About Us</button>
          <span className="mx-2">|</span>
          <button onClick={onPrivacyClick} className="hover:text-gray-800 transition-colors">Privacy Policy</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;