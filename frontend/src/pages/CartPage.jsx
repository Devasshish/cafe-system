import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTable } from '../context/TableContext';
import CartItem from '../components/CartItem';
import OrderConfirmationModal from '../components/OrderConfirmationModal';
import api from '../services/api';
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Utensils,
  User,
  Phone,
  Hash,
} from 'lucide-react';

const CartPage = () => {
  const { cartItems, totalCount, subtotal, totalAmount, clearCart } = useCart();
  const { tableNumber: contextTable, setTableNumber: updateContextTable } = useTable();
  const [searchParams] = useSearchParams();

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tableNumber, setTableNumber] = useState(contextTable || '');

  // UI & Submission state
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Sync with context or URL parameter
  useEffect(() => {
    const tableParam = searchParams.get('table');
    if (tableParam && tableParam.trim()) {
      setTableNumber(tableParam.trim().toUpperCase());
      updateContextTable(tableParam.trim().toUpperCase());
    } else if (contextTable) {
      setTableNumber(contextTable);
    }
  }, [searchParams, contextTable, updateContextTable]);

  // Client-side validation before sending request
  const validateForm = () => {
    const errors = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      errors.customerName = 'Please enter your name (minimum 2 characters)';
    }

    const phoneRegex = /^\+?[0-9\s-]{7,15}$/;
    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required for order updates';
    } else if (!phoneRegex.test(phoneNumber.trim())) {
      errors.phoneNumber = 'Please enter a valid phone number (7-15 digits)';
    }

    if (!tableNumber.trim()) {
      errors.tableNumber = 'Please enter your table number';
    }

    if (cartItems.length === 0) {
      errors.cart = 'Your cart is empty. Please add items before placing an order.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent duplicate submissions

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      // Send item IDs and quantities ONLY (never trust client prices)
      const orderPayload = {
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        tableNumber: tableNumber.trim().toUpperCase(),
        items: cartItems.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
        })),
      };

      updateContextTable(tableNumber.trim().toUpperCase());

      const response = await api.post('/orders', orderPayload);

      if (response.data && response.data.success) {
        const newOrder = response.data.data;
        setConfirmedOrder(newOrder);

        // Clear cart ONLY after verified successful order creation
        clearCart();
      } else {
        throw new Error(response.data?.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.map((e) => e.message).join(', ') ||
        'Could not complete order. Please check that all items are available.';
      setApiError(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Empty Cart Screen
  if (cartItems.length === 0 && !confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-3xl border border-[#ebdccd] p-8 sm:p-12 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#f4ebe1] text-[#c86227] flex items-center justify-center mx-auto mb-5 shadow-sm">
            <ShoppingBag className="w-10 h-10 text-[#c86227]" />
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#2e1c14] mb-3">
            Your Cart is Empty
          </h2>
          <p className="text-sm text-[#7d5f4c] mb-8 max-w-md mx-auto leading-relaxed">
            Looks like you haven't added any handcrafted coffees or fresh pastries yet.
            Explore our artisan menu to get started!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#c86227] text-white hover:bg-[#b0531e] font-semibold text-sm transition-all shadow-md shadow-[#c86227]/25"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Cafe Menu</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Clear Action */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#8c6b53] hover:text-[#c86227] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>

        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs text-[#8c6b53] hover:text-rose-600 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {/* Two Column Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[#ebdccd] pb-3">
            <h1 className="font-serif font-bold text-2xl text-[#2e1c14]">
              Order Items ({totalCount})
            </h1>
            <span className="text-xs text-[#8c6b53]">Review items before checkout</span>
          </div>

          <div className="space-y-3">
            {cartItems.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>
        </div>

        {/* Right Column: Checkout Form & Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-[#ebdccd] p-6 sm:p-7 shadow-sm sticky top-28 space-y-6">
            <div className="border-b border-[#f4ebe1] pb-4">
              <h2 className="font-serif font-bold text-xl text-[#2e1c14] flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#c86227]" />
                <span>Table Checkout</span>
              </h2>
              <p className="text-xs text-[#8c6b53] mt-1">
                Enter your details to send your order straight to the cafe barista.
              </p>
            </div>

            {/* Error Notification Banner */}
            {apiError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{apiError}</span>
              </div>
            )}

            {/* Checkout Input Form */}
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold text-[#4a3325] mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#c86227]" />
                  <span>Customer Name *</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (fieldErrors.customerName) {
                      setFieldErrors((prev) => ({ ...prev, customerName: null }));
                    }
                  }}
                  placeholder="e.g. Sarah Connor"
                  className={`w-full px-3.5 py-2.5 rounded-2xl bg-[#faf7f2] border text-xs sm:text-sm text-[#2e1c14] placeholder-[#a68c78] focus:outline-none focus:ring-2 focus:ring-[#c86227]/40 transition ${
                    fieldErrors.customerName ? 'border-rose-400 bg-rose-50/50' : 'border-[#e5d5c5]'
                  }`}
                />
                {fieldErrors.customerName && (
                  <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.customerName}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-[#4a3325] mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#c86227]" />
                  <span>Phone Number *</span>
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (fieldErrors.phoneNumber) {
                      setFieldErrors((prev) => ({ ...prev, phoneNumber: null }));
                    }
                  }}
                  placeholder="e.g. +1 555-0199 or 9876543210"
                  className={`w-full px-3.5 py-2.5 rounded-2xl bg-[#faf7f2] border text-xs sm:text-sm text-[#2e1c14] placeholder-[#a68c78] focus:outline-none focus:ring-2 focus:ring-[#c86227]/40 transition ${
                    fieldErrors.phoneNumber ? 'border-rose-400 bg-rose-50/50' : 'border-[#e5d5c5]'
                  }`}
                />
                {fieldErrors.phoneNumber && (
                  <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.phoneNumber}</p>
                )}
              </div>

              {/* Table Number */}
              <div>
                <label className="block text-xs font-semibold text-[#4a3325] mb-1.5 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-[#c86227]" />
                  <span>Table Number *</span>
                </label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => {
                    setTableNumber(e.target.value);
                    if (fieldErrors.tableNumber) {
                      setFieldErrors((prev) => ({ ...prev, tableNumber: null }));
                    }
                  }}
                  placeholder="e.g. Table 4 or Bar-2"
                  className={`w-full px-3.5 py-2.5 rounded-2xl bg-[#faf7f2] border text-xs sm:text-sm text-[#2e1c14] placeholder-[#a68c78] focus:outline-none focus:ring-2 focus:ring-[#c86227]/40 transition ${
                    fieldErrors.tableNumber ? 'border-rose-400 bg-rose-50/50' : 'border-[#e5d5c5]'
                  }`}
                />
                {fieldErrors.tableNumber && (
                  <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.tableNumber}</p>
                )}
              </div>

              {/* Order Bill Breakdown */}
              <div className="pt-4 border-t border-[#f4ebe1] space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-[#6e5444]">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-[#2e1c14]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#6e5444]">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-[#2e1c14]">$0.00</span>
                </div>
                <div className="flex justify-between font-serif font-bold text-base sm:text-lg text-[#2e1c14] pt-2 border-t border-[#ebdccd]">
                  <span>Order Total</span>
                  <span className="text-[#c86227]">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full mt-2 py-3.5 px-4 rounded-full bg-[#c86227] hover:bg-[#b0531e] text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-[#c86227]/25 disabled:bg-[#d5c3b5] disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Place Order (${totalAmount.toFixed(2)})</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-[#8c6b53] mt-2">
                Order totals are verified and calculated securely on the server.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Success Confirmation Modal */}
      {confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
        />
      )}
    </div>
  );
};

export default CartPage;

