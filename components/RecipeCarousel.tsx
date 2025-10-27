import React, { useRef, useState, useEffect } from 'react';
import { Recipe } from '../types';
import RecipeCard from './RecipeCard';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface RecipeCarouselProps {
  title: string;
  recipes: Recipe[];
  favorites: number[];
  selectedRecipeIds: number[];
  onCardClick: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: number) => void;
  onToggleSelect: (recipeId: number) => void;
}

const RecipeCarousel: React.FC<RecipeCarouselProps> = ({ title, recipes, favorites, selectedRecipeIds, onCardClick, onToggleFavorite, onToggleSelect }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    const el = scrollContainerRef.current;
    if (el) {
      // Add a small tolerance to handle floating point inaccuracies
      const isAtEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(!isAtEnd && el.scrollWidth > el.clientWidth);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollability);
      // Use a timeout to ensure the layout has been painted before the initial check
      const timer = setTimeout(checkScrollability, 100); 
      
      const resizeObserver = new ResizeObserver(checkScrollability);
      resizeObserver.observe(el);

      return () => {
        clearTimeout(timer);
        el.removeEventListener('scroll', checkScrollability);
        resizeObserver.unobserve(el);
      };
    }
  }, [recipes]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current: el } = scrollContainerRef;
      const scrollAmount = el.clientWidth * 0.8; // scroll by 80% of the visible width
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (recipes.length === 0) return null;

  return (
    <div>
      <div className={`flex items-center mb-4 ${title ? 'justify-between' : 'justify-end'}`}>
        {title && <h2 className="text-2xl font-bold text-gray-800">{title}</h2>}
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-6 pb-4 -mb-4 scrollbar-hide"
      >
        {recipes.map(recipe => (
          <div key={recipe.id} className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]">
            <RecipeCard
              recipe={recipe}
              onClick={onCardClick}
              isFavorite={favorites.includes(recipe.id)}
              onToggleFavorite={onToggleFavorite}
              isSelected={selectedRecipeIds.includes(recipe.id)}
              onToggleSelect={onToggleSelect}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeCarousel;