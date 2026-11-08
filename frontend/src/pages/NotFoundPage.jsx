import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ArrowLeft, ShoppingBag, Home } from 'lucide-react';
import { useTable } from '../context/TableContext';

const NotFoundPage = () => {
  const { tableNumber } = useTable();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Subtle Floating Coffee Icon / Badge */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#EBDDCC]/60 flex items-center justify-center shadow-inner">
            <Coffee className="w-12 h-12 sm:w-14 sm:h-14 text-[#B23B14] stroke-[1.8] animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 px-2.5 py-1 rounded-full bg-[#B23B14] text-white text-xs font-bold shadow-md">
            404
          </span>
        </div>

        {/* Large Aesthetic Headline */}
        <div className="space-y-2">
          <h1 className="font-serif font-black text-4xl sm:text-5xl md:text-6xl text-[#331B0F] tracking-tight leading-tight">
            This Cup is Empty
          </h1>
          <p className="font-sans font-medium text-sm sm:text-base text-[#7D5F4C] max-w-md mx-auto leading-relaxed">
            Looks like the page you're searching for was brewed away, moved, or never existed. Let's get you back to the fresh aroma of coffee.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to={tableNumber ? `/?table=${tableNumber}` : '/'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#B23B14] hover:bg-[#962E0B] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to Menu</span>
          </Link>

          <Link
            to="/cart"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#FDFBF7] text-[#331B0F] border border-[#EBDDCC] text-sm font-bold shadow-sm hover:border-[#B23B14]/40 transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-[#B23B14]" />
            <span>View Cart</span>
          </Link>
        </div>

        {/* Small subtle roastery footer note */}
        <p className="text-[11px] font-sans text-[#A48873] pt-6">
          Recharge Café • Freshly brewed table ordering system
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;

