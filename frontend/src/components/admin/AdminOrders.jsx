import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  Phone,
  User,
  X,
  Filter,
} from 'lucide-react';

const STATUS_OPTIONS = ['All', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (activeStatus !== 'All') {
        params.status = activeStatus;
      }
      const res = await api.get('/orders', { params });
      if (res.data && res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeStatus]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });

      if (res.data && res.data.success) {
        // Update local state
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#ebdccd] shadow-sm p-6 sm:p-8 text-[#2e1c14] space-y-6">
      {/* Title & Status Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f4ebe1] pb-5">
        <div>
          <h2 className="font-serif font-bold text-2xl text-[#2e1c14]">Order Management</h2>
          <p className="text-xs sm:text-sm text-[#7d5f4c] mt-1">
            Real-time kitchen order queue and live fulfillment status tracker.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="text-xs text-[#c86227] hover:underline font-semibold"
        >
          Refresh Queue ↻
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STATUS_OPTIONS.map((status) => {
          const isActive = activeStatus === status;
          return (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'bg-[#c86227] text-white shadow-sm'
                  : 'bg-[#faf7f2] text-[#4a3325] border border-[#e5d5c5] hover:bg-white'
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>

      {/* Orders List / Table */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#8c6b53]">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#8c6b53]">
          No orders found under {activeStatus} status.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#f4ebe1] text-[#8c6b53] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Order #</th>
                <th className="pb-3 font-semibold">Table</th>
                <th className="pb-3 font-semibold">Customer & Contact</th>
                <th className="pb-3 font-semibold">Items</th>
                <th className="pb-3 font-semibold">Total</th>
                <th className="pb-3 font-semibold">Status Action</th>
                <th className="pb-3 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4ebe1]">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-[#faf7f2] transition">
                  <td className="py-3 font-mono font-bold text-[#c86227]">
                    {order.orderNumber}
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-xs bg-[#f4ebe1] px-2 py-0.5 rounded-md border border-[#ebdccd]">
                      {order.tableNumber}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-[#2e1c14] block">
                      {order.customerName}
                    </span>
                    <span className="text-[11px] text-[#8c6b53] block">
                      {order.phoneNumber}
                    </span>
                  </td>
                  <td className="py-3 text-[#6e5444]">
                    {order.items?.map((item, idx) => (
                      <span key={idx} className="block text-[11px] truncate max-w-xs">
                        {item.quantity}× {item.name}
                      </span>
                    ))}
                  </td>
                  <td className="py-3 font-serif font-bold text-sm text-[#2e1c14]">
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </td>
                  <td className="py-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold focus:outline-none cursor-pointer border ${
                        order.orderStatus === 'Completed'
                          ? 'bg-purple-100 text-purple-900 border-purple-200'
                          : order.orderStatus === 'Ready'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                          : order.orderStatus === 'Preparing'
                          ? 'bg-blue-100 text-blue-900 border-blue-200'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-rose-100 text-rose-900 border-rose-200'
                          : 'bg-amber-100 text-amber-900 border-amber-200'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 text-[#6e5444] hover:text-[#c86227] hover:bg-white rounded-lg transition"
                      title="View full order details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-[#ebdccd] shadow-2xl animate-scale-in text-[#2e1c14]">
            <div className="flex items-center justify-between pb-3 border-b border-[#f4ebe1] mb-4">
              <div>
                <span className="font-mono font-bold text-sm text-[#c86227]">
                  {selectedOrder.orderNumber}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#2e1c14]">
                  Order Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-[#8c6b53] hover:text-[#2e1c14]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Cards */}
            <div className="space-y-3 mb-5 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#faf7f2] border border-[#ebdccd]">
                <MapPin className="w-4 h-4 text-[#c86227]" />
                <span className="text-[#8c6b53]">Table:</span>
                <span className="font-bold text-[#2e1c14]">{selectedOrder.tableNumber}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#faf7f2] border border-[#ebdccd]">
                <User className="w-4 h-4 text-[#c86227]" />
                <span className="text-[#8c6b53]">Customer:</span>
                <span className="font-bold text-[#2e1c14]">{selectedOrder.customerName}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#faf7f2] border border-[#ebdccd]">
                <Phone className="w-4 h-4 text-[#c86227]" />
                <span className="text-[#8c6b53]">Phone:</span>
                <span className="font-bold text-[#2e1c14]">{selectedOrder.phoneNumber}</span>
              </div>
            </div>

            {/* Items list */}
            <h4 className="text-xs font-semibold text-[#8c6b53] uppercase mb-2">
              Item Snapshots
            </h4>
            <div className="divide-y divide-[#f4ebe1] max-h-48 overflow-y-auto mb-4">
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="py-2 flex justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#c86227] mr-1.5">{item.quantity}×</span>
                    <span className="font-medium text-[#2e1c14]">{item.name}</span>
                    <span className="text-[10px] text-[#8c6b53] block">
                      ₹{Number(item.price).toFixed(2)} each
                    </span>
                  </div>
                  <span className="font-serif font-bold text-[#2e1c14]">
                    ₹{(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#f4ebe1] flex justify-between items-center font-serif font-bold text-base mb-6">
              <span>Total Amount</span>
              <span className="text-[#c86227] text-lg">
                ₹{Number(selectedOrder.totalAmount).toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 rounded-full bg-[#2e1c14] hover:bg-[#c86227] text-white text-xs font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

