import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import {
  Users,
  Search,
  Phone,
  ShoppingBag,
  IndianRupee,
  Calendar,
  MapPin,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  X,
  Clock,
  Sparkles,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [summary, setSummary] = useState({ totalCustomers: 0, repeatCustomers: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('orders'); // 'orders' | 'spent' | 'recent' | 'name'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [copiedPhone, setCopiedPhone] = useState(null);

  // Fetch customers from backend
  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/customers', {
        params: { sortBy, search: searchQuery.trim() || undefined },
      });
      if (res.data && res.data.success) {
        setCustomers(res.data.data || []);
        if (res.data.summary) {
          setSummary(res.data.summary);
        }
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
      setError(err.response?.data?.message || 'Failed to fetch customer directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, sortBy]);

  const handleCopyPhone = (phone, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Preparing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Ready':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name) => {
    if (!name) return 'C';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Avatar pastel background palette
  const getAvatarBg = (name) => {
    const colors = [
      'bg-amber-100 text-amber-900 border-amber-300',
      'bg-orange-100 text-orange-900 border-orange-300',
      'bg-emerald-100 text-emerald-900 border-emerald-300',
      'bg-blue-100 text-blue-900 border-blue-300',
      'bg-rose-100 text-rose-900 border-rose-300',
      'bg-purple-100 text-purple-900 border-purple-300',
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="bg-white rounded-3xl border border-[#ebdccd] shadow-sm p-6 sm:p-8 text-[#2e1c14] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f4ebe1] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#b23b14]/10 text-[#b23b14]">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="font-serif font-bold text-2xl text-[#2e1c14]">Customer Directory</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#7d5f4c] mt-1">
            Registered customer contact profiles, order frequency, and dining history.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          disabled={loading}
          type="button"
          className="inline-flex items-center gap-2 text-xs text-[#c86227] hover:text-[#962e0b] font-semibold cursor-pointer active:scale-95 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#ebdccd] flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#c86227]/10 flex items-center justify-center text-[#c86227]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#8c6b53] block">
              Unique Customers
            </span>
            <span className="text-2xl font-bold font-serif text-[#2e1c14]">
              {summary.totalCustomers}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#ebdccd] flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#8c6b53] block">
              Repeat Diners (2+ Orders)
            </span>
            <span className="text-2xl font-bold font-serif text-[#2e1c14]">
              {summary.repeatCustomers}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#ebdccd] flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#2e1c14]/10 flex items-center justify-center text-[#2e1c14]">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#8c6b53] block">
              Total Customer Spend
            </span>
            <span className="text-2xl font-bold font-serif text-[#2e1c14]">
              ₹{summary.totalRevenue.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8c6b53] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name or mobile number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#ebdccd] bg-[#faf7f2] text-xs sm:text-sm text-[#2e1c14] placeholder-[#8c6b53]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c86227]/30 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c6b53] hover:text-[#2e1c14]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8c6b53] font-medium hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-[#ebdccd] bg-[#faf7f2] text-xs font-semibold text-[#2e1c14] focus:outline-none focus:ring-2 focus:ring-[#c86227]/30 cursor-pointer"
          >
            <option value="orders">Most Orders First</option>
            <option value="spent">Highest Spend First</option>
            <option value="recent">Recently Active</option>
            <option value="name">Customer Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Customer Directory Table */}
      {loading ? (
        <div className="space-y-3 py-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-[#faf7f2] rounded-2xl animate-pulse border border-[#ebdccd]" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center text-xs text-rose-700">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-500" />
          <span>{error}</span>
        </div>
      ) : customers.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#faf7f2] border-2 border-dashed border-[#ebdccd]">
          <Users className="w-12 h-12 text-[#c86227]/30 mx-auto mb-3" />
          <h4 className="font-serif font-bold text-base text-[#2e1c14] mb-1">
            No Customers Found
          </h4>
          <p className="text-xs text-[#7d5f4c]">
            {searchQuery
              ? `No customer matches "${searchQuery}". Try a different name or number.`
              : 'Customer records will appear here as soon as orders are placed.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#ebdccd]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#faf7f2] border-b border-[#ebdccd] text-[11px] uppercase tracking-wider font-bold text-[#8c6b53]">
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Mobile Number</th>
                  <th className="py-3.5 px-4 text-center">Orders Count</th>
                  <th className="py-3.5 px-4 text-right">Total Spent</th>
                  <th className="py-3.5 px-4">Last Order</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebdccd]/60 text-xs text-[#2e1c14]">
                {customers.map((c) => {
                  const initials = getInitials(c.customerName);
                  const avatarClasses = getAvatarBg(c.customerName);

                  return (
                    <tr
                      key={c.customerKey || c.phoneNumber}
                      onClick={() => setSelectedCustomer(c)}
                      className="hover:bg-[#faf7f2]/80 transition cursor-pointer"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full border flex items-center justify-center font-serif font-bold text-xs flex-shrink-0 ${avatarClasses}`}
                          >
                            {initials}
                          </div>
                          <div>
                            <span className="font-serif font-bold text-sm text-[#2e1c14] block">
                              {c.customerName || 'Anonymous Customer'}
                            </span>
                            {c.totalOrders > 1 && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                                <Sparkles className="w-2.5 h-2.5" /> Repeat Diner
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Mobile Number */}
                      <td className="py-3.5 px-4 font-mono font-medium">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#faf7f2] border border-[#ebdccd]">
                          <Phone className="w-3 h-3 text-[#c86227]" />
                          <span>{c.phoneNumber}</span>
                          <button
                            onClick={(e) => handleCopyPhone(c.phoneNumber, e)}
                            title="Copy number"
                            className="text-[#8c6b53] hover:text-[#2e1c14] ml-1 p-0.5 rounded cursor-pointer"
                          >
                            {copiedPhone === c.phoneNumber ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Orders Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            c.totalOrders > 1
                              ? 'bg-[#c86227]/10 text-[#c86227]'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>
                            {c.totalOrders} {c.totalOrders === 1 ? 'Order' : 'Orders'}
                          </span>
                        </span>
                      </td>

                      {/* Total Spent */}
                      <td className="py-3.5 px-4 text-right font-bold font-serif text-[#2e1c14]">
                        ₹{Number(c.totalSpent || 0).toFixed(2)}
                      </td>

                      {/* Last Order Date */}
                      <td className="py-3.5 px-4 text-[#7d5f4c]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-[#8c6b53]" />
                          <span>{formatDate(c.lastOrderDate)}</span>
                        </div>
                      </td>

                      {/* View Details */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCustomer(c);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-[#faf7f2] hover:bg-[#c86227] text-[#2e1c14] hover:text-white border border-[#ebdccd] hover:border-[#c86227] transition"
                        >
                          <span>Orders</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Details Modal / Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-[#ebdccd] shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#f4ebe1] pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-serif font-bold text-base ${getAvatarBg(
                    selectedCustomer.customerName
                  )}`}
                >
                  {getInitials(selectedCustomer.customerName)}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#2e1c14]">
                    {selectedCustomer.customerName || 'Anonymous Customer'}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-xs text-[#8c6b53] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#c86227]" />
                      {selectedCustomer.phoneNumber}
                    </span>
                    {selectedCustomer.totalOrders > 1 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Loyal Customer
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-full text-[#8c6b53] hover:text-[#2e1c14] hover:bg-[#f4ebe1] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Highlights Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-[#faf7f2] border border-[#ebdccd]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8c6b53] block">
                  Total Orders
                </span>
                <span className="font-serif font-bold text-lg text-[#2e1c14]">
                  {selectedCustomer.totalOrders}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#faf7f2] border border-[#ebdccd]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8c6b53] block">
                  Total Spent
                </span>
                <span className="font-serif font-bold text-lg text-[#2e1c14]">
                  ₹{Number(selectedCustomer.totalSpent || 0).toFixed(2)}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#faf7f2] border border-[#ebdccd] col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8c6b53] block">
                  Tables Visited
                </span>
                <span className="text-xs font-semibold text-[#2e1c14] truncate block">
                  {selectedCustomer.tables?.length > 0
                    ? selectedCustomer.tables.join(', ')
                    : '—'}
                </span>
              </div>
            </div>

            {/* Orders History List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-sm text-[#2e1c14] flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-[#c86227]" />
                  <span>Past Orders History ({selectedCustomer.recentOrders?.length || 0})</span>
                </h4>
              </div>

              <div className="space-y-2.5">
                {(selectedCustomer.recentOrders || []).map((ord) => (
                  <div
                    key={ord._id || ord.orderNumber}
                    className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#ebdccd] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#2e1c14]">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(
                            ord.orderStatus
                          )}`}
                        >
                          {ord.orderStatus}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[#7d5f4c]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#c86227]" />
                          Table {ord.tableNumber || '—'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#8c6b53]" />
                          {formatDate(ord.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-serif font-bold text-sm text-[#2e1c14] block">
                        ₹{Number(ord.totalAmount || 0).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-[#8c6b53]">
                        {ord.itemsCount} {ord.itemsCount === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-[#f4ebe1] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 rounded-full bg-[#2e1c14] hover:bg-[#4a3325] text-white text-xs font-semibold cursor-pointer active:scale-95 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;

