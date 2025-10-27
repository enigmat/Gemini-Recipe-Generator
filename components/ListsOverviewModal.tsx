import React, { useState } from 'react';
import { ShoppingList } from '../types';
import XIcon from './icons/XIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import CheckIcon from './icons/CheckIcon';

interface ListsOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lists: ShoppingList[];
  onView: (list: ShoppingList) => void;
  onDelete: (listId: string) => void;
  onRename: (listId: string, newName: string) => void;
}

const ListsOverviewModal: React.FC<ListsOverviewModalProps> = ({ isOpen, onClose, lists, onView, onDelete, onRename }) => {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  if (!isOpen) return null;

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
      onRename(renamingId, editingName.trim());
    }
    handleCancelRename();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleSaveRename();
    } else if (e.key === 'Escape') {
        handleCancelRename();
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-11/12 md:max-w-lg max-h-[90vh] flex flex-col p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" aria-label="Close modal">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Shopping Lists</h2>
        <div className="flex-grow overflow-y-auto pr-2">
          {lists.length > 0 ? (
            <ul className="space-y-3">
              {lists.map(list => (
                <li key={list.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between gap-2">
                  {renamingId === list.id ? (
                    <div className="flex-grow flex gap-2">
                        <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-grow px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-800 focus:border-gray-800 sm:text-sm"
                            autoFocus
                        />
                         <button onClick={handleSaveRename} className="p-2 text-green-600 hover:bg-green-100 rounded-full" aria-label="Save new name">
                            <CheckIcon className="w-5 h-5"/>
                        </button>
                         <button onClick={handleCancelRename} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" aria-label="Cancel rename">
                            <XIcon className="w-5 h-5"/>
                        </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-grow cursor-pointer" onClick={() => onView(list)}>
                        <p className="font-semibold text-gray-800">{list.name}</p>
                        <p className="text-sm text-gray-500">{list.recipeIds.length} recipe{list.recipeIds.length !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-1">
                        <button onClick={() => handleStartRename(list)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full" aria-label={`Rename list ${list.name}`}>
                            <PencilIcon className="w-5 h-5"/>
                        </button>
                        <button onClick={() => onDelete(list.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full" aria-label={`Delete list ${list.name}`}>
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-8">
              You don't have any saved shopping lists yet. Select some recipes and save them to get started!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListsOverviewModal;
