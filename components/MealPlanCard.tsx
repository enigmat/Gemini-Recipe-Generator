import React from 'react';
import { MealPlan } from '../types';

interface MealPlanCardProps {
    plan: MealPlan;
    onClick: () => void;
}

const MealPlanCard: React.FC<MealPlanCardProps> = ({ plan, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group relative block bg-white rounded-xl overflow-hidden cursor-pointer shadow-md border border-border-color hover:shadow-xl hover:border-primary/50 transition-all duration-300"
            aria-label={`View meal plan for ${plan.title}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
        >
            <div className="h-48 w-full overflow-hidden">
                <img
                    alt={plan.title}
                    src={plan.imageUrl}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
            </div>
            <div className="p-4 sm:p-6">
                <h3 className="text-xl font-bold text-text-primary leading-tight group-hover:text-primary transition-colors">
                    {plan.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary line-clamp-3">
                    {plan.description}
                </p>
            </div>
        </div>
    );
};

export default MealPlanCard;