import React, { useState, useEffect } from 'react';
import XIcon from './icons/XIcon';
import { AboutUsInfo } from '../types';
import * as aboutUsService from '../services/aboutUsService';

interface AboutUsModalProps {
    onClose: () => void;
}

const AboutUsModal: React.FC<AboutUsModalProps> = ({ onClose }) => {
    const [info, setInfo] = useState<AboutUsInfo | null>(null);

    useEffect(() => {
        setInfo(aboutUsService.getAboutUsInfo());
    }, []);

    if (!info) {
        return null; // Or a loading spinner
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-us-title"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border-color flex justify-between items-center">
                    <h2 id="about-us-title" className="text-2xl font-bold text-text-primary">{info.companyName}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto text-text-secondary space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary">Our Mission</h3>
                        <p className="italic">"{info.missionStatement}"</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-text-primary">Our Story</h3>
                        <p>{info.history}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border-color">
                        <h3 className="text-lg font-semibold text-text-primary">Contact Us</h3>
                        <p><strong>Email:</strong> <a href={`mailto:${info.contactEmail}`} className="text-primary hover:underline">{info.contactEmail}</a></p>
                        <p><strong>Address:</strong> {info.address}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsModal;
