import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminLogin from '../components/admin/AdminLogin';
import AdminOverview from '../components/admin/AdminOverview';
import AdminMenu from '../components/admin/AdminMenu';
import AdminOrders from '../components/admin/AdminOrders';
import QRGenerator from '../components/QRGenerator';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  QrCode,
  LogOut,
  ExternalLink,
  Menu as MenuIcon,
  X,
  Coffee,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  const { isAuthenticated, adminUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // If not authenticated, prompt login screen
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Live Orders', icon: ShoppingBag },
    { id: 'menu', label: 'Menu Catalog', icon: UtensilsCrossed },
    { id: 'qr', label: 'Table QR Generator', icon: QrCode },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row gap-6 items-start">
      {/* Mobile Sidebar Toggle Header */}
      <div className="w-full md:hidden flex items-center justify-between p-4 bg-white rounded-2xl border border-[#ebdccd]">
        <div className="flex items-center gap-2">
          <Coffee className="w-5 h-5 text-[#c86227]" />
          <span className="font-serif font-bold text-sm text-[#2e1c14]">Admin Dashboard</span>
        </div>
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-1.5 rounded-lg text-[#8c6b53] hover:bg-[#f4ebe1]"
        >
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`w-full md:w-64 bg-white rounded-3xl border border-[#ebdccd] shadow-sm p-5 space-y-6 flex-shrink-0 ${
          isMobileNavOpen ? 'block' : 'hidden md:block'
        }`}
      >
        {/* User Info */}
        <div className="border-b border-[#f4ebe1] pb-4">
          <span className="text-[10px] uppercase tracking-wider text-[#8c6b53] font-bold block">
            Logged In As
          </span>
          <span className="font-serif font-bold text-base text-[#2e1c14] block">
            {adminUser?.username || 'Admin'}
          </span>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
            Authenticated Admin
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileNavOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[#c86227] text-white shadow-sm'
                    : 'text-[#4a3325] hover:bg-[#faf7f2] hover:text-[#2e1c14]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#c86227]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Secondary Links & Logout */}
        <div className="pt-4 border-t border-[#f4ebe1] space-y-1.5">
          <Link
            to="/"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-semibold text-[#6e5444] hover:bg-[#faf7f2] hover:text-[#2e1c14] transition"
          >
            <span>Customer Menu</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#8c6b53]" />
          </Link>

          <button
            onClick={logout}
            type="button"
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0">
        {activeTab === 'overview' && <AdminOverview onNavigateTab={setActiveTab} />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'menu' && <AdminMenu />}
        {activeTab === 'qr' && <QRGenerator />}
      </main>
    </div>
  );
};

export default AdminPage;

