
import React, { useState } from 'react';
import { ShoppingList } from '../types';
import TrashIcon from './icons/TrashIcon';
import PencilIcon from './icons/PencilIcon';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';

interface ShoppingCartProps {
  lists: ShoppingList[];
  onViewList: (list: ShoppingList) => void;
  onDeleteList: (listId: string) => void;
  onRenameList: (listId: string, newName: string) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ lists, onViewList, onDeleteList, onRenameList }) => {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleStartRename = (list: ShoppingList) => {
    setRenamingId(list.id);
    setEditingName(list.name);
  };

  const handleCancelRename = () => {
    setRenamingId(null);
    setEditingName('');
  };

  const handleSaveRename = () => {
    if (renamingId && editingName.trim()) {
      onRenameList(renamingId, editingName.trim());
    }
    handleCancelRename();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveRename();
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  };

  if (!lists || lists.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm">
        <div className="mx-auto w-16 h-16 text-gray-400">
          <ShoppingCartIcon />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-gray-800">Your Shopping Lists</h3>
        <p className="mt-2 text-gray-500">
          You don't have any saved shopping lists yet. Select some recipes and save them to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <ShoppingCartIcon className="w-8 h-8 text-teal-500" />
        My Shopping Lists
      </h2>
      <ul className="space-y-4">
        {lists.map(list => (
          <li key={list.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-4 transition-all hover:shadow-sm">
            {renamingId === list.id ? (
              <div className="flex-grow flex gap-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-grow px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  autoFocus
                />
                <button onClick={handleSaveRename} className="p-2 text-green-600 hover:bg-green-100 rounded-full" aria-label="Save name">
                  <CheckIcon className="w-5 h-5" />
                </button>
                <button onClick={handleCancelRename} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" aria-label="Cancel">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex-grow cursor-pointer" onClick={() => onViewList(list)}>
                  <h3 className="font-semibold text-lg text-slate-800 hover:text-teal-600 transition-colors">{list.name}</h3>
                  <p className="text-sm text-slate-500">{list.recipeIds.length} items</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleStartRename(list)} 
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-full transition-colors"
                    aria-label="Rename list"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => onDeleteList(list.id)} 
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Delete list"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingCart;
