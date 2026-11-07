import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Coffee, ShoppingCart, LayoutDashboard } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-amber-700 hover:text-amber-800 transition">
            <Coffee className="w-6 h-6 text-amber-600" />
            <span>Cafe Ordering System</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-amber-700 hover:bg-slate-100 transition"
            >
              Menu
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-amber-700 hover:bg-slate-100 transition"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart</span>
            </Link>
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-amber-700 hover:bg-slate-100 transition"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        <div className="max-w-6xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Cafe Ordering System. Base initialized.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

