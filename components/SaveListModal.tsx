import React, { useState } from 'react';
import XIcon from './icons/XIcon';

interface SaveListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  existingListNames: string[];
}

const SaveListModal: React.FC<SaveListModalProps> = ({ isOpen, onClose, onSave, existingListNames }) => {
  const [listName, setListName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (listName.trim()) {
      onSave(listName.trim());
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-11/12 md:max-w-md p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" aria-label="Close modal">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Save Shopping List</h2>
        <p className="text-gray-600 mb-6">
          Give your list a name. If a list with this name already exists, the selected recipes will be added to it.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="listName" className="block text-sm font-medium text-gray-700">
            List Name
          </label>
          <input
            type="text"
            id="listName"
            value={listName}
            onChange={e => setListName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            placeholder="e.g., Weekly Groceries"
            list="existing-lists"
            required
            autoFocus
          />
          <datalist id="existing-lists">
            {existingListNames.map(name => <option key={name} value={name} />)}
          </datalist>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-amber-300"
              disabled={!listName.trim()}
            >
              Save List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveListModal;