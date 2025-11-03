import React, { useState } from 'react';
import { SavedCocktail, User } from '../types';
import CocktailCard from './CocktailCard';
import SavedCocktailCard from './SavedCocktailCard';
import EmptyState from './EmptyState';
import CocktailIcon from './icons/CocktailIcon';
import SavedCocktailModal from './SavedCocktailModal';
import SparklesIcon from './icons/SparklesIcon';

interface CocktailBookProps {
  standardCocktails: SavedCocktail[];
  savedCocktails: SavedCocktail[];
  currentUser: User | null;
  onSaveStandard: (cocktail: SavedCocktail) => void;
  onDelete: (cocktailId: string) => void;
  onLoginRequest: () => void;
  onUpgradeRequest: () => void;
  onGoToBartender: () => void;
}

const CocktailBook: React.FC<CocktailBookProps> = ({ 
  standardCocktails, 
  savedCocktails, 
  currentUser,
  onSaveStandard,
  onDelete,
  onLoginRequest,
  onUpgradeRequest,
  onGoToBartender
}) => {
  const [showMyBarOnly, setShowMyBarOnly] = useState(false);
  const [viewingCocktail, setViewingCocktail] = useState<SavedCocktail | null>(null);

  const savedCocktailTitles = new Set(savedCocktails.map(c => c.title.toLowerCase()));

  const handleSave = (cocktail: SavedCocktail) => {
    if (!currentUser) {
        onLoginRequest();
        return;
    }
    if (!currentUser.isPremium) {
        onUpgradeRequest();
        return;
    }
    onSaveStandard(cocktail);
  }

  return (
    <>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold text-slate-800">Cocktail Book</h2>
            <div className="flex items-center gap-2 p-1 bg-slate-200 rounded-full">
                <button 
                    onClick={() => setShowMyBarOnly(false)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${!showMyBarOnly ? 'bg-white shadow' : 'text-slate-600'}`}
                >
                    Standard Menu
                </button>
                <button 
                    onClick={() => setShowMyBarOnly(true)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${showMyBarOnly ? 'bg-white shadow' : 'text-slate-600'}`}
                >
                    My Bar
                </button>
            </div>
        </div>

        {showMyBarOnly ? (
            savedCocktails.length > 0 ? (
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
            ) : (
                <EmptyState 
                    icon={<CocktailIcon />}
                    title="Your Bar is Empty"
                    message="Use the Bartender Helper or save drinks from the standard menu to build your collection."
                    actionText="Create a Custom Cocktail"
                    onActionClick={onGoToBartender}
                />
            )
        ) : (
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
                    <p className="text-sm text-teal-700 mt-1">Let our AI bartender invent a new drink just for you.</p>
                </div>
                {standardCocktails.map(cocktail => (
                    <CocktailCard
                        key={cocktail.id}
                        cocktail={cocktail}
                        isSaved={savedCocktailTitles.has(cocktail.title.toLowerCase())}
                        onView={setViewingCocktail}
                        onSave={() => handleSave(cocktail)}
                    />
                ))}
            </div>
        )}

      <SavedCocktailModal cocktail={viewingCocktail} onClose={() => setViewingCocktail(null)} />
    </>
  );
};

export default CocktailBook;
