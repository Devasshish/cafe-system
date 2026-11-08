import React, { useState, useEffect, useCallback } from 'react';
import HeroSection from '../components/HeroSection';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import SortDropdown from '../components/SortDropdown';
import MenuGrid from '../components/MenuGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import api from '../services/api';
import { AlertCircle, RefreshCw, Sparkles, LayoutGrid, List, X } from 'lucide-react';

const HomePage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeSort, setActiveSort] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

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

          {/* Quick Search & Sort Bar (Optimized for Mobile & Desktop) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pt-2">
            {/* Search Input */}
            <div className="w-full sm:max-w-md">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onClear={() => setSearchTerm('')}
              />
            </div>

            {/* Filter Controls: Sort Dropdown & Grid/List View Toggle */}
            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
              {!loading && !error && (
                <span className="text-xs font-semibold text-[#8C6B53] hidden lg:inline">
                  {menuItems.length} {menuItems.length === 1 ? 'brew' : 'brews'}
                </span>
              )}

              {/* Sort Dropdown */}
              <SortDropdown activeSort={activeSort} onSortChange={setActiveSort} />

              {/* View Layout Switcher (Artisan Cards vs Clean List) */}
              <div className="inline-flex items-center p-1 rounded-xl bg-white border border-[#EBDDCC] shadow-xs flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  title="Card Grid View"
                  className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#B23B14] text-white shadow-xs'
                      : 'text-[#7D5F4C] hover:text-[#331B0F] hover:bg-[#FAF6F0]'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  title="Compact List View"
                  className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-[#B23B14] text-white shadow-xs'
                      : 'text-[#7D5F4C] hover:text-[#331B0F] hover:bg-[#FAF6F0]'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Indicators on Mobile & Desktop */}
          {(activeCategory || debouncedSearch) && (
            <div className="flex items-center gap-2 pt-1 flex-wrap text-xs animate-in fade-in duration-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6B53]">
                Filtering:
              </span>
              {activeCategory && (
                <button
                  onClick={() => setActiveCategory('')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B23B14]/10 text-[#B23B14] font-bold hover:bg-[#B23B14]/20 transition cursor-pointer"
                  title="Remove category filter"
                >
                  <span className="capitalize">{activeCategory}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {debouncedSearch && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B23B14]/10 text-[#B23B14] font-bold hover:bg-[#B23B14]/20 transition cursor-pointer"
                  title="Clear search term"
                >
                  <span>"{debouncedSearch}"</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-[#8C6B53] hover:text-[#B23B14] underline font-bold ml-1 cursor-pointer"
              >
                Reset all
              </button>
            </div>
          )}
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
            viewMode={viewMode}
            onAddToCart={handleAddToCart}
            onResetFilters={handleResetFilters}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
