
import React, { useState } from 'react';
import StarIcon from './icons/StarIcon';

interface RatingProps {
    averageRating: number;
    ratingCount: number;
    onRate?: (rating: number) => void;
    size?: 'sm' | 'md' | 'lg';
}

const Rating: React.FC<RatingProps> = ({ averageRating, ratingCount, onRate, size = 'md' }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    const isInteractive = !!onRate;

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => {
                    const ratingValue = hoverRating > 0 ? hoverRating : averageRating;
                    const isFilled = star <= ratingValue;

                    return (
                        <button
                            key={star}
                            disabled={!isInteractive}
                            onClick={() => isInteractive && onRate(star)}
                            onMouseEnter={() => isInteractive && setHoverRating(star)}
                            onMouseLeave={() => isInteractive && setHoverRating(0)}
                            className={`text-yellow-400 ${isInteractive ? 'cursor-pointer' : ''} ${sizeClasses[size]}`}
                            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                            <StarIcon isFilled={isFilled} />
                        </button>
                    );
                })}
            </div>
            {ratingCount > 0 && (
                 <p className={`text-xs text-text-secondary`}>
                    {averageRating.toFixed(1)} ({ratingCount})
                </p>
            )}
            {isInteractive && ratingCount === 0 && (
                 <p className="text-xs text-text-secondary">
                    Be the first to rate!
                </p>
            )}
        </div>
    );
};

export default Rating;
