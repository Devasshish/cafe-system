import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import api from '../../services/api';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Loader2,
  Layers,
  ArrowUpDown,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  UtensilsCrossed,
} from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Form Fields
  const [label, setLabel] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Auto clear notifications
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories', {
        params: { includeInactive: true },
      });
      if (res.data && res.data.success) {
        setCategories(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to load categories',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setLabel('');
    setName('');
    setDescription('');
    setOrder(categories.length + 1);
    setIsActive(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setLabel(cat.label);
    setName(cat.name);
    setDescription(cat.description || '');
    setOrder(cat.order || 0);
    setIsActive(cat.isActive !== false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleLabelChange = (val) => {
    setLabel(val);
    // Auto-generate name slug if creating new
    if (!editingCategory) {
      setName(val.toLowerCase().trim().replace(/\s+/g, ' '));
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!label.trim()) {
      setFormError('Category display label is required.');
      return;
    }

    setFormLoading(true);

    try {
      const payload = {
        label: label.trim(),
        name: name.trim().toLowerCase(),
        description: description.trim(),
        order: Number(order) || 0,
        isActive,
      };

      if (editingCategory) {
        const res = await api.put(`/categories/${editingCategory._id}`, payload);
        if (res.data && res.data.success) {
          setNotification({
            type: 'success',
            message: `Category "${payload.label}" updated successfully!`,
          });
          setIsModalOpen(false);
          fetchCategories();
        }
      } else {
        const res = await api.post('/categories', payload);
        if (res.data && res.data.success) {
          setNotification({
            type: 'success',
            message: `Category "${payload.label}" created successfully!`,
          });
          setIsModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      console.error('Save category error:', err);
      setFormError(
        err.response?.data?.message || 'Failed to save category. Please check your inputs.'
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (cat) => {
    try {
      const res = await api.patch(`/categories/${cat._id}/toggle`);
      if (res.data && res.data.success) {
        setCategories((prev) =>
          prev.map((c) => (c._id === cat._id ? { ...c, isActive: !c.isActive } : c))
        );
        setNotification({
          type: 'success',
          message: `Category "${cat.label}" is now ${!cat.isActive ? 'Active' : 'Inactive'}`,
        });
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update category status',
      });
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (cat.totalItems > 0) {
      alert(
        `Cannot delete "${cat.label}" because it contains ${cat.totalItems} menu item(s). Reassign or delete those menu items first, or deactivate this category instead.`
      );
      return;
    }

    const confirm = window.confirm(
      `Are you sure you want to permanently delete category "${cat.label}"?`
    );
    if (!confirm) return;

    try {
      const res = await api.delete(`/categories/${cat._id}`);
      if (res.data && res.data.success) {
        setCategories((prev) => prev.filter((c) => c._id !== cat._id));
        setNotification({
          type: 'success',
          message: `Category "${cat.label}" deleted successfully!`,
        });
      }
    } catch (err) {
      console.error('Delete category error:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete category',
      });
    }
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        cat.label.toLowerCase().includes(search.toLowerCase()) ||
        cat.name.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
          ? cat.isActive
          : !cat.isActive;

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  // Metrics
  const activeCount = categories.filter((c) => c.isActive).length;
  const totalItemsCount = categories.reduce((sum, c) => sum + (c.totalItems || 0), 0);

  return (
    <div className="space-y-6 w-full animate-fade-in">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-md transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 rounded-full hover:bg-black/5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-[#ebdccd] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#faf7f2] text-[#B23B14] flex items-center justify-center flex-shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#8c6b53] block uppercase tracking-wider">
              Total Categories
            </span>
            <span className="font-serif font-black text-2xl text-[#2e1c14]">
              {categories.length}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#ebdccd] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#8c6b53] block uppercase tracking-wider">
              Active in Menu
            </span>
            <span className="font-serif font-black text-2xl text-[#2e1c14]">{activeCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#ebdccd] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#f4ebe1] text-[#7d5f4c] flex items-center justify-center flex-shrink-0">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#8c6b53] block uppercase tracking-wider">
              Assigned Items
            </span>
            <span className="font-serif font-black text-2xl text-[#2e1c14]">
              {totalItemsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Action Header & Search Controls */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#ebdccd] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#2e1c14]">
              Category Management
            </h2>
            <p className="text-xs text-[#7d5f4c]">
              Create, edit, organize, and toggle categories displayed on the customer menu.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#B23B14] hover:bg-[#962E0B] text-white text-xs font-bold shadow-sm active:scale-95 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#f4ebe1]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c6b53]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category by name or label..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#faf7f2] border border-[#ebdccd] text-xs font-medium text-[#2e1c14] focus:outline-none focus:ring-2 focus:ring-[#B23B14]/30"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c6b53] hover:text-[#2e1c14]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-2xl bg-[#faf7f2] border border-[#ebdccd] text-xs font-semibold text-[#4a3325] focus:outline-none focus:ring-2 focus:ring-[#B23B14]/30 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            <button
              onClick={fetchCategories}
              title="Refresh list"
              className="p-2.5 rounded-2xl border border-[#ebdccd] hover:bg-[#faf7f2] text-[#8c6b53] transition cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Category List / Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#ebdccd]">
          <Loader2 className="w-8 h-8 text-[#B23B14] animate-spin mx-auto mb-2" />
          <p className="text-xs text-[#8c6b53] font-medium">Loading categories...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#ebdccd] space-y-3">
          <Tag className="w-10 h-10 text-[#8c6b53] mx-auto opacity-50" />
          <h3 className="font-serif font-bold text-base text-[#2e1c14]">No Categories Found</h3>
          <p className="text-xs text-[#7d5f4c] max-w-sm mx-auto">
            {search
              ? `No categories match "${search}". Try a different keyword.`
              : 'No categories created yet. Click "Add New Category" above.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#ebdccd] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#ebdccd] bg-[#FAF6F0] text-[11px] font-bold text-[#8C6B53] uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Order</th>
                  <th className="py-3.5 px-4 sm:px-6">Category</th>
                  <th className="py-3.5 px-4 sm:px-6">Slug (Key)</th>
                  <th className="py-3.5 px-4 sm:px-6">Items Count</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4ebe1] text-xs">
                {filteredCategories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-[#faf7f2]/70 transition-colors">
                    {/* Display Order */}
                    <td className="py-4 px-4 sm:px-6">
                      <span className="w-7 h-7 rounded-full bg-[#f4ebe1] text-[#7d5f4c] font-bold text-xs flex items-center justify-center font-mono">
                        {cat.order || 0}
                      </span>
                    </td>

                    {/* Category Label & Description */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-serif font-bold text-sm text-[#2e1c14]">
                        {cat.label}
                      </div>
                      {cat.description && (
                        <p className="text-[11px] text-[#7d5f4c] line-clamp-1">
                          {cat.description}
                        </p>
                      )}
                    </td>

                    {/* Slug */}
                    <td className="py-4 px-4 sm:px-6">
                      <code className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#faf7f2] border border-[#ebdccd] text-[#8c6b53]">
                        {cat.name}
                      </code>
                    </td>

                    {/* Items Count */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#2e1c14]">
                          {cat.totalItems} {cat.totalItems === 1 ? 'item' : 'items'}
                        </span>
                        {cat.totalItems > 0 && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                            {cat.availableItems} available
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-4 sm:px-6">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(cat)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                          cat.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                        title="Click to toggle category status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cat.isActive ? 'bg-emerald-600' : 'bg-stone-400'
                          }`}
                        />
                        <span>{cat.isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-xl border border-[#ebdccd] text-[#8c6b53] hover:text-[#2e1c14] hover:bg-[#f4ebe1] transition cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat)}
                          className={`p-1.5 rounded-xl border transition cursor-pointer ${
                            cat.totalItems > 0
                              ? 'border-[#ebdccd] text-stone-400 opacity-60 hover:bg-stone-100'
                              : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                          }`}
                          title={
                            cat.totalItems > 0
                              ? `Cannot delete (${cat.totalItems} items assigned)`
                              : 'Delete Category'
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Create / Edit Category Modal (Rendered with createPortal) */}
      {/* ======================================================== */}
      {isModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-[#ebdccd] shadow-2xl animate-scale-in text-[#2e1c14] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3.5 border-b border-[#f4ebe1] mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#faf7f2] text-[#B23B14] flex items-center justify-center">
                    <Tag className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#2e1c14]">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full text-[#8c6b53] hover:text-[#2e1c14] hover:bg-[#faf7f2] transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#4a3325] mb-1">
                    Display Label *
                  </label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => handleLabelChange(e.target.value)}
                    placeholder="e.g. Signature Cold Brews"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#faf7f2] border border-[#e5d5c5] text-sm text-[#2e1c14] focus:outline-none focus:ring-2 focus:ring-[#B23B14]/40"
                    required
                  />
                  <p className="text-[10px] text-[#8c6b53] mt-1">
                    The customer-facing title displayed on category pills and tabs.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-[#4a3325] mb-1">
                    Slug / System Identifier *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. cold brew"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#faf7f2] border border-[#e5d5c5] text-xs font-mono text-[#2e1c14] focus:outline-none focus:ring-2 focus:ring-[#B23B14]/40"
                    required
                  />
                  <p className="text-[10px] text-[#8c6b53] mt-1">
                    Unique key used internally and for URL filters.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-[#4a3325] mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="2"
                    placeholder="Brief description of this collection..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#faf7f2] border border-[#e5d5c5] text-xs text-[#2e1c14] focus:outline-none focus:ring-2 focus:ring-[#B23B14]/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block font-semibold text-[#4a3325] mb-1">Display Order</label>
                    <input
                      type="number"
                      min="0"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#faf7f2] border border-[#e5d5c5] text-sm text-[#2e1c14] focus:outline-none focus:ring-2 focus:ring-[#B23B14]/40"
                    />
                  </div>

                  <div className="pt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4 rounded text-[#B23B14] focus:ring-[#B23B14]"
                      />
                      <span className="font-semibold text-xs text-[#2e1c14]">Active in Menu</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#f4ebe1]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 rounded-full border border-[#ebdccd] font-semibold text-xs text-[#6e5444] hover:bg-[#f4ebe1] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 py-2.5 rounded-full bg-[#B23B14] hover:bg-[#962E0B] text-white font-semibold text-xs shadow-md shadow-[#B23B14]/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {formLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default AdminCategories;

