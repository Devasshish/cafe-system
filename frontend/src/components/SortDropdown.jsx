import React from 'react';
import { ArrowUpDown, ChevronDown } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Featured & Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
];

const SortDropdown = ({ activeSort, onSortChange }) => {
  return (
    <div className="relative inline-flex items-center flex-1 sm:flex-initial">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8c6b53]">
        <ArrowUpDown className="w-3.5 h-3.5 text-[#B23B14]" />
      </div>
      <select
        value={activeSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="w-full sm:w-auto pl-8 pr-8 py-2.5 rounded-xl sm:rounded-2xl bg-white border border-[#EBDDCC] text-xs sm:text-sm font-semibold text-[#4A3325] focus:outline-none focus:ring-2 focus:ring-[#B23B14]/30 focus:border-[#B23B14] transition shadow-xs appearance-none cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[#8c6b53]">
        <ChevronDown className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};

export default SortDropdown;
