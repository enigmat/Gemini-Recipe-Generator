
import React from 'react';
import WifiSlashIcon from './icons/WifiSlashIcon';

interface OfflineBannerProps {
    forceActive?: boolean;
    message?: string;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ forceActive, message }) => {
    // In Local Mode, we are technically "offline" from a DB perspective, but we don't need to show
    // the scary red/amber banner unless specifically requested or if the browser itself is offline.
    
    if (forceActive) {
        return (
            <div className="fixed bottom-0 left-0 right-0 p-2 text-center text-xs font-medium z-50 flex items-center justify-center gap-2 animate-fade-in bg-slate-800 text-slate-300 opacity-90 hover:opacity-100 transition-opacity">
                <WifiSlashIcon className="w-4 h-4" />
                <span>{message || "Local Standalone Mode (Data is not saved permanently)"}</span>
            </div>
        );
    }

    return null;
};

export default OfflineBanner;
