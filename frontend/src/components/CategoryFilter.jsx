import React from 'react';
import { Coffee, Snowflake, Flame, Cake, Cookie, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: '', label: 'All Items', icon: Sparkles },
  { id: 'hot coffee', label: 'Hot Coffee', icon: Flame },
  { id: 'cold coffee', label: 'Cold Coffee', icon: Snowflake },
  { id: 'tea', label: 'Tea & Infusions', icon: Coffee },
  { id: 'bakery', label: 'Artisan Bakery', icon: Cookie },
  { id: 'desserts', label: 'Desserts', icon: Cake },
];

const CategoryFilter = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id || 'all'}
            onClick={() => onSelectCategory(cat.id)}
            type="button"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 shadow-sm ${
              isActive
                ? 'bg-[#c86227] text-white shadow-[#c86227]/25 shadow-md scale-102'
                : 'bg-white text-[#4a3325] border border-[#e5d5c5] hover:border-[#c86227]/50 hover:bg-[#faf4ee]'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#c86227]'}`} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;

