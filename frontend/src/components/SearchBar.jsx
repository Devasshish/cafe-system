import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange, onClear }) => {
  return (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c6b53]">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search coffees, matcha, pastries..."
        className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-[#e5d5c5] text-sm text-[#2e1c14] placeholder-[#a68c78] focus:outline-none focus:ring-2 focus:ring-[#c86227]/40 focus:border-[#c86227] transition-all shadow-sm"
      />
      {searchTerm && (
        <button
          onClick={onClear}
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8c6b53] hover:text-[#2e1c14] transition"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;

