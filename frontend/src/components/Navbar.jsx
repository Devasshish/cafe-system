import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, X, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTable } from '../context/TableContext';
import api from '../services/api';

const Navbar = () => {
  const { totalCount } = useCart();
  const { tableNumber, setTableNumber, hasTable } = useTable();
  const location = useLocation();
  const navigate = useNavigate();

  const [isEditingTable, setIsEditingTable] = useState(false);
  const [tempTableInput, setTempTableInput] = useState('');
  const [availableTables, setAvailableTables] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await api.get('/tables');
        if (res.data && res.data.success) {
          setAvailableTables(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load tables in Navbar:', err);
      }
    };
    fetchTables();
  }, []);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* ========================================================= */}
          {/* MOBILE VIEW (< md): Name Left, Logo Center, Tray Right */}
          {/* ========================================================= */}
          <div className="md:hidden h-22 sm:h-24 flex items-center justify-between relative">
            {/* Left: Brand Name */}
            <Link
              to={tableNumber ? `/?table=${tableNumber}` : '/'}
              className="flex flex-col z-10 max-w-[110px]"
            >
              <span className="font-sans font-extrabold text-xl sm:text-2xl text-[#331B0F] tracking-tight leading-tight hover:text-[#B23B14] transition-colors">
                recharge
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-[#7D5F4C] tracking-widest uppercase font-sans">
                Café & Eatery
              </span>
            </Link>

            {/* Center: Brand Logo Image (Prominent Bold Size & Mathematically Centered) */}
            <Link
              to={tableNumber ? `/?table=${tableNumber}` : '/'}
              className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10"
              aria-label="Recharge Café Home"
            >
              <img
                src="/logo.png"
                alt="Recharge Café Logo"
                className="w-[68px] h-[68px] sm:w-[80px] sm:h-[80px] rounded-full object-cover ring-3 ring-[#EBDDCC] shadow-xl active:scale-95 transition-transform"
              />
            </Link>

            {/* Right: Just the Tray Button */}
            <div className="flex items-center justify-end z-10">
              <Link
                to="/cart"
                className="relative inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#B23B14] active:bg-[#962E0B] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer font-sans whitespace-nowrap group"
                aria-label={`My Coffee Tray, ${totalCount} items`}
                title="View Coffee Tray"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] group-hover:scale-110 transition-transform" />
                <span>Tray</span>
                {totalCount > 0 && (
                  <span className="min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-[20px] px-1 rounded-full bg-white text-[#B23B14] text-[10px] sm:text-[11px] font-black leading-none flex items-center justify-center shadow-xs">
                    {totalCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* ========================================================= */}
          {/* DESKTOP VIEW (>= md): Logo + Name on Left, Nav + Table + Tray on Right */}
          {/* ========================================================= */}
          <div className="hidden md:flex h-22 sm:h-24 items-center justify-between">
            {/* Brand Logo & Clean Typography */}
            <Link
              to={tableNumber ? `/?table=${tableNumber}` : '/'}
              className="flex items-center gap-3 sm:gap-3.5 group"
            >
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Recharge Café"
                  className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full object-cover ring-3 ring-[#EBDDCC] shadow-md transition-transform duration-300 group-hover:scale-105"
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
            <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
              <nav className="flex items-center gap-6 lg:gap-8 text-sm font-semibold text-[#331B0F] font-sans">
                <a
                  href="#menu-section"
                  onClick={handleScrollToMenu}
                  className="hover:text-[#B23B14] transition-colors"
                >
                  Menu
                </a>
                <Link
                  to="/notes"
                  className={`hover:text-[#B23B14] transition-colors ${
                    location.pathname.startsWith('/notes') ? 'text-[#B23B14]' : ''
                  }`}
                >
                  Notes
                </Link>
                <Link
                  to="/reviews"
                  className={`hover:text-[#B23B14] transition-colors ${
                    location.pathname.startsWith('/reviews') || location.pathname.startsWith('/feedback')
                      ? 'text-[#B23B14]'
                      : ''
                  }`}
                >
                  Reviews
                </Link>
              </nav>

              {/* Table Number Badge */}
              <button
                onClick={handleOpenTableModal}
                type="button"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  hasTable
                    ? 'bg-[#F8DED2] text-[#B23B14] border-[#f0c8b6] shadow-xs'
                    : 'bg-white/80 text-[#7D5F4C] border-[#EBDDCC] hover:border-[#B23B14]/40 hover:bg-white'
                }`}
                title="Click to view or set dine-in table number"
              >
                <MapPin className="w-3.5 h-3.5 text-[#B23B14]" />
                <span>
                  {hasTable ? `Table ${tableNumber}` : 'Set Table'}
                </span>
              </button>

              {/* Primary Terracotta Pill Button: Coffee Tray */}
              <Link
                to="/cart"
                className="relative inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full bg-[#B23B14] hover:bg-[#962E0B] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer font-sans whitespace-nowrap group"
                aria-label={`My Coffee Tray, ${totalCount} items`}
                title="View Coffee Tray"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.2] group-hover:scale-110 transition-transform" />
                <span>Tray</span>
                {totalCount > 0 && (
                  <span className="min-w-[20px] h-[20px] px-1.5 rounded-full bg-white text-[#B23B14] text-[11px] font-black leading-none flex items-center justify-center shadow-xs">
                    {totalCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Dine-In Table Modal */}
      {isEditingTable &&
        (typeof document !== 'undefined'
          ? createPortal(
              <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
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
                    Select your dine-in table number from the registered cafe tables below:
                  </p>

                  <form onSubmit={handleSaveTable} className="space-y-4">
                    <div>
                      <div className="relative">
                        <select
                          value={tempTableInput}
                          onChange={(e) => setTempTableInput(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-white border border-[#ebdccd] text-sm text-[#361a0c] font-bold focus:outline-none focus:ring-2 focus:ring-[#b23b14]/40 appearance-none cursor-pointer"
                          autoFocus
                        >
                          <option value="">-- Choose Table from Dropdown --</option>
                          {availableTables.map((tbl) => (
                            <option key={tbl._id} value={tbl.tableNumber}>
                              Table {tbl.tableNumber}
                            </option>
                          ))}
                          {tempTableInput && !availableTables.some((t) => t.tableNumber === tempTableInput) && (
                            <option value={tempTableInput}>Table {tempTableInput}</option>
                          )}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#7D5F4C]">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
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
              </div>,
              document.body
            )
          : null)}
    </>
  );
};

export default Navbar;
