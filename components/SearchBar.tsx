import React from 'react';
import SearchIcon from './icons/SearchIcon';

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search recipes...' }) => {
  return (
    <div className="w-full relative">
       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 bg-slate-800 border-2 border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-shadow text-slate-300 placeholder-slate-400"
        aria-label="Search recipes"
      />
    </div>
  );
};

export default SearchBar;