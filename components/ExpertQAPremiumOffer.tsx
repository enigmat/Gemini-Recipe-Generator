import React from 'react';
import LockClosedIcon from './icons/LockClosedIcon';
import CrownIcon from './icons/CrownIcon';
import ChatBubbleIcon from './icons/ChatBubbleIcon';
import SearchIcon from './icons/SearchIcon';
import SparklesIcon from './icons/SparklesIcon';

interface ExpertQAPremiumOfferProps {
    onUpgradeClick: () => void;
}

const ExpertQAPremiumOffer: React.FC<ExpertQAPremiumOfferProps> = ({ onUpgradeClick }) => {
    return (
        <div className="relative p-8 bg-blue-50/70 rounded-lg text-center border border-blue-200 shadow-sm">
            <div className="flex flex-col items-center max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md">
                        <LockClosedIcon className="w-8 h-8" />
                    </div>
                    <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg">
                        <CrownIcon className="w-10 h-10" />
                    </div>
                    <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md">
                        <ChatBubbleIcon className="w-8 h-8" />
                    </div>
                </div>

                <h3 className="text-3xl font-bold text-gray-800">Expert Q&A</h3>
                <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                    Get personalized answers to your cooking questions from professional chefs and culinary experts.
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-8 w-full text-left">
                    <div className="bg-white/60 p-6 rounded-xl shadow-sm border border-white">
                        <div className="flex items-center gap-2 mb-3">
                            <SearchIcon className="w-5 h-5 text-gray-500" />
                            <h4 className="font-bold text-gray-800">Ask the Experts</h4>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                            <li>Professional chef guidance</li>
                            <li>Cooking technique help</li>
                            <li>Recipe troubleshooting</li>
                        </ul>
                    </div>
                    <div className="bg-white/60 p-6 rounded-xl shadow-sm border border-white">
                        <div className="flex items-center gap-2 mb-3">
                            <SparklesIcon className="w-5 h-5 text-yellow-500" />
                            <h4 className="font-bold text-gray-800">Premium Benefits</h4>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                            <li>Personalized responses</li>
                            <li>Expert chef answers</li>
                            <li>Quick response times</li>
                        </ul>
                    </div>
                </div>

                <button
                    onClick={onUpgradeClick}
                    className="mt-4 flex items-center gap-2 px-8 py-3 bg-gradient-to-b from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
                >
                    <CrownIcon className="w-5 h-5" />
                    Unlock Expert Q&A
                </button>
            </div>
        </div>
    );
};

export default ExpertQAPremiumOffer;
