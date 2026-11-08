import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FloatingTrayBar from '../components/FloatingTrayBar';
import { Heart } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6EFE5] text-[#331B0F] selection:bg-[#B23B14]/20 selection:text-[#B23B14] relative">
      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-1 w-full pb-16">
        <Outlet />
      </main>

      {/* Floating Bottom Tray Bar (Appears when items are added to tray) */}
      <FloatingTrayBar />

      {/* Footer */}
      <footer className="bg-[#f4ebe1] border-t border-[#ebdccd] py-8 text-center text-xs text-[#7d5f4c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Recharge Café" className="w-10 h-10 rounded-full object-cover ring-2 ring-[#ebdccd] shadow-sm" />
            <p className="font-serif text-sm font-semibold text-[#2e1c14]">
              Recharge Café • Coffee & Eatery
            </p>
          </div>
          <p className="flex items-center gap-1.5">
            <span>Powered with passion &</span>
            <Heart className="w-3.5 h-3.5 text-[#f26522] fill-[#f26522]" />
            <span>daily from 7:00 AM – 10:00 PM</span>
          </p>
          <p className="text-[11px] text-[#9a7e6b]">
            © {new Date().getFullYear()} Recharge Café. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
