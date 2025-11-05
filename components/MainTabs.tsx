import React from 'react';
import CalendarDaysIcon from './icons/CalendarDaysIcon';
import FilmIcon from './icons/FilmIcon';
import MortarPestleIcon from './icons/MortarPestleIcon';
import HeartIcon from './icons/HeartIcon';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import CocktailIcon from './icons/CocktailIcon';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';
import StoreIcon from './icons/StoreIcon';
import SparklesIcon from './icons/SparklesIcon';
import { User } from '../types';
import CrownIcon from './icons/CrownIcon';
import RefrigeratorIcon from './icons/RefrigeratorIcon';
import InformationCircleIcon from './icons/InformationCircleIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import HomeIcon from './icons/HomeIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import ChatBubbleIcon from './icons/ChatBubbleIcon';
import GlobeAltIcon from './icons/GlobeAltIcon';
import LayoutDashboardIcon from './icons/LayoutDashboardIcon';
import ArrowPathIcon from './icons/ArrowPathIcon';
import UsersIcon from './icons/UsersIcon';

interface MainTabsProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: User | null;
}

const MainTabs: React.FC<MainTabsProps> = ({ activeTab, onSelectTab, currentUser }) => {
  const allTabs: any[] = [
    { id: 'All Recipes', name: 'Home', icon: <HomeIcon className="w-5 h-5" /> },
    { id: 'Featured Chefs', name: 'Featured Chefs', icon: <UsersIcon className="w-5 h-5" /> },
    { id: "Where's This From?", name: "Where's This From?", icon: <GlobeAltIcon className="w-5 h-5" /> },
    { id: 'Community Chat', name: 'Community Chat', icon: <ChatBubbleIcon className="w-5 h-5" /> },
    { id: 'Pantry Chef', name: 'Pantry Chef', icon: <RefrigeratorIcon className="w-5 h-5" /> },
    { id: 'AI Meal Planner', name: 'AI Meal Planner', icon: <ClipboardListIcon className="w-5 h-5" /> },
    { id: 'My Cookbook', name: 'My Cookbook', icon: <HeartIcon className="w-5 h-5" /> },
    { id: 'Cocktail Book', name: 'Cocktail Book', icon: <BookOpenIcon className="w-5 h-5" /> },
    { id: 'Shopping List', name: 'Shopping List', icon: <ShoppingCartIcon className="w-5 h-5" /> },
    { id: 'Marketplace', name: 'Marketplace', icon: <StoreIcon className="w-5 h-5" /> },
    { id: 'Meal Plans', name: 'Meal Plans', icon: <CalendarDaysIcon className="w-5 h-5" /> },
    { id: 'Video Tutorials', name: 'Video Tutorials', icon: <FilmIcon className="w-5 h-5" /> },
    { id: 'Cooking Classes', name: 'Cooking Classes', icon: <MortarPestleIcon className="w-5 h-5" /> },
    { id: 'Bartender Helper', name: 'Bartender Helper', icon: <SparklesIcon className="w-5 h-5" /> },
    { id: 'Ask an Expert', name: 'Ask an Expert', icon: <QuestionMarkCircleIcon className="w-5 h-5" /> },
    { id: 'Data Sync', name: 'Sync', icon: <ArrowPathIcon className="w-5 h-5" /> },
    { id: 'About Us', name: 'About Us', icon: <InformationCircleIcon className="w-5 h-5" /> },
  ];

  if (currentUser?.isAdmin) {
      allTabs.push({ id: 'Admin Dashboard', name: 'Admin', icon: <LayoutDashboardIcon className="w-5 h-5" /> });
  }

  const premiumTabs = ['Cooking Classes', 'Ask an Expert', 'AI Meal Planner'];

  return (
    <div className="px-4 sm:px-0 flex overflow-x-auto scrollbar-hide space-x-4 sm:justify-center sm:flex-wrap sm:space-x-0 sm:gap-3 my-8">
      {allTabs.map((tab) => {
        if (tab.isLink) {
            return (
                <a
                    key={tab.id}
                    href={tab.href}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 bg-white text-gray-600 hover:bg-gray-100`}
                >
                    {tab.icon}
                    <span>{tab.name}</span>
                </a>
            );
        }

        const isActive = activeTab === tab.id;
        const isPremiumFeature = premiumTabs.includes(tab.id);
        const showPremiumBadge = isPremiumFeature && !currentUser?.isPremium;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 ${
              isActive
                ? 'bg-teal-500 text-white shadow'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            aria-pressed={isActive}
          >
            {/* Special handling for HeartIcon fill state */}
            {tab.id === 'My Cookbook' ? <HeartIcon className="w-5 h-5" isFilled={isActive} /> : tab.icon}
            <span>{tab.name}</span>
            {showPremiumBadge && (
                <CrownIcon className="w-4 h-4 text-amber-500" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MainTabs;