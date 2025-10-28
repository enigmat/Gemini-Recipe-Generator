import React, { useState } from 'react';
import { SavedCocktail } from '../types';
import SavedCocktailCard from './SavedCocktailCard';
import SavedCocktailModal from './SavedCocktailModal';
import EmptyState from './EmptyState';
import CocktailIcon from './icons/CocktailIcon';

interface MyBarProps {
  savedCocktails: SavedCocktail[];
  onDelete: (cocktailId: string) => void;
  onGoToBartender: () => void;
}

const MyBar: React.FC<MyBarProps> = ({ savedCocktails, onDelete, onGoToBartender }) => {
  const [viewingCocktail, setViewingCocktail] = useState<SavedCocktail | null>(null);

  if (savedCocktails.length === 0) {
    return (
      <EmptyState 
        icon={<CocktailIcon />}
        title="Your Bar is Empty"
        message="Use the Bartender Helper to create and save your favorite cocktail recipes."
        actionText="Create a Cocktail"
        onActionClick={onGoToBartender}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {savedCocktails.map(cocktail => (
          <SavedCocktailCard
            key={cocktail.id}
            cocktail={cocktail}
            onView={setViewingCocktail}
            onDelete={onDelete}
          />
        ))}
      </div>
      <SavedCocktailModal cocktail={viewingCocktail} onClose={() => setViewingCocktail(null)} />
    </>
  );
};

export default MyBar;