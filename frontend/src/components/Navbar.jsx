import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTable } from '../context/TableContext';

const Navbar = () => {
  const { totalCount } = useCart();
  const { tableNumber, setTableNumber, hasTable } = useTable();
  const location = useLocation();
  const navigate = useNavigate();

  const [isEditingTable, setIsEditingTable] = useState(false);
  const [tempTableInput, setTempTableInput] = useState('');

  const handleOpenTableModal = () => {
    setTempTableInput(tableNumber || '');
    setIsEditingTable(true);
  };

  const handleSaveTable = (e) => {
    e.preventDefault();
    if (tempTableInput.trim()) {
      setTableNumber(tempTableInput.trim());
      setIsEditingTable(false);
    }
  };

  const handleScrollToMenu = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById('menu-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#menu-section');
    }
  };

  return (
    <>
      {/* Seamless, Borderless Modern Navbar with Warm Cream Canvas */}
      <header className="sticky top-0 z-50 bg-[#F6EFE5]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-20 sm:h-24 flex items-center justify-between">
          {/* Brand Logo & Clean Typography - Prominent & Big */}
          <Link
            to={tableNumber ? `/?table=${tableNumber}` : '/'}
            className="flex items-center gap-3 sm:gap-3.5 group"
          >
            <div className="relative">
              <img
                src="/logo.png"
                alt="Recharge Café"
                className="w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full object-cover ring-2 ring-[#EBDDCC] shadow-md transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-extrabold text-2xl sm:text-3xl text-[#331B0F] tracking-tight leading-none group-hover:text-[#B23B14] transition-colors">
                recharge
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-[#7D5F4C] tracking-widest uppercase mt-0.5 font-sans">
                Café & Eatery
              </span>
            </div>
          </Link>

          {/* Right Aligned Navigation Group */}
          <div className="flex items-center gap-5 sm:gap-7 lg:gap-8">
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-[#331B0F] font-sans">
              <a
                href="#menu-section"
                onClick={handleScrollToMenu}
                className="hover:text-[#B23B14] transition-colors"
              >
                About
              </a>
              <a
                href="#menu-section"
                onClick={handleScrollToMenu}
                className="hover:text-[#B23B14] transition-colors"
              >
                Collections
              </a>
              <Link
                to="/admin"
                className={`hover:text-[#B23B14] transition-colors ${
                  location.pathname.startsWith('/admin') ? 'text-[#B23B14]' : ''
                }`}
              >
                Notes
              </Link>
              <button
                onClick={handleOpenTableModal}
                type="button"
                className="hover:text-[#B23B14] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Locations</span>
                {hasTable && (
                  <span className="text-[10px] bg-[#F8DED2] text-[#B23B14] px-2 py-0.5 rounded-full font-bold">
                    {tableNumber}
                  </span>
                )}
              </button>
            </nav>

            {/* Minimalist Cart Icon with Floating Badge */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full text-[#331B0F] hover:bg-black/5 transition-colors"
              aria-label={`View Cart, ${totalCount} items`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              {totalCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#B23B14] text-white text-[10px] font-bold leading-none flex items-center justify-center shadow-sm">
                  {totalCount}
                </span>
              )}
            </Link>

            {/* Terracotta Red/Orange Pill Button: Shop */}
            <a
              href="#menu-section"
              onClick={handleScrollToMenu}
              className="px-6 sm:px-7 py-2.5 rounded-full bg-[#B23B14] hover:bg-[#962E0B] text-white text-sm font-bold tracking-wide transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer font-sans"
            >
              Shop
            </a>
          </div>
        </div>
      </header>

      {/* Dine-In Table Modal */}
      {isEditingTable && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#faf6f0] rounded-3xl p-6 border border-[#ebdccd] shadow-2xl animate-scale-in text-[#361a0c]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-lg text-[#361a0c] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#b23b14]" />
                <span>Dine-In Table</span>
              </h3>
              <button
                onClick={() => setIsEditingTable(false)}
                className="p-1 rounded-full text-[#8c6b53] hover:text-[#361a0c] hover:bg-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#7d5f4c] mb-4 leading-relaxed">
              Scan a table QR code or enter your table number to route your barista orders directly to your table.
            </p>

            <form onSubmit={handleSaveTable} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={tempTableInput}
                  onChange={(e) => setTempTableInput(e.target.value)}
                  placeholder="Enter Table # (e.g. T01, T02)"
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#ebdccd] text-sm text-[#361a0c] font-medium focus:outline-none focus:ring-2 focus:ring-[#b23b14]/40 uppercase tracking-wider"
                  autoFocus
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingTable(false)}
                  className="flex-1 py-2.5 rounded-full border border-[#ebdccd] text-xs font-bold text-[#6e5444] hover:bg-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!tempTableInput.trim()}
                  className="flex-1 py-2.5 rounded-full bg-[#b23b14] hover:bg-[#9c310e] text-white text-xs font-bold transition disabled:opacity-50 shadow-md shadow-[#b23b14]/25"
                >
                  Confirm Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
