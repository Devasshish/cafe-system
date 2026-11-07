import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Heart } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#2e1c14] selection:bg-[#c86227]/20 selection:text-[#c86227]">
      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#f4ebe1] border-t border-[#ebdccd] py-8 text-center text-xs text-[#7d5f4c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif text-sm font-semibold text-[#2e1c14]">
            Cafe Royale • Artisan Coffee & Bakery
          </p>
          <p className="flex items-center gap-1.5">
            <span>Freshly prepared with</span>
            <Heart className="w-3.5 h-3.5 text-[#c86227] fill-[#c86227]" />
            <span>daily from 7:00 AM – 9:00 PM</span>
          </p>
          <p className="text-[11px] text-[#9a7e6b]">
            © {new Date().getFullYear()} Cafe Royale. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
