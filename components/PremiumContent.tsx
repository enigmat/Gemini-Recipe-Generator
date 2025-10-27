import React from 'react';
import LockClosedIcon from './icons/LockClosedIcon';
import CrownIcon from './icons/CrownIcon';
import CheckIcon from './icons/CheckIcon';

interface PremiumContentProps {
  isPremium: boolean;
  onUpgradeClick: () => void;
  children: React.ReactNode;
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
    <div className="relative p-8 bg-gray-50 rounded-lg text-center border-2 border-dashed border-gray-300">
      <div className="flex flex-col items-center">
        <LockClosedIcon className="w-12 h-12 text-gray-400" />
        <h3 className="mt-4 text-xl font-semibold text-gray-800">{featureTitle}</h3>
        {featureDescription && (
            <p className="mt-2 text-gray-600 max-w-sm">
                {featureDescription}
            </p>
        )}
        
        {featureNodes}

        {features && features.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 max-w-3xl my-6 text-gray-700 text-left">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                        <CheckIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                        <span>{feature}</span>
                    </div>
                ))}
            </div>
        )}

        <button
          onClick={onUpgradeClick}
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold rounded-lg shadow-md hover:bg-amber-600 transition-colors"
        >
          <CrownIcon className="w-5 h-5" />
          Upgrade to Premium
        </button>
      </div>
    </div>
  );
};

export default PremiumContent;