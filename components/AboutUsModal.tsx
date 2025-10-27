import React from 'react';
import { AboutUsContent } from '../types';
import XIcon from './icons/XIcon';
import ChefHatIcon from './icons/ChefHatIcon';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: AboutUsContent | null;
}

const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen || !content) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-11/12 md:max-w-2xl max-h-[90vh] flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors z-10" aria-label="Close modal">
          <XIcon className="h-6 w-6" />
        </button>

        <div className="p-6 md:p-8 text-center border-b">
            <ChefHatIcon className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-3xl font-bold text-gray-800 mt-4">{content.companyName}</h2>
        </div>

        <div className="flex-grow overflow-y-auto px-6 md:px-8 py-8 space-y-6 text-gray-600">
            <div>
                <h3 className="font-semibold text-lg text-gray-700 text-center">Our Mission</h3>
                <p className="mt-2 text-center italic">"{content.missionStatement}"</p>
            </div>
            <div className="border-t pt-6">
                <h3 className="font-semibold text-lg text-gray-700">Our Story</h3>
                <p className="mt-2">{content.companyHistory}</p>
            </div>
             <div className="border-t pt-6 text-center text-sm">
                <h3 className="font-semibold text-lg text-gray-700 mb-2">Contact Us</h3>
                <p><strong>Email:</strong> <a href={`mailto:${content.contactEmail}`} className="text-teal-600 hover:underline">{content.contactEmail}</a></p>
                <p><strong>Address:</strong> {content.address}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsModal;
