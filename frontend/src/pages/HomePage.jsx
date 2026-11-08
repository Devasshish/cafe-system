import React, { useState, useEffect, useCallback } from 'react';
import HeroSection from '../components/HeroSection';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import SortDropdown from '../components/SortDropdown';
import MenuGrid from '../components/MenuGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import api from '../services/api';
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

const HomePage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeSort, setActiveSort] = useState('newest');

  // Debounce search input for silky-smooth experience
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch menu data from backend
  const fetchMenu = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        limit: 50, // Retrieve full active menu for client browsing
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      if (activeCategory) {
        params.category = activeCategory;
      }

      if (activeSort) {
        params.sort = activeSort;
      }

      const response = await api.get('/menu', { params });

      if (response.data && response.data.data) {
        setMenuItems(response.data.data);
      } else {
        setMenuItems([]);
      }
    } catch (err) {
      console.error('Failed to fetch menu:', err);
      setError(
        err.response?.data?.message ||
          'Unable to load the menu right now. Please check your backend connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeCategory, activeSort]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setActiveCategory('');
    setActiveSort('newest');
  };

  const handleAddToCart = (item) => {
    // In Task 6, provide immediate responsive feedback
    // Global Cart State will be wired up in Task 7
    console.log('Added to cart:', item.name, item.price);
  };

  return (
    <div className="w-full">
      {/* Full-width Hero Welcome Banner */}
      <HeroSection />

      {/* Main Menu & Controls Container */}
      <div id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16 pt-6 scroll-mt-20">
        {/* Menu Section Header (Matching Mockup exactly) */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <h2 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl text-[#331B0F] tracking-tight">
            Your can test all kinds of coffee collection right here
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#7D5F4C] leading-relaxed">
            Explore our delightful coffee collection, featuring rich blends from around the world. Each cup promises a unique flavor experience.
          </p>
        </div>

        {/* Category Horizontal Filter Pills matching mockup */}
        <div className="space-y-4">
          <CategoryFilter
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* Quick Search & Sort Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div className="max-w-md w-full">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onClear={() => setSearchTerm('')}
              />
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3">
              {!loading && !error && (
                <span className="text-xs font-medium text-[#777]">
                  Showing {menuItems.length} {menuItems.length === 1 ? 'item' : 'items'}
                </span>
              )}
              <SortDropdown activeSort={activeSort} onSortChange={setActiveSort} />
            </div>
          </div>
        </div>

        {/* Content Area: Loading / Error / Grid */}
        {loading ? (
          <LoadingSkeleton count={8} />
        ) : error ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-rose-200 shadow-sm max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#2e1c14] mb-2">
              Menu Unavailable
            </h3>
            <p className="text-xs sm:text-sm text-[#7d5f4c] mb-6 max-w-sm mx-auto leading-relaxed">
              {error}
            </p>
            <button
              onClick={fetchMenu}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c86227] text-white hover:bg-[#b0531e] transition-all text-xs sm:text-sm font-semibold shadow-md shadow-[#c86227]/25"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Connection</span>
            </button>
          </div>
        ) : (
          <MenuGrid
            items={menuItems}
            onAddToCart={handleAddToCart}
            onResetFilters={handleResetFilters}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
