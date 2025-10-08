import React from 'react';
import { CookingClass } from '../types';
import MortarPestleIcon from './icons/MortarPestleIcon';

interface CookingClassCardProps {
    cookingClass: CookingClass;
    onClick: () => void;
}

const CookingClassCard: React.FC<CookingClassCardProps> = ({ cookingClass, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group block bg-white rounded-xl overflow-hidden cursor-pointer shadow-md border border-border-color hover:shadow-xl hover:border-primary/50 transition-all duration-300"
            aria-label={`View class: ${cookingClass.title}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
        >
            <div className="h-56 w-full overflow-hidden">
                <img
                    alt={cookingClass.title}
                    src={cookingClass.imageUrl}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                />
            </div>
            <div className="p-4 sm:p-6">
                 <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
                    By {cookingClass.chef}
                </p>
                <h3 className="text-xl font-bold text-text-primary leading-tight group-hover:text-primary transition-colors">
                    {cookingClass.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary line-clamp-3">
                    {cookingClass.description}
                </p>
            </div>
        </div>
    );
};

export default CookingClassCard;