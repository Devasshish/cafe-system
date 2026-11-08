import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80';

const CartItem = ({ item }) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  const lineTotal = (item.price * item.quantity).toFixed(2);

  return (
    <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-[#ebdccd] shadow-sm hover:border-[#dfc0a5] transition-all">
      {/* Thumbnail */}
      <img
        src={item.image || FALLBACK_IMAGE}
        alt={item.name}
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-[#f4ebe1] flex-shrink-0"
      />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-serif font-bold text-sm sm:text-base text-[#2e1c14] truncate">
          {item.name}
        </h4>
        <p className="text-xs text-[#8c6b53] mt-0.5">
          ₹{Number(item.price).toFixed(2)} each
        </p>

        {/* Quantity Controls on Mobile */}
        <div className="flex sm:hidden items-center justify-between mt-2 pt-2 border-t border-[#f4ebe1]">
          <div className="flex items-center gap-2 bg-[#f4ebe1] rounded-full px-2 py-0.5 border border-[#ebdccd]">
            <button
              onClick={() => decreaseQuantity(item._id)}
              className="w-6 h-6 flex items-center justify-center text-[#4a3325] hover:text-[#c86227]"
              aria-label="Decrease quantity"
            >
              {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-rose-600" /> : <Minus className="w-3.5 h-3.5" />}
            </button>
            <span className="font-bold text-xs text-[#2e1c14] min-w-[14px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => increaseQuantity(item._id)}
              className="w-6 h-6 flex items-center justify-center text-[#4a3325] hover:text-[#c86227]"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="font-serif font-bold text-sm text-[#2e1c14]">
            ₹{lineTotal}
          </span>
        </div>
      </div>

      {/* Desktop Controls */}
      <div className="hidden sm:flex items-center gap-3">
        <div className="flex items-center gap-2 bg-[#f4ebe1] rounded-full px-2.5 py-1 border border-[#ebdccd]">
          <button
            onClick={() => decreaseQuantity(item._id)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#4a3325] hover:bg-white hover:text-[#c86227] transition"
            aria-label="Decrease quantity"
          >
            {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-rose-600" /> : <Minus className="w-3.5 h-3.5" />}
          </button>
          <span className="font-bold text-sm text-[#2e1c14] min-w-[18px] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => increaseQuantity(item._id)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#4a3325] hover:bg-white hover:text-[#c86227] transition"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-20 text-right">
          <span className="font-serif font-bold text-base text-[#2e1c14] block">
            ₹{lineTotal}
          </span>
        </div>

        <button
          onClick={() => removeFromCart(item._id)}
          className="p-2 text-[#8c6b53] hover:text-rose-600 hover:bg-rose-50 rounded-full transition"
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;

