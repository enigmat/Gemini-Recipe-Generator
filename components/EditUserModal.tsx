import React, { useState, useEffect } from 'react';
import { User } from '../types';
import XIcon from './icons/XIcon';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (user: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState<User>(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit User: {user.name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                <XIcon className="w-6 h-6" />
            </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              disabled
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <label className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
              <input type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={handleChange} className="h-5 w-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"/>
              <span className="text-gray-700 text-sm font-medium">Admin</span>
            </label>
            <label className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
              <input type="checkbox" name="isPremium" checked={formData.isPremium} onChange={handleChange} className="h-5 w-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"/>
              <span className="text-gray-700 text-sm font-medium">Premium</span>
            </label>
            <label className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
              <input type="checkbox" name="isSubscribed" checked={formData.isSubscribed} onChange={handleChange} className="h-5 w-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"/>
              <span className="text-gray-700 text-sm font-medium">Subscribed</span>
            </label>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="planEndDate">Plan End Date</label>
            <input
              id="planEndDate"
              name="planEndDate"
              type="text"
              value={formData.planEndDate || ''}
              onChange={handleChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700"
              placeholder="YYYY-MM-DD or N/A"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded-lg border border-gray-300">
                Cancel
            </button>
            <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
