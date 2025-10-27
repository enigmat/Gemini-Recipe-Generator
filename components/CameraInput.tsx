import React from 'react';
import CameraIcon from './icons/CameraIcon';

const CameraInput: React.FC = () => {
    const handleScan = () => {
        // Placeholder for camera functionality
        alert('Camera scanning not implemented yet.');
    };

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">Scan with Camera</h3>
            <button
                onClick={handleScan}
                className="w-full flex-grow flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors font-semibold text-gray-700 text-sm"
            >
                <CameraIcon className="w-5 h-5" />
                <span>Scan Ingredients</span>
            </button>
             <div className="h-4" /> {/* Spacer to align with UrlInput error message */}
        </div>
    );
};

export default CameraInput;