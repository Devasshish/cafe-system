import React from 'react';

const CATEGORIES = [
  { id: '', label: 'All Coffee' },
  { id: 'cappuccino', label: 'Cappuccino' },
  { id: 'latte', label: 'Latte' },
  { id: 'mocha', label: 'Mocha' },
  { id: 'frappuccino', label: 'Frappuccino' },
  { id: 'cold coffee', label: 'Cold Coffee' },
  { id: 'hot coffee', label: 'Hot Coffee' },
  { id: 'flat white', label: 'Flat White' },
];

const CategoryFilter = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto py-2 px-1 scrollbar-none scroll-smooth">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id || 'all'}
            onClick={() => onSelectCategory(cat.id)}
            type="button"
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-[#121212] text-white shadow-md'
                : 'bg-[#f2f2f2] text-[#3a3a3a] hover:bg-[#e5e5e5] hover:text-[#121212]'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
