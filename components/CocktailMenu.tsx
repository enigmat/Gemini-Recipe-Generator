import React from 'react';
import { SavedCocktail, User } from '../types';
import CocktailCard from './CocktailCard';
import EmptyState from './EmptyState';
import BookOpenIcon from './icons/BookOpenIcon';

interface CocktailMenuProps {
  standardCocktails: SavedCocktail[];
  savedCocktails: SavedCocktail[];
  currentUser: User | null;
  onSave: (cocktail: SavedCocktail) => void;
  onLoginRequest: () => void;
  onUpgradeRequest: () => void;
}

const CocktailMenu: React.FC<CocktailMenuProps> = ({ standardCocktails, savedCocktails, currentUser, onSave, onLoginRequest, onUpgradeRequest }) => {
  if (standardCocktails.length === 0) {
    return <EmptyState icon={<BookOpenIcon />} title="Cocktail Menu is Empty" message="Our mixologists are curating a list of drinks. Check back soon!" />;
  }
  
  const savedCocktailTitles = new Set(savedCocktails.map(c => c.title.toLowerCase()));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {standardCocktails.map(cocktail => (
        <CocktailCard
          key={cocktail.id}
          cocktail={cocktail}
          isSaved={savedCocktailTitles.has(cocktail.title.toLowerCase())}
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
  );
};

export default CocktailMenu;
