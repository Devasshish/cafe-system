import React, { useState } from 'react';
import { Heart, Plus, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80';

const MenuCard = ({ item }) => {
  const { addToCart, getItemQuantity } = useCart();
  const [imageSrc, setImageSrc] = useState(item.image || FALLBACK_IMAGE);
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const inCartQty = getItemQuantity(item._id);

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
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
    <div className="group bg-white rounded-2xl border border-[#ebebeb] hover:border-[#dedede] hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between relative">
      {/* Top Header: Availability Indicator & Heart Button */}
      <div className="flex items-center justify-between z-10 w-full mb-1">
        {/* Availability Badge */}
        <div>
          {item.isAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#eaf7ee] text-[#1b7a36]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1b7a36]" />
              Fresh
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700">
              <AlertCircle className="w-3 h-3" />
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Heart Icon Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          type="button"
          className="p-1.5 rounded-full hover:bg-black/5 transition text-[#222222]"
          aria-label="Add to favorites"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isLiked ? 'text-rose-500 fill-rose-500' : 'text-[#444444] hover:text-[#121212]'
            }`}
          />
        </button>
      </div>

      {/* Center Product Image Container with Clean isolated presentation */}
      <div className="w-full h-44 sm:h-48 flex items-center justify-center my-3 overflow-hidden rounded-xl bg-[#fafafa]">
        <img
          src={imageSrc}
          alt={item.name}
          onError={() => setImageSrc(FALLBACK_IMAGE)}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            !item.isAvailable ? 'grayscale-[60%] opacity-80' : ''
          }`}
        />
      </div>

      {/* Bottom Information Row matching reference image */}
      <div>
        <div className="border-t border-[#f0f0f0] pt-3.5 flex items-center justify-between">
          <h3 className="font-sans font-semibold text-base text-[#121212] tracking-tight line-clamp-1">
            {item.name}
          </h3>
          <span className="font-sans font-bold text-base text-[#121212] flex-shrink-0">
            ₹{Number(item.price).toFixed(2)}
          </span>
        </div>

        {/* Quick Add to Cart Action */}
        <div className="pt-3">
          <button
            onClick={handleAddToCartClick}
            disabled={!item.isAvailable}
            type="button"
            className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
              !item.isAvailable
                ? 'bg-[#f5f5f5] text-[#999] cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white'
                : inCartQty > 0
                ? 'bg-[#121212] text-white hover:bg-black'
                : 'bg-[#faf6f0] text-[#121212] border border-[#ebdccd] hover:bg-[#121212] hover:text-white hover:border-[#121212]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Added to Order</span>
              </>
            ) : inCartQty > 0 ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Cart ({inCartQty}) • Add More</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
