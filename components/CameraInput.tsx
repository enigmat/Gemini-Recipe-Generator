import React from 'react';
import CameraIcon from './icons/CameraIcon';

interface CameraInputProps {
    onClick: () => void;
    disabled?: boolean;
}

const CameraInput: React.FC<CameraInputProps> = ({ onClick, disabled }) => {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-text-secondary mb-1">
                Scan with Camera
            </label>
            <button
                onClick={onClick}
                disabled={disabled}
                className="w-full h-full flex items-center justify-center gap-2 bg-white p-2 rounded-lg shadow-md border border-border-color text-text-secondary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Scan ingredients with camera"
            >
                <CameraIcon className="h-6 w-6" />
                <span>Scan Ingredients</span>
            </button>
        </div>
    );
};

export default CameraInput;