import React, { useState } from 'react';
import { Plus, Check, Clock, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80';

const MenuCard = ({ item }) => {
  const { addToCart, getItemQuantity } = useCart();
  const [imageSrc, setImageSrc] = useState(item.image || FALLBACK_IMAGE);
  const [isAdded, setIsAdded] = useState(false);

  const inCartQty = getItemQuantity(item._id);

  const handleAddToCartClick = () => {
    if (!item.isAvailable) return;
    const res = addToCart(item, 1);

    if (res.success) {
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 1000);
    }
  };

  return (
    <div className="group bg-white rounded-3xl border border-[#ebdccd] hover:border-[#dfc0a5] hover:shadow-xl transition-all duration-300 p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Image Container with Badges */}
        <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-[#f4ebe1] mb-3.5">
          <img
            src={imageSrc}
            alt={item.name}
            onError={() => setImageSrc(FALLBACK_IMAGE)}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              !item.isAvailable ? 'grayscale-[50%] opacity-85' : ''
            }`}
          />

          {/* Availability Indicator */}
          <div className="absolute top-2.5 left-2.5">
            {item.isAvailable ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/90 text-white backdrop-blur-sm shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Available
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-600/95 text-white backdrop-blur-sm shadow-sm">
                <AlertCircle className="w-3 h-3" />
                Sold Out
              </span>
            )}
          </div>

          {/* Category Pill */}
          <div className="absolute top-2.5 right-2.5">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#2e1c14]/80 text-[#faf7f2] backdrop-blur-sm capitalize">
              {item.category}
            </span>
          </div>
        </div>

        {/* Content Info */}
        <div className="space-y-1.5 px-1">
          <div className="flex items-center justify-between text-xs text-[#8c6b53] mb-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#c86227]" />
              <span>{item.preparationTime || 5} mins</span>
            </span>

            {inCartQty > 0 && (
              <span className="text-[11px] font-semibold text-[#c86227] bg-[#f4ebe1] px-2 py-0.5 rounded-full border border-[#ebdccd]">
                {inCartQty} in cart
              </span>
            )}
          </div>

          <h3 className="font-serif font-bold text-base sm:text-lg text-[#2e1c14] leading-snug group-hover:text-[#c86227] transition-colors line-clamp-1">
            {item.name}
          </h3>

          <p className="text-xs text-[#6e5444] line-clamp-2 leading-relaxed">
            {item.description || 'Deliciously handcrafted with premium ingredients.'}
          </p>
        </div>
      </div>

      {/* Price & Add to Cart Action */}
      <div className="mt-4 pt-3 border-t border-[#f4ebe1] px-1 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-semibold text-[#8c6b53] block">Price</span>
          <span className="font-serif font-bold text-lg sm:text-xl text-[#2e1c14]">
            ${Number(item.price).toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleAddToCartClick}
          disabled={!item.isAvailable}
          type="button"
          className={`relative inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm ${
            !item.isAvailable
              ? 'bg-[#e5d5c5] text-[#8c6b53] cursor-not-allowed opacity-75'
              : isAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-[#c86227] text-white hover:bg-[#b0531e] active:scale-95 shadow-[#c86227]/20 shadow-md'
          }`}
          aria-label={item.isAvailable ? `Add ${item.name} to cart` : `${item.name} is unavailable`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 animate-scale-in" />
              <span>Added</span>
            </>
          ) : !item.isAvailable ? (
            <span>Sold Out</span>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
