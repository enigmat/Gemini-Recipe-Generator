import React, { useState, useEffect } from 'react';
import WifiSlashIcon from './icons/WifiSlashIcon';

const OfflineBanner: React.FC = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOffline = () => setIsOffline(true);
        const handleOnline = () => setIsOffline(false);

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    if (!isOffline) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-3 text-center text-sm z-50 flex items-center justify-center gap-2 animate-fade-in">
            <WifiSlashIcon className="w-5 h-5" />
            <span>You are currently offline. The app is running from cache.</span>
        </div>
    );
};

export default OfflineBanner;
