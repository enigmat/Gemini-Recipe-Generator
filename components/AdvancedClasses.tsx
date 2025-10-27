import React from 'react';
import LockClosedIcon from './icons/LockClosedIcon';
import CrownIcon from './icons/CrownIcon';
import GraduationCapIcon from './icons/GraduationCapIcon';
import FireIcon from './icons/FireIcon';
import SparklesIcon from './icons/SparklesIcon';

interface AdvancedClassesProps {
    onUpgradeClick: () => void;
}

const AdvancedClasses: React.FC<AdvancedClassesProps> = ({ onUpgradeClick }) => {
    return (
        <div className="relative p-8 bg-amber-50/70 rounded-lg text-center border border-amber-200 shadow-sm">
            <div className="flex flex-col items-center max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-md">
                        <LockClosedIcon className="w-8 h-8" />
                    </div>
                    <div className="w-20 h-20 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg">
                        <CrownIcon className="w-10 h-10" />
                    </div>
                    <div className="w-16 h-16 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-md">
                        <GraduationCapIcon className="w-8 h-8" />
                    </div>
                </div>

                <h3 className="text-3xl font-bold text-gray-800">Premium Cooking Classes</h3>
                <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                    Learn from world-class chefs with step-by-step video tutorials and master advanced culinary techniques.
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-8 w-full text-left">
                    <div className="bg-white/60 p-6 rounded-xl shadow-sm border border-white">
                        <div className="flex items-center gap-2 mb-3">
                            <FireIcon className="w-5 h-5 text-orange-500" />
                            <h4 className="font-bold text-gray-800">Master Chef Techniques</h4>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                            <li>French knife skills from Michelin chefs</li>
                            <li>Authentic pasta making from Italy</li>
                            <li>Professional sourdough mastery</li>
                        </ul>
                    </div>
                    <div className="bg-white/60 p-6 rounded-xl shadow-sm border border-white">
                        <div className="flex items-center gap-2 mb-3">
                            <SparklesIcon className="w-5 h-5 text-yellow-500" />
                            <h4 className="font-bold text-gray-800">Exclusive Benefits</h4>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                            <li>Step-by-step video tutorials</li>
                            <li>Professional chef instruction</li>
                            <li>Advanced technique mastery</li>
                        </ul>
                    </div>
                </div>

                <button
                    onClick={onUpgradeClick}
                    className="mt-4 flex items-center gap-2 px-8 py-3 bg-gradient-to-b from-amber-400 to-amber-500 text-gray-900 font-bold rounded-lg shadow-md hover:from-amber-500 hover:to-amber-600 transition-all transform hover:scale-105"
                >
                    <LockClosedIcon className="w-5 h-5" />
                    Unlock Premium Classes
                </button>
            </div>
        </div>
    );
};

export default AdvancedClasses;
