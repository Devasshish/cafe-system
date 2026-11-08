import React from 'react';
import { Coffee, Flame, Sparkles } from 'lucide-react';

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
    <div className="relative w-full">
      {/* Horizontal scrollable pills with edge padding on mobile */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto py-1 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory.toLowerCase() === cat.id.toLowerCase();

          return (
            <button
              key={cat.id || 'all'}
              onClick={() => onSelectCategory(cat.id)}
              type="button"
              className={`inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 active:scale-95 ${
                isActive
                  ? 'bg-[#B23B14] text-white shadow-md shadow-[#B23B14]/25 ring-2 ring-[#B23B14]/20'
                  : 'bg-white text-[#4A3325] border border-[#EBDDCC] hover:bg-[#FAF4EC] hover:border-[#D9C4AF]'
              }`}
            >
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
