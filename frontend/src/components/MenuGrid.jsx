import React from 'react';
import MenuCard from './MenuCard';
import { Coffee, RotateCcw } from 'lucide-react';

const MenuGrid = ({ items, onAddToCart, onResetFilters }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#ebdccd] shadow-sm my-6 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#f4ebe1] text-[#c86227] flex items-center justify-center mx-auto mb-4">
          <Coffee className="w-8 h-8 text-[#c86227]" />
        </div>
        <h3 className="font-serif font-bold text-xl text-[#2e1c14] mb-2">
          No Menu Items Found
        </h3>
        <p className="text-sm text-[#7d5f4c] mb-6 max-w-sm mx-auto leading-relaxed">
          We couldn't find any items matching your active search or category filters.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2e1c14] text-[#faf7f2] hover:bg-[#c86227] transition-all text-xs sm:text-sm font-semibold shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      {items.map((item) => (
        <MenuCard key={item._id} item={item} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default MenuGrid;

