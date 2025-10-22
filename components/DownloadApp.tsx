import React from 'react';
import QrCodeIcon from './icons/QrCodeIcon';
import AppleIcon from './icons/AppleIcon';
import GooglePlayIcon from './icons/GooglePlayIcon';

const DownloadApp: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 my-12 border border-border-color max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-text-primary">Get Recipes on the Go</h2>
                    <p className="mt-2 text-lg text-text-secondary">
                        Download the Marshmellow Recipes app for the best mobile experience.
                        Save your favorite recipes, create shopping lists, and more!
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                        <a href="#" className="flex items-center gap-2 bg-white text-text-primary border border-border-color px-5 py-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                            <AppleIcon className="w-6 h-6" />
                            <div>
                                <p className="text-xs text-text-secondary">Download on the</p>
                                <p className="text-lg font-semibold -mt-1">App Store</p>
                            </div>
                        </a>
                        <a href="#" className="flex items-center gap-3 bg-white text-text-primary border border-border-color px-5 py-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                            <GooglePlayIcon className="w-5 h-5" />
                            <div>
                                <p className="text-xs text-text-secondary">GET IT ON</p>
                                <p className="text-lg font-semibold -mt-1">Google Play</p>
                            </div>
                        </a>
                    </div>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="bg-white p-3 rounded-lg border border-border-color shadow-sm">
                        <QrCodeIcon className="w-32 h-32 text-text-primary" />
                    </div>
                    <p className="mt-2 text-sm text-text-secondary font-medium">Scan to Download</p>
                </div>
            </div>
        </div>
    );
};

export default DownloadApp;