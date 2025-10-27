import React from 'react';
import { CookingClass } from '../types';

interface CookingClassCardProps {
  cookingClass: CookingClass;
  onClick: (cookingClass: CookingClass) => void;
}

const CookingClassCard: React.FC<CookingClassCardProps> = ({ cookingClass, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 border border-gray-100"
      onClick={() => onClick(cookingClass)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(cookingClass) }}
      aria-label={`View class: ${cookingClass.title}`}
    >
      <img src={cookingClass.thumbnailUrl} alt={cookingClass.title} className="w-full h-48 object-cover" />
      <div className="p-5">
        <p className="text-teal-600 font-semibold text-xs uppercase tracking-wider">By Chef {cookingClass.chef}</p>
        <h3 className="text-xl font-bold text-gray-900 mt-1">{cookingClass.title}</h3>
        <p className="text-gray-600 mt-2 text-sm">{cookingClass.description}</p>
      </div>
    </div>
  );
};

export default CookingClassCard;