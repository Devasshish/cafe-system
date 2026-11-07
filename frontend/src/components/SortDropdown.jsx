import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Featured & Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
];

const SortDropdown = ({ activeSort, onSortChange }) => {
  return (
    <div className="relative inline-flex items-center">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8c6b53]">
        <ArrowUpDown className="w-3.5 h-3.5 text-[#c86227]" />
      </div>
      <select
        value={activeSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="pl-8 pr-8 py-3 rounded-2xl bg-white border border-[#e5d5c5] text-xs sm:text-sm font-medium text-[#4a3325] focus:outline-none focus:ring-2 focus:ring-[#c86227]/40 focus:border-[#c86227] transition shadow-sm appearance-none cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;

