import React from 'react';
import LockClosedIcon from './icons/LockClosedIcon';
import CrownIcon from './icons/CrownIcon';
import SparklesIcon from './icons/SparklesIcon';

interface PremiumContentProps {
  isPremium: boolean;
  onUpgradeClick: () => void;
  // FIX: Make the 'children' prop optional to support cases where this component is used solely as a paywall display.
  children?: React.ReactNode;
  featureTitle?: string;
  featureDescription?: string;
  features?: string[];
  featureNodes?: React.ReactNode;
}

const PremiumContent: React.FC<PremiumContentProps> = ({ 
    isPremium, 
    onUpgradeClick, 
    children,
    featureTitle = "This is a Premium Feature",
    featureDescription,
    features,
    featureNodes
}) => {
  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="relative p-8 bg-amber-50/70 rounded-lg text-center border border-amber-200 shadow-sm">
      <div className="flex flex-col items-center max-w-2xl mx-auto">
        <div className="relative inline-block mb-4">
            <CrownIcon className="w-12 h-12 text-amber-400" />
            <LockClosedIcon className="absolute w-4 h-4 text-amber-600 bottom-1 left-1/2 -translate-x-1/2" />
        </div>

        <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-amber-500" />
            <h3 className="text-xl font-bold text-slate-800">{featureTitle}</h3>
        </div>

        {featureDescription && (
            <p className="mt-2 text-slate-600 max-w-lg">
                {featureDescription}
            </p>
        )}
        
        {featureNodes}

        {features && features.length > 0 && (
            <div className="my-6 text-slate-700 text-left inline-block">
                <p className="font-semibold mb-2 text-center">Premium Features Include:</p>
                <ul className="list-disc list-inside space-y-1">
                    {features.map((feature, index) => (
                        <li key={index}>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        <button
          onClick={onUpgradeClick}
          className="mt-4 flex items-center gap-2 px-8 py-3 bg-gradient-to-b from-amber-400 to-amber-500 text-slate-900 font-bold rounded-lg shadow-md hover:from-amber-500 hover:to-amber-600 transition-all transform hover:scale-105"
        >
          <CrownIcon className="w-5 h-5" />
          Upgrade to Premium
        </button>
      </div>
    </div>
  );
};

export default PremiumContent;
