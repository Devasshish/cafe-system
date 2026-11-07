import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ShoppingBag, MapPin } from 'lucide-react';

const Navbar = ({ cartCount = 0 }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fcfaf7]/95 backdrop-blur-md border-b border-[#ebdccd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full bg-[#c86227]/10 flex items-center justify-center text-[#c86227] group-hover:bg-[#c86227] group-hover:text-white transition-all duration-300 shadow-sm">
            <Coffee className="w-6 h-6 transition-transform group-hover:scale-110" />
          </div>
          <div>
            <span className="font-serif font-bold text-xl sm:text-2xl text-[#2e1c14] tracking-tight block">
              Cafe Royale
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#8c6b53] font-medium block">
              Artisan Coffee & Bakery
            </span>
          </div>
        </Link>

        {/* Right Action Icons & Table Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Table indicator badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4ebe1] border border-[#e3d0bf] text-xs font-medium text-[#4a3325]">
            <MapPin className="w-3.5 h-3.5 text-[#c86227]" />
            <span>Table Dine-In</span>
          </div>

          {/* Cart Icon Button (Placeholder for Cart count) */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#2e1c14] text-[#faf7f2] hover:bg-[#c86227] transition-all duration-300 shadow-sm text-sm font-medium"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="ml-0.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white bg-[#c86227] rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

