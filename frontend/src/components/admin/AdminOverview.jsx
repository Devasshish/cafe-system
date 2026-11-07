import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  UtensilsCrossed,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

const AdminOverview = ({ onNavigateTab }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/stats');
      if (res.data && res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-[#ebdccd] h-32" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-3xl border border-rose-200 text-center">
        <p className="text-sm text-rose-700 mb-3">{error}</p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 rounded-full bg-[#c86227] text-white text-xs font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Revenue',
      value: `$${Number(stats?.totalSales || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 border-emerald-200',
      description: 'Calculated from stored orders',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'text-blue-700',
      bg: 'bg-blue-50 border-blue-200',
      description: 'All customer submissions',
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: 'text-amber-700',
      bg: 'bg-amber-50 border-amber-200',
      description: 'Awaiting preparation',
    },
    {
      title: 'Completed Orders',
      value: stats?.completedOrders || 0,
      icon: CheckCircle2,
      color: 'text-purple-700',
      bg: 'bg-purple-50 border-purple-200',
      description: 'Fulfilled orders',
    },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-3xl border border-[#ebdccd] shadow-sm flex items-start justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-[#8c6b53] uppercase tracking-wider block mb-1">
                  {kpi.title}
                </span>
                <span className="font-serif font-bold text-2xl sm:text-3xl text-[#2e1c14] block">
                  {kpi.value}
                </span>
                <span className="text-[11px] text-[#7d5f4c] mt-1 block">
                  {kpi.description}
                </span>
              </div>
              <div className={`p-3 rounded-2xl border ${kpi.bg} ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Menu Summary & Live Orders Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Orders Overview */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#ebdccd] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#f4ebe1] pb-4">
            <h3 className="font-serif font-bold text-lg text-[#2e1c14]">
              Recent Orders
            </h3>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('orders')}
                className="text-xs font-semibold text-[#c86227] hover:underline"
              >
                View All Orders →
              </button>
            )}
          </div>

          {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
            <p className="text-xs text-[#8c6b53] py-6 text-center">No orders recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#f4ebe1] text-[#8c6b53] uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Order #</th>
                    <th className="pb-3 font-semibold">Table</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Items</th>
                    <th className="pb-3 font-semibold">Total</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4ebe1]">
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-[#faf7f2] transition">
                      <td className="py-3 font-mono font-bold text-[#c86227]">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 font-medium text-[#2e1c14]">
                        {order.tableNumber}
                      </td>
                      <td className="py-3 text-[#4a3325]">
                        {order.customerName}
                      </td>
                      <td className="py-3 text-[#6e5444]">
                        {order.items?.length || 0} items
                      </td>
                      <td className="py-3 font-serif font-bold text-[#2e1c14]">
                        ${Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            order.orderStatus === 'Completed'
                              ? 'bg-purple-100 text-purple-800'
                              : order.orderStatus === 'Ready'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.orderStatus === 'Preparing'
                              ? 'bg-blue-100 text-blue-800'
                              : order.orderStatus === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions & Menu Health */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-[#ebdccd] p-6 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#2e1c14]">
              Menu Catalog Status
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-2xl bg-[#faf7f2] border border-[#ebdccd]">
                <span className="text-[#6e5444]">Total Menu Products</span>
                <span className="font-bold text-sm text-[#2e1c14]">
                  {stats?.totalMenuItems || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-2xl bg-[#faf7f2] border border-[#ebdccd]">
                <span className="text-[#6e5444]">Currently Available</span>
                <span className="font-bold text-sm text-emerald-700">
                  {stats?.availableMenuItems || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-2xl bg-[#faf7f2] border border-[#ebdccd]">
                <span className="text-[#6e5444]">Sold Out / Inactive</span>
                <span className="font-bold text-sm text-rose-700">
                  {(stats?.totalMenuItems || 0) - (stats?.availableMenuItems || 0)}
                </span>
              </div>
            </div>

            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('menu')}
                className="w-full py-2.5 rounded-full bg-[#2e1c14] hover:bg-[#c86227] text-white text-xs font-semibold transition"
              >
                Manage Menu Catalog
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;

