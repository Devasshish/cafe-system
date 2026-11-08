import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange, onClear }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c6b53]">
        <Search className="w-4 h-4 text-[#B23B14]" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search coffees, roasts, bites..."
        className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white border border-[#EBDDCC] text-xs sm:text-sm text-[#331B0F] placeholder-[#8c6b53]/60 focus:outline-none focus:ring-2 focus:ring-[#B23B14]/30 focus:border-[#B23B14] transition-all shadow-xs"
      />
      {searchTerm && (
        <button
          onClick={onClear}
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8c6b53] hover:text-[#331B0F] transition cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
