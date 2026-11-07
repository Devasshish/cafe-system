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
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <HeroSection />

      {/* Search, Filter & Sort Controls Section */}
      <section className="space-y-4">
        {/* Top Control Bar: Search Input & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
          />
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <span className="sm:hidden text-xs font-semibold text-[#8c6b53]">Sort:</span>
            <SortDropdown activeSort={activeSort} onSortChange={setActiveSort} />
          </div>
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="pt-1">
          <CategoryFilter
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>
      </section>

      {/* Menu Section Header with Count */}
      <div className="flex items-center justify-between border-b border-[#ebdccd] pb-3 pt-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#c86227]" />
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#2e1c14] tracking-tight">
            {activeCategory
              ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Selection`
              : 'Our Complete Cafe Menu'}
          </h2>
        </div>

        {!loading && !error && (
          <span className="text-xs font-medium text-[#8c6b53] bg-[#f4ebe1] px-3 py-1 rounded-full border border-[#ebdccd]">
            {menuItems.length} {menuItems.length === 1 ? 'item' : 'items'}
          </span>
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
          onAddToCart={handleAddToCart}
          onResetFilters={handleResetFilters}
        />
      )}
    </div>
  );
};

export default HomePage;
