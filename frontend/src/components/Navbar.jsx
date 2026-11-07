import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coffee, ShoppingBag, MapPin, QrCode, X, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTable } from '../context/TableContext';

const Navbar = () => {
  const { totalCount } = useCart();
  const { tableNumber, setTableNumber, hasTable } = useTable();
  const location = useLocation();

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

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fcfaf7]/95 backdrop-blur-md border-b border-[#ebdccd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link to={tableNumber ? `/?table=${tableNumber}` : '/'} className="flex items-center gap-3 group">
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

          {/* Right Navigation, Table Badge & Cart */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Table Identification Badge */}
            <button
              onClick={handleOpenTableModal}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition shadow-sm ${
                hasTable
                  ? 'bg-amber-100/80 border-amber-300 text-amber-900 hover:bg-amber-200/80'
                  : 'bg-[#f4ebe1] border-[#e3d0bf] text-[#4a3325] hover:bg-[#ede0d4]'
              }`}
              title="Click to view or change table"
            >
              <MapPin className="w-3.5 h-3.5 text-[#c86227]" />
              <span>{hasTable ? `Table: ${tableNumber}` : 'Set Table #'}</span>
            </button>

            {/* Admin QR Generator Link */}
            <Link
              to="/admin"
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                location.pathname.startsWith('/admin')
                  ? 'bg-[#2e1c14] text-white'
                  : 'text-[#6e5444] hover:text-[#2e1c14] hover:bg-[#f4ebe1]'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-[#c86227]" />
              <span>QR Admin</span>
            </Link>

            {/* Cart Icon Button with Real-time Count */}
            <Link
              to="/cart"
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 shadow-sm text-sm font-medium ${
                location.pathname === '/cart'
                  ? 'bg-[#c86227] text-white shadow-[#c86227]/25 shadow-md'
                  : 'bg-[#2e1c14] text-[#faf7f2] hover:bg-[#c86227]'
              }`}
              aria-label={`View Cart, ${totalCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white bg-[#c86227] rounded-full border-2 border-white sm:border-transparent">
                  {totalCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Quick Table Change Modal */}
      {isEditingTable && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-[#ebdccd] shadow-2xl animate-scale-in text-[#2e1c14]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-lg text-[#2e1c14] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c86227]" />
                <span>Dine-In Table Number</span>
              </h3>
              <button
                onClick={() => setIsEditingTable(false)}
                className="p-1 rounded-full text-[#8c6b53] hover:text-[#2e1c14] hover:bg-[#f4ebe1]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#7d5f4c] mb-4">
              Scanned a table QR code or placed at a cafe table? Enter your table number below (e.g., T01, T02, 5).
            </p>

            <form onSubmit={handleSaveTable} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={tempTableInput}
                  onChange={(e) => setTempTableInput(e.target.value)}
                  placeholder="Enter Table # (e.g. T01)"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#faf7f2] border border-[#e5d5c5] text-sm text-[#2e1c14] focus:outline-none focus:ring-2 focus:ring-[#c86227]/40 uppercase"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingTable(false)}
                  className="flex-1 py-2.5 rounded-full border border-[#ebdccd] text-xs font-semibold text-[#6e5444] hover:bg-[#f4ebe1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!tempTableInput.trim()}
                  className="flex-1 py-2.5 rounded-full bg-[#c86227] hover:bg-[#b0531e] text-white text-xs font-semibold transition disabled:opacity-50"
                >
                  Save Table
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
