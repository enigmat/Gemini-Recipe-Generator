import React, { useMemo, useState, useEffect } from 'react';
import { Recipe, AggregatedIngredient, ShoppingList } from '../types';
import * as shoppingListService from '../services/shoppingListService';
import * as recipeService from '../services/recipeService';
import PrintIcon from './icons/PrintIcon';
import ShareIcon from './icons/ShareIcon';
import TrashIcon from './icons/TrashIcon';
import InstacartIcon from './icons/InstacartIcon';
import XIcon from './icons/XIcon';
import Spinner from './Spinner';

interface ShoppingListModalProps {
  list: ShoppingList | null;
  onClose: () => void;
  measurementSystem: 'metric' | 'us';
}

const ShoppingListModal: React.FC<ShoppingListModalProps> = ({ list, onClose, measurementSystem }) => {
  const [shareText, setShareText] = useState('Share');
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // FIX: The `getRecipesByIds` function is synchronous and does not return a promise.
    // Removed the `.then()` chain and replaced with a direct call inside a try/catch.
    if (list && list.recipeIds.length > 0) {
        setIsLoading(true);
        try {
            const recipes = recipeService.getRecipesByIds(list.recipeIds);
            setSelectedRecipes(recipes);
        } catch (err) {
            console.error("Failed to fetch shopping list recipes", err);
        } finally {
            setIsLoading(false);
        }
    } else {
        setSelectedRecipes([]);
        setIsLoading(false);
    }
  }, [list]);

  const aggregatedIngredients = useMemo(() => {
    return shoppingListService.generateShoppingList(selectedRecipes, measurementSystem);
  }, [selectedRecipes, measurementSystem]);

  useEffect(() => {
    if (list) {
      const savedCheckedItems = localStorage.getItem(`shoppingListChecked_${list.id}`);
      if (savedCheckedItems) {
        setCheckedItems(JSON.parse(savedCheckedItems));
      }
    }
    return () => setCheckedItems([]);
  }, [list]);

  useEffect(() => {
    if (list) {
      localStorage.setItem(`shoppingListChecked_${list.id}`, JSON.stringify(checkedItems));
    }
  }, [checkedItems, list]);

  if (!list) return null;
  
  const handleToggleCheck = (ingredientName: string) => {
    setCheckedItems(prev =>
      prev.includes(ingredientName)
        ? prev.filter(item => item !== ingredientName)
        : [...prev, ingredientName]
    );
  };

  const handleClearChecked = () => {
    setCheckedItems([]);
  };

  const formatIngredient = (ing: AggregatedIngredient): string => {
    if (typeof ing.quantity === 'number') {
      const quantity = Number.isInteger(ing.quantity) ? ing.quantity : ing.quantity.toFixed(2);
      return `${quantity}${ing.unit ? ` ${ing.unit}` : ''} ${ing.name}`;
    }
    return `${ing.quantity}${ing.unit ? ` ${ing.unit}` : ''} ${ing.name}`;
  }

  const handleShare = async () => {
    const listText = `${list.name}\n\n${aggregatedIngredients.map(ing => `- ${formatIngredient(ing)}`).join('\n')}`;
    const shareData = {
      title: list.name,
      text: listText,
      url: window.location.href,
    };

    if (navigator.share) {
        await navigator.share(shareData).catch(err => console.error(err));
    } else {
        await navigator.clipboard.writeText(listText);
        setShareText('Copied!');
        setTimeout(() => setShareText('Share'), 2000);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(`
            <html><head><title>${list.name}</title>
            <style>body{font-family:sans-serif} ul{list-style:none;padding:0} li{margin-bottom:8px} h1{font-size:24px}</style>
            </head><body>
            <h1>${list.name}</h1>
            <p>From ${selectedRecipes.map(r => r.title).join(', ')}</p>
            <ul>${aggregatedIngredients.map(ing => `<li>[ ] ${formatIngredient(ing)}</li>`).join('')}</ul>
            </body></html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
  };
  
  const handleInstacartClick = () => {
    const baseUrl = 'https://www.instacart.com/shopping-list/add_items?';
    const itemsQuery = aggregatedIngredients
      .map(ing => `items[]=${encodeURIComponent(formatIngredient(ing))}`)
      .join('&');
    window.open(baseUrl + itemsQuery, '_blank');
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-11/12 md:max-w-lg max-h-[90vh] flex flex-col p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800" aria-label="Close modal">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{list.name}</h2>
        <div className="flex-grow overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Spinner />
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-4">
                Generated from {selectedRecipes.length} recipe{selectedRecipes.length > 1 && 's'}.
              </p>
              <ul className="space-y-3">
                {aggregatedIngredients.map((ing, i) => (
                  <li key={`${ing.name}-${i}`} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`ing-${i}`}
                      checked={checkedItems.includes(ing.name)}
                      onChange={() => handleToggleCheck(ing.name)}
                      className="h-5 w-5 rounded border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer"
                    />
                    <label
                      htmlFor={`ing-${i}`}
                      className={`ml-3 text-slate-700 cursor-pointer ${checkedItems.includes(ing.name) ? 'line-through text-slate-400' : ''}`}
                    >
                      {formatIngredient(ing)}
                    </label>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="mt-6 pt-4 border-t flex flex-wrap gap-2">
           <button 
                onClick={handleInstacartClick}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
                <InstacartIcon className="w-5 h-5" />
                <span>Add to Instacart</span>
            </button>
            <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
            >
                <PrintIcon className="w-5 h-5" />
                <span>Print</span>
            </button>
            <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
            >
                <ShareIcon className="w-5 h-5" />
                <span>{shareText}</span>
            </button>
             <button 
                onClick={handleClearChecked}
                className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium ml-auto"
            >
                <TrashIcon className="w-5 h-5" />
                <span>Clear Checked</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListModal;