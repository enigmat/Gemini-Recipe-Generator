import React, { useState, useRef, useEffect } from 'react';
import UserCircleIcon from './icons/UserCircleIcon';
import LogoutIcon from './icons/LogoutIcon';
import LayoutDashboardIcon from './icons/LayoutDashboardIcon';
import { User } from '../types';

interface UserMenuProps {
    user: User;
    onLogout: () => void;
    onShowDashboard: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout, onShowDashboard }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const handleShowDashboard = () => {
        onShowDashboard();
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm font-semibold text-text-primary p-1 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <UserCircleIcon className="h-7 w-7 text-gray-500" />
                <span className="hidden md:inline">{user.email}</span>
            </button>
            
            {isOpen && (
                <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-border-color z-20"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                >
                    {user.isAdmin && (
                         <button
                            onClick={handleShowDashboard}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-gray-100"
                            role="menuitem"
                        >
                            <LayoutDashboardIcon className="h-5 w-5" />
                            <span>Admin Dashboard</span>
                        </button>
                    )}
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        role="menuitem"
                    >
                        <LogoutIcon className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;