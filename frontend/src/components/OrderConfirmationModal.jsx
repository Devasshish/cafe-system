import React from 'react';
import { CheckCircle2, Coffee, ArrowRight, MapPin, Phone, User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderConfirmationModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#faf7f2] rounded-3xl border border-[#ebdccd] shadow-2xl p-6 sm:p-8 text-[#2e1c14] animate-scale-in">
        {/* Success Icon Badge */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        {/* Title & Order ID */}
        <div className="text-center mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#c86227]">
            Order Confirmed
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#2e1c14] mt-1 mb-2">
            Thank you, {order.customerName}!
          </h2>
          <p className="text-xs sm:text-sm text-[#7d5f4c]">
            Your order has been received by our kitchen and is being freshly prepared.
          </p>

          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-2xl bg-[#f4ebe1] border border-[#ebdccd]">
            <span className="text-xs text-[#8c6b53] font-medium">Order Number:</span>
            <span className="font-mono font-bold text-sm sm:text-base text-[#c86227]">
              {order.orderNumber}
            </span>
          </div>
        </div>

        {/* Customer & Table Details */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-2xl border border-[#ebdccd] text-xs text-[#4a3325] mb-5">
          <div className="flex flex-col items-center text-center p-1 border-r border-[#f4ebe1]">
            <MapPin className="w-4 h-4 text-[#c86227] mb-1" />
            <span className="text-[10px] text-[#8c6b53] uppercase">Table</span>
            <span className="font-bold truncate max-w-full">{order.tableNumber}</span>
          </div>
          <div className="flex flex-col items-center text-center p-1 border-r border-[#f4ebe1]">
            <User className="w-4 h-4 text-[#c86227] mb-1" />
            <span className="text-[10px] text-[#8c6b53] uppercase">Customer</span>
            <span className="font-bold truncate max-w-full">{order.customerName}</span>
          </div>
          <div className="flex flex-col items-center text-center p-1">
            <Clock className="w-4 h-4 text-[#c86227] mb-1" />
            <span className="text-[10px] text-[#8c6b53] uppercase">Status</span>
            <span className="font-bold text-amber-700 capitalize">{order.orderStatus || 'Pending'}</span>
          </div>
        </div>

        {/* Order Items Snapshot Summary */}
        <div className="bg-white rounded-2xl border border-[#ebdccd] p-4 mb-6">
          <h4 className="text-xs font-semibold text-[#8c6b53] uppercase tracking-wider mb-3">
            Ordered Items ({order.items?.length || 0})
          </h4>
          <div className="divide-y divide-[#f4ebe1] max-h-40 overflow-y-auto pr-1">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#c86227]">{item.quantity}×</span>
                  <span className="text-[#2e1c14] font-medium">{item.name}</span>
                </div>
                <span className="font-serif font-bold text-[#2e1c14]">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-[#ebdccd] flex items-center justify-between font-serif font-bold text-base text-[#2e1c14]">
            <span>Total Amount</span>
            <span className="text-[#c86227] text-lg">${Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#c86227] text-white hover:bg-[#b0531e] font-semibold text-sm transition-all shadow-md shadow-[#c86227]/25"
          >
            <span>Back to Cafe Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;

