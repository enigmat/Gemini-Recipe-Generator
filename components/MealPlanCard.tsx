import React from 'react';
import { MealPlan, Recipe } from '../types';
import CalendarDaysIcon from './icons/CalendarDaysIcon';

interface MealPlanCardProps {
  plan: MealPlan;
  allRecipes: Recipe[];
  onViewPlan: (plan: MealPlan) => void;
}

const MealPlanCard: React.FC<MealPlanCardProps> = ({ plan, allRecipes, onViewPlan }) => {
  const planRecipes = plan.recipeIds.map(id => allRecipes.find(r => r.id === id)).filter(Boolean) as Recipe[];
  const previewImages = planRecipes.slice(0, 4).map(r => r.image);

  return (
    <div 
        className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300 flex flex-col cursor-pointer"
        onClick={() => onViewPlan(plan)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onViewPlan(plan) }}
        aria-label={`View ${plan.title} meal plan`}
    >
      <div className="grid grid-cols-2 gap-0.5">
        {previewImages.map((img, index) => (
          <div key={index} className="h-24 bg-gray-200">
             <img src={img} alt={`${plan.title} recipe preview ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
        {previewImages.length < 4 && Array(4 - previewImages.length).fill(0).map((_, i) => (
             <div key={`placeholder-${i}`} className="h-24 bg-gray-100 flex items-center justify-center">
                <CalendarDaysIcon className="w-8 h-8 text-gray-300"/>
             </div>
        ))}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.title}</h3>
        <p className="text-sm text-gray-600 mb-4 flex-grow">{plan.description}</p>
        <div className="mt-auto pt-2 border-t text-center">
            <span className="text-gray-800 font-semibold">
                View Plan
            </span>
        </div>
      </div>
    </div>
  );
};

export default MealPlanCard;
