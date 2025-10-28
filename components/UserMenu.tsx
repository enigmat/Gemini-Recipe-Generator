import React, { useState, useRef, useEffect } from 'react';
import LogoutIcon from './icons/LogoutIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import HeartIcon from './icons/HeartIcon';
import UserIcon from './icons/UserIcon';
import { User } from '../types';
import ListIcon from './icons/ListIcon';
import LayoutDashboardIcon from './icons/LayoutDashboardIcon';
import CrownIcon from './icons/CrownIcon';

interface UserMenuProps {
  user: User;
  onLogout: () => void;
  onShowFavorites: () => void;
  onOpenProfile: () => void;
  onOpenLists: () => void;
  onOpenAdmin: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout, onShowFavorites, onOpenProfile, onOpenLists, onOpenAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open user menu"
        className="flex items-center gap-2 px-2 py-1.5 bg-white border border-slate-300 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
            {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <UserIcon className="w-6 h-6 text-slate-500" />
            )}
        </div>
        <span className="flex items-center gap-1.5">
          <span>Hello, {user.name}</span>
          {user.isPremium && <CrownIcon className="w-4 h-4 text-amber-500" title="Premium Member" />}
        </span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-3 border-b">
            <p className="text-sm text-slate-700">Signed in as</p>
            <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
          </div>
           <button
            onClick={() => {
              onOpenProfile();
              setIsOpen(false);
            }}
            className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            <UserIcon className="w-5 h-5" />
            My Profile
          </button>
          <button
            onClick={() => {
              onShowFavorites();
              setIsOpen(false);
            }}
            className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            <HeartIcon className="w-5 h-5 text-red-500" isFilled={true} />
            My Favorite Recipes
          </button>
           <button
            onClick={() => {
              onOpenLists();
              setIsOpen(false);
            }}
            className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            <ListIcon className="w-5 h-5" />
            My Shopping Lists
          </button>
          {user.isAdmin && (
            <button
              onClick={() => {
                onOpenAdmin();
                setIsOpen(false);
              }}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              <LayoutDashboardIcon className="w-5 h-5" />
              Admin Dashboard
            </button>
          )}
          <div className="border-t my-1"></div>
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            <LogoutIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;