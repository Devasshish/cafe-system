import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  AlertCircle,
  Clock,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';

const CATEGORIES = ['hot coffee', 'cold coffee', 'tea', 'bakery', 'desserts', 'beverages'];

const AdminMenu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('hot coffee');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [preparationTime, setPreparationTime] = useState('5');
  const [isAvailable, setIsAvailable] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (search.trim()) params.search = search.trim();
      if (selectedCategory) params.category = selectedCategory;

      const res = await api.get('/menu', { params });
      if (res.data && res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, selectedCategory]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setName('');
    setPrice('');
    setCategory('hot coffee');
    setDescription('');
    setImage('');
    setPreparationTime('5');
    setIsAvailable(true);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setName(item.name);
    setPrice(String(item.price));
    setCategory(item.category);
    setDescription(item.description || '');
    setImage(item.image || '');
    setPreparationTime(String(item.preparationTime || 5));
    setIsAvailable(item.isAvailable);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Item name is required');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setFormError('Price must be a positive number');
      return;
    }

    setFormLoading(true);
    setFormError('');

    const payload = {
      name: name.trim(),
      price: numPrice,
      category: category.trim().toLowerCase(),
      description: description.trim(),
      image: image.trim(),
      preparationTime: parseInt(preparationTime, 10) || 5,
      isAvailable,
    };

    try {
      if (editingItem) {
        await api.put(`/menu/${editingItem._id}`, payload);
      } else {
        await api.post('/menu', payload);
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save menu item');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await api.put(`/menu/${item._id}`, {
        isAvailable: !item.isAvailable,
      });
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, isAvailable: !i.isAvailable } : i))
      );
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to delete '${item.name}'?`)) return;

    try {
      await api.delete(`/menu/${item._id}`);
      setItems((prev) => prev.filter((i) => i._id !== item._id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#ebdccd] shadow-sm p-6 sm:p-8 text-[#2e1c14] space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f4ebe1] pb-5">
        <div>
          <h2 className="font-serif font-bold text-2xl text-[#2e1c14]">Menu Management</h2>
          <p className="text-xs sm:text-sm text-[#7d5f4c] mt-1">
            Create, update, toggle availability, and manage your cafe catalog.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c86227] hover:bg-[#b0531e] text-white text-xs sm:text-sm font-semibold transition shadow-md shadow-[#c86227]/25"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Menu Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8c6b53] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items by name or description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#faf7f2] border border-[#e5d5c5] text-xs sm:text-sm text-[#2e1c14] focus:outline-none focus:ring-2 focus:ring-[#c86227]/40"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 rounded-2xl bg-[#faf7f2] border border-[#e5d5c5] text-xs sm:text-sm text-[#4a3325] capitalize focus:outline-none focus:ring-2 focus:ring-[#c86227]/40 cursor-pointer"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Menu Table */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#8c6b53]">Loading menu items...</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#8c6b53]">No menu items found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#f4ebe1] text-[#8c6b53] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Item</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Price</th>
                <th className="pb-3 font-semibold">Prep Time</th>
                <th className="pb-3 font-semibold">Availability</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4ebe1]">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-[#faf7f2] transition">
                  <td className="py-3 flex items-center gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'}
                      alt={item.name}
                      className="w-10 h-10 rounded-xl object-cover bg-[#f4ebe1] flex-shrink-0"
                    />
                    <div>
                      <span className="font-bold text-sm text-[#2e1c14] block">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-[#8c6b53] line-clamp-1 max-w-xs">
                        {item.description}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 capitalize text-[#4a3325]">{item.category}</td>
                  <td className="py-3 font-serif font-bold text-sm text-[#2e1c14]">
                    ${Number(item.price).toFixed(2)}
                  </td>
                  <td className="py-3 text-[#6e5444]">{item.preparationTime || 5} mins</td>
                  <td className="py-3">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      type="button"
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
                        item.isAvailable
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      <span>{item.isAvailable ? 'Available' : 'Sold Out'}</span>
                    </button>
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 text-[#6e5444] hover:text-[#c86227] hover:bg-white rounded-lg transition"
                      title="Edit item"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="p-1.5 text-[#6e5444] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-[#ebdccd] shadow-2xl animate-scale-in text-[#2e1c14] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#f4ebe1] mb-5">
              <h3 className="font-serif font-bold text-xl text-[#2e1c14]">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-[#8c6b53] hover:text-[#2e1c14]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#4a3325] mb-1">Item Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cinnamon Dolce Latte"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#faf7f2] border border-[#e5d5c5] text-sm text-[#2e1c14] focus:outline-none focus:ring-2 focus:ring-[#c86227]/40"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4a3325] mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="4.95"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#faf7f2] border border-[#e5d5c5] text-sm text-[#2e1c14] focus:outline-none focus:ring-2 focus:ring-[#c86227]/40"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#4a3325] mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#faf7f2] border border-[#e5d5c5] text-sm text-[#2e1c14] capitalize focus:outline-none focus:ring-2 focus:ring-[#c86227]/40 cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4a3325] mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="2"
                  placeholder="Artisan description of flavor notes and ingredients..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#faf7f2] border border-[#e5d5c5] text-sm text-[#2e1c14] focus:outline-none focus:ring-2 focus:ring-[#c86227]/40"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4a3325] mb-1">Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#faf7f2] border border-[#e5d5c5] text-sm text-[#2e1c14] focus:outline-none focus:ring-2 focus:ring-[#c86227]/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-semibold text-[#4a3325] mb-1">Prep Time (mins)</label>
                  <input
                    type="number"
                    min="0"
                    value={preparationTime}
                    onChange={(e) => setPreparationTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#faf7f2] border border-[#e5d5c5] text-sm text-[#2e1c14] focus:outline-none focus:ring-2 focus:ring-[#c86227]/40"
                  />
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="w-4 h-4 rounded text-[#c86227] focus:ring-[#c86227]"
                    />
                    <span className="font-semibold text-sm text-[#2e1c14]">Available to Order</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#f4ebe1]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-full border border-[#ebdccd] font-semibold text-xs text-[#6e5444] hover:bg-[#f4ebe1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-3 rounded-full bg-[#c86227] hover:bg-[#b0531e] text-white font-semibold text-xs shadow-md shadow-[#c86227]/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{editingItem ? 'Save Changes' : 'Create Item'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;

