import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FloatingTrayBar = () => {
  const { totalCount, totalAmount } = useCart();
  const location = useLocation();

  // Hide on Cart and Admin pages
  if (totalCount === 0 || location.pathname === '/cart' || location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 sm:bottom-6 inset-x-0 z-40 px-4 pointer-events-none animate-slide-up">
      <div className="max-w-xl mx-auto bg-[#331B0F] text-[#FAF6F0] rounded-2xl p-3 sm:p-3.5 shadow-[0_16px_36px_rgba(51,27,15,0.35)] border border-[#4A2817] flex items-center justify-between pointer-events-auto backdrop-blur-md">
        {/* Tray Summary */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B23B14] flex items-center justify-center text-white shadow-md flex-shrink-0">
            <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans font-black text-xs sm:text-sm text-white">
                {totalCount} {totalCount === 1 ? 'item' : 'items'} in Tray
              </span>
              <span className="text-xs sm:text-sm font-serif font-black text-[#F8DED2]">
                ₹{Number(totalAmount).toFixed(2)}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#CBB7A2]">
              Ready to brew for your table
            </p>
          </div>
        </div>

        {/* View Tray CTA Button */}
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#B23B14] hover:bg-[#962E0B] active:scale-95 text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md cursor-pointer whitespace-nowrap"
        >
          <span>View Tray</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default FloatingTrayBar;

