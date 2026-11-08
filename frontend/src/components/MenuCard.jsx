import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Plus, Minus, Check, Clock, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80';

const MenuCard = ({ item, variant = 'card' }) => {
  const { addToCart, increaseQuantity, decreaseQuantity, getItemQuantity } = useCart();
  const [imageSrc, setImageSrc] = useState(item.image || FALLBACK_IMAGE);
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
      }, 900);
    }
  };

  /* -------------------------------------------------------------
   * VARIANT B: Compact Horizontal List Row
   * ------------------------------------------------------------- */
  if (variant === 'list') {
    return (
      <div className="group bg-white rounded-2xl border border-[#EBDDCC] hover:border-[#C86227]/40 shadow-xs hover:shadow-[0_12px_24px_rgba(51,27,15,0.06)] transition-all duration-300 p-3.5 sm:p-4 flex items-center justify-between gap-4">
        {/* Left: Square Thumbnail */}
        <div className="relative w-22 h-22 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#F4EBE1]/60 flex-shrink-0">
          <img
            src={imageSrc}
            alt={item.name}
            onError={() => setImageSrc(FALLBACK_IMAGE)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {item.category && (
            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs">
              {item.category}
            </span>
          )}
        </div>

        {/* Center: Details */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-serif font-black text-base sm:text-lg text-[#331B0F] tracking-tight group-hover:text-[#B23B14] transition-colors">
              {item.name}
            </h3>
            {item.isAvailable && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#EAF3EB] text-[#2C6E49]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2C6E49]" />
                Fresh
              </span>
            )}
          </div>
          <p className="text-xs text-[#7D5F4C] line-clamp-2 leading-relaxed">
            {item.description || 'Handcrafted artisan roast prepared fresh upon order by our barista.'}
          </p>
          <div className="flex items-center gap-3 mt-2 text-[11px] text-[#7D5F4C]">
            <span className="inline-flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-[#B23B14]" />
              {item.preparationTime || 5} min
            </span>
          </div>
        </div>

        {/* Right: Price & Stepper / Add Button */}
        <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
          <span className="font-serif font-black text-xl sm:text-2xl text-[#B23B14] leading-none">
            ₹{Number(item.price).toFixed(2)}
          </span>

          {!item.isAvailable ? (
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-400 cursor-not-allowed">
              Sold Out
            </span>
          ) : inCartQty > 0 ? (
            <div className="inline-flex items-center bg-[#331B0F] text-[#FAF6F0] rounded-full p-1 shadow-sm">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  decreaseQuantity(item._id);
                }}
                type="button"
                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition text-white cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <Link
                to="/cart"
                className="px-2 select-none group/tray cursor-pointer flex flex-col items-center leading-none"
                title="View Coffee Tray"
              >
                <span className="font-sans font-black text-[11px] sm:text-xs text-white group-hover/tray:text-[#F8DED2]">
                  {inCartQty} on Tray
                </span>
                <span className="text-[7px] text-[#CBB7A2] group-hover/tray:text-white uppercase font-bold tracking-widest mt-0.5">
                  View →
                </span>
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  increaseQuantity(item._id);
                }}
                type="button"
                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-[#B23B14] hover:bg-[#c5441b] active:scale-90 transition text-white cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCartClick}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-95 ${
                isAdded
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#B23B14] hover:bg-[#962E0B] text-white shadow-[#B23B14]/20'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Add to Tray</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * VARIANT A: Modern Artisan Card (Default)
   * ------------------------------------------------------------- */
  return (
    <div className="group bg-white rounded-[26px] border border-[#EBDDCC] hover:border-[#C86227]/40 shadow-xs hover:shadow-[0_16px_36px_rgba(51,27,15,0.09)] transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      {/* Visual Header: Full-bleed image with layered glassmorphism badges */}
      <div className="relative w-full h-52 overflow-hidden bg-[#F4EBE1]/60">
        <img
          src={imageSrc}
          alt={item.name}
          onError={() => setImageSrc(FALLBACK_IMAGE)}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 ${
            !item.isAvailable ? 'grayscale-[60%] opacity-70' : ''
          }`}
        />

        {/* Soft bottom image gradient for smooth transition */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

        {/* Top Floating Glass Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {item.category ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/55 text-white/95 backdrop-blur-md border border-white/15 shadow-sm">
              {item.category}
            </span>
          ) : (
            <span />
          )}

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-[#331B0F] backdrop-blur-md shadow-sm border border-white/40">
            <Clock className="w-3 h-3 text-[#B23B14]" />
            <span>{item.preparationTime || 5} min</span>
          </span>
        </div>

        {/* Bottom Floating Status Badge */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          {item.isAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-[#2C6E49] backdrop-blur-md shadow-xs border border-white/50">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2C6E49] animate-pulse" />
              Freshly Brewed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-900/80 text-stone-200 backdrop-blur-md shadow-xs">
              <AlertCircle className="w-3 h-3 text-rose-400" />
              Sold Out
            </span>
          )}
        </div>
      </div>

      {/* Content Body: Title, Description & Bottom Price/Action Row */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif font-black text-xl text-[#331B0F] tracking-tight group-hover:text-[#B23B14] transition-colors leading-snug line-clamp-1">
            {item.name}
          </h3>
          <p className="text-xs text-[#7D5F4C] line-clamp-2 mt-1.5 leading-relaxed min-h-[34px]">
            {item.description || 'Handcrafted artisan roast prepared fresh upon order by our barista.'}
          </p>
        </div>

        {/* Bottom Row: Price on Left, Action / Stepper on Right */}
        <div className="pt-4 mt-3 border-t border-[#F2E9DE] flex items-center justify-between gap-3">
          {/* Price Stack */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A18270] leading-none mb-0.5">
              Price
            </span>
            <span className="font-serif font-black text-2xl text-[#B23B14] tracking-tight leading-none">
              ₹{Number(item.price).toFixed(2)}
            </span>
          </div>

          {/* Action Button or Interactive Tray Stepper */}
          <div className="flex-shrink-0">
            {!item.isAvailable ? (
              <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold bg-stone-100 text-stone-400 cursor-not-allowed">
                Sold Out
              </span>
            ) : inCartQty > 0 ? (
              <div className="inline-flex items-center bg-[#331B0F] text-[#FAF6F0] rounded-full p-1 shadow-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    decreaseQuantity(item._id);
                  }}
                  type="button"
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition text-white cursor-pointer"
                  aria-label="Decrease quantity"
                  title="Remove one"
                >
                  <Minus className="w-3 h-3" />
                </button>

                <Link
                  to="/cart"
                  className="flex flex-col items-center leading-none px-2.5 py-0.5 group/tray cursor-pointer select-none"
                  title="Click to view Coffee Tray & checkout"
                >
                  <span className="font-sans font-black text-xs text-white group-hover/tray:text-[#F8DED2]">
                    {inCartQty} on Tray
                  </span>
                  <span className="text-[8px] text-[#CBB7A2] group-hover/tray:text-white tracking-widest uppercase font-bold mt-0.5">
                    View →
                  </span>
                </Link>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    increaseQuantity(item._id);
                  }}
                  type="button"
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-[#B23B14] hover:bg-[#c5441b] active:scale-90 transition text-white cursor-pointer"
                  aria-label="Increase quantity"
                  title="Add one more"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCartClick}
                type="button"
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-md active:scale-95 ${
                  isAdded
                    ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                    : 'bg-[#B23B14] hover:bg-[#962E0B] text-white shadow-[#B23B14]/25 hover:shadow-lg hover:shadow-[#B23B14]/35'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Add to Tray</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
