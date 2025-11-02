import React, { useState, useEffect } from 'react';
import * as aboutUsService from '../services/aboutUsService';
import { AboutUsContent } from '../types';
import ChefHatIcon from './icons/ChefHatIcon';
import Spinner from './Spinner';

const AboutUsPage: React.FC = () => {
  const [content, setContent] = useState<AboutUsContent | null>(null);

  useEffect(() => {
    setContent(aboutUsService.getAboutUsContent());
  }, []);


  if (!content) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner size="w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 animate-fade-in space-y-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8 md:p-12 text-center bg-amber-50/50 border-b">
          <ChefHatIcon className="w-16 h-16 text-amber-500 mx-auto" />
          <h2 className="text-4xl font-bold text-gray-800 mt-4">{content.companyName}</h2>
        </div>
        
        <div className="px-6 md:px-12 py-10 space-y-8 text-gray-700">
            <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-800">Our Mission</h3>
                <p className="mt-3 text-lg italic max-w-2xl mx-auto">"{content.missionStatement}"</p>
            </div>
            
            <div className="border-t pt-8">
                <h3 className="text-2xl font-semibold text-gray-800">Our Story</h3>
                <p className="mt-3 leading-relaxed whitespace-pre-wrap">{content.companyHistory}</p>
            </div>
            
            <div className="border-t pt-8 text-center">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h3>
                <div className="text-gray-600">
                    <p><strong>Email:</strong> <a href={`mailto:${content.contactEmail}`} className="text-teal-600 hover:underline">{content.contactEmail}</a></p>
                    <p className="mt-1"><strong>Address:</strong> {content.address}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;