import React, { useState } from 'react';
import { SavedCocktail, User } from '../types';
import CocktailCard from './CocktailCard';
import EmptyState from './EmptyState';
import BookOpenIcon from './icons/BookOpenIcon';
import SavedCocktailModal from './SavedCocktailModal';
import SparklesIcon from './icons/SparklesIcon';

interface CocktailMenuProps {
  standardCocktails: SavedCocktail[];
  savedCocktails: SavedCocktail[];
  currentUser: User | null;
  onSave: (cocktail: SavedCocktail) => void;
  onLoginRequest: () => void;
  onUpgradeRequest: () => void;
  onGoToBartender: () => void;
}

const CocktailMenu: React.FC<CocktailMenuProps> = ({ standardCocktails, savedCocktails, currentUser, onSave, onLoginRequest, onUpgradeRequest, onGoToBartender }) => {
  const [viewingCocktail, setViewingCocktail] = useState<SavedCocktail | null>(null);
  
  if (standardCocktails.length === 0) {
    return <EmptyState icon={<BookOpenIcon />} title="Cocktail Menu is Empty" message="Our mixologists are curating a list of drinks. Check back soon!" />;
  }
  
  const savedCocktailTitles = new Set(savedCocktails.map(c => c.title.toLowerCase()));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          className="bg-teal-50 border-2 border-dashed border-teal-300 rounded-lg cursor-pointer transform hover:scale-105 transition-all duration-300 group flex flex-col items-center justify-center p-6 text-center h-full min-h-[280px]"
          onClick={onGoToBartender}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onGoToBartender() }}
          aria-label="Create a custom cocktail"
        >
          <SparklesIcon className="w-12 h-12 text-teal-500 group-hover:text-teal-600 transition-colors" />
          <h3 className="text-lg font-semibold text-teal-800 mt-4">Create Your Own</h3>
          <p className="text-sm text-teal-700 mt-1">Don't see what you like? Let our AI bartender invent a new drink for you.</p>
        </div>

        {standardCocktails.map(cocktail => (
          <CocktailCard
            key={cocktail.id}
            cocktail={cocktail}
            isSaved={savedCocktailTitles.has(cocktail.title.toLowerCase())}
            onView={setViewingCocktail}
            onSave={() => {
              if (!currentUser) {
                onLoginRequest();
                return;
              }
              if (!currentUser.isPremium) {
                onUpgradeRequest();
                return;
              }
              onSave(cocktail);
            }}
          />
        ))}
      </div>
      <SavedCocktailModal cocktail={viewingCocktail} onClose={() => setViewingCocktail(null)} />
    </>
  );
};

export default CocktailMenu;