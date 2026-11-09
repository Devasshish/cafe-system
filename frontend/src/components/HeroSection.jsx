import React from 'react';
import { MapPin } from 'lucide-react';
import { useTable } from '../context/TableContext';

const HeroSection = () => {
  const { tableNumber, hasTable } = useTable();

  const handleScrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#F6EFE5] pt-4 pb-12 sm:pt-6 sm:pb-16">
      {/* Subtle Dot Matrix Background Pattern across full width matching warm cream canvas */}
      <div
        className="absolute inset-0 pointer-events-none opacity-35"
        style={{
          backgroundImage: 'radial-gradient(#cbb7a2 1.3px, transparent 1.3px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating Organic Wavy Ribbon SVG across the hero */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none stroke-[#e07a52]/40"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 650"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M-50 260 C 260 160, 480 390, 800 220 C 1050 100, 1260 320, 1490 200"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M-30 380 C 350 460, 720 210, 1100 360 C 1280 430, 1390 300, 1480 280"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>

      {/* Ambient Floating Coffee Beans in background (Right side only; Left side removed so no coffee touches Single-Origin text) */}
      <div className="absolute top-10 right-12 sm:right-28 w-5 h-7 rounded-[50%] bg-[#331B0F] rotate-45 shadow-md opacity-80 pointer-events-none" />
      <div className="absolute top-1/2 right-8 sm:right-20 w-4 h-6 rounded-[50%] bg-[#331B0F] -rotate-12 shadow-md opacity-75 pointer-events-none" />
      <div className="absolute bottom-16 right-20 sm:right-40 w-3.5 h-5 rounded-[50%] bg-[#331B0F] -rotate-45 shadow-md opacity-65 pointer-events-none hidden sm:block" />

      {/* 
        LEFT-SIDE HIGHLIGHTED ARTISAN NOTE:
        - Positioned cleanly with dedicated padding
        - Clean background guarantee NO background elements overlap it
      */}
      <div className="w-full md:w-auto md:absolute md:left-3 lg:left-5 xl:left-8 md:top-1/2 md:-translate-y-1/2 md:max-w-[195px] lg:max-w-[225px] xl:max-w-[250px] text-left z-20 px-4 sm:px-6 md:px-0 my-2 md:my-0 pointer-events-auto">
        <div className="space-y-1 border-l-[3px] border-[#B23B14] pl-3 py-1 bg-[#F6EFE5]/95 md:bg-[#F6EFE5]/80 backdrop-blur-sm rounded-r-xl shadow-xs">
          <span className="font-sans font-black text-[11px] sm:text-xs uppercase tracking-wider text-[#B23B14] block">
            Single-Origin
          </span>
          <p className="font-sans font-extrabold text-[13px] sm:text-sm lg:text-[15px] text-[#331B0F] leading-snug">
            Recharge your senses with fair-trade artisan roasts, single-origin pour-overs, and handcrafted cold brews.
          </p>
        </div>
      </div>

      {/* Main Hero Content Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Table indicator pill badge if scanned (hidden on mobile screen as requested) */}
        {hasTable && (
          <div className="hidden lg:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#B23B14] text-white text-xs font-bold mb-1 shadow-md animate-bounce z-20">
            <MapPin className="w-3.5 h-3.5" />
            <span>Ordering for Table {tableNumber}</span>
          </div>
        )}

        {/* Top Tagline (Tightly spaced to headline) */}
        <p className="font-serif font-bold text-lg sm:text-2xl md:text-3xl text-[#331B0F] tracking-tight -mb-1 sm:-mb-2 md:-mb-3 select-none leading-none z-20">
          An Elevated
        </p>

        {/* 
          CENTRAL COMPOSITION: 
          - "Coffee Experience" headline at lower z-index (z-10) with enlarged typography
          - BIG COFFEE CUP layered ON TOP with HIGHER Z-INDEX (z-20)
        */}
        <div className="relative w-full flex flex-col items-center justify-center min-h-[380px] sm:min-h-[500px] md:min-h-[580px] lg:min-h-[640px] pt-0 pb-4">
          {/* Base Layer (z-10): Massive Bold Organic Headline Typography in Fraunces (Enlarged Size) */}
          <h1 className="relative z-10 font-serif font-black text-[58px] sm:text-[76px] md:text-[96px] lg:text-[120px] xl:text-[146px] 2xl:text-[170px] text-[#331B0F] leading-[0.84] tracking-tight select-none -translate-y-1 sm:-translate-y-2">
            Coffee <br />
            Experience
          </h1>

          {/* 
            Overlapping Layer (z-20): BIG COFFEE CUP WITH HIGHER Z-INDEX (Shifted UP)
            Straw & ice float above the words, body covers text with z-index up
          */}
          <div className="absolute inset-0 -top-8 sm:-top-12 md:-top-16 flex items-center justify-center z-20 pointer-events-none">
            <div className="w-[340px] sm:w-[500px] md:w-[620px] lg:w-[720px] xl:w-[780px] max-w-[95vw] drop-shadow-2xl select-none transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="/hero-coffee-cutout.png"
                alt="Handcrafted Recharge Iced Coffee"
                className="w-full h-auto object-contain filter drop-shadow-[0_25px_35px_rgba(51,27,15,0.25)]"
              />
            </div>
          </div>

          {/* Top Layer (z-30): Pure Vector/CSS Scalloped Rosette "Order now" Stamp Button (Shifted lower down) */}
          <div className="relative z-30 mt-12 sm:mt-16 md:mt-20 lg:mt-24 flex items-center justify-center">
            <button
              onClick={handleScrollToMenu}
              type="button"
              className="group relative cursor-pointer pointer-events-auto transition-transform duration-300 hover:scale-110 active:scale-95 focus:outline-none"
              aria-label="Order now - browse menu"
              title="Click to Order Now"
            >
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 transition-transform duration-500 group-hover:rotate-6 filter drop-shadow-[0_18px_28px_rgba(178,59,20,0.4)]">
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full select-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient id="scallopGradient" cx="38%" cy="32%" r="65%">
                      <stop offset="0%" stopColor="#c5441b" />
                      <stop offset="60%" stopColor="#B23B14" />
                      <stop offset="100%" stopColor="#962e0b" />
                    </radialGradient>
                  </defs>

                  {/* 13-Lobed Scalloped Rosette Flower Cookie Shape */}
                  <path
                    d="M 174.00 100.00 A 23.02 23.02 0 0 1 165.52 134.39 A 23.02 23.02 0 0 1 142.04 160.90 A 23.02 23.02 0 0 1 108.92 173.46 A 23.02 23.02 0 0 1 73.76 169.19 A 23.02 23.02 0 0 1 44.61 149.07 A 23.02 23.02 0 0 1 28.15 117.71 A 23.02 23.02 0 0 1 28.15 82.29 A 23.02 23.02 0 0 1 44.61 50.93 A 23.02 23.02 0 0 1 73.76 30.81 A 23.02 23.02 0 0 1 108.92 26.54 A 23.02 23.02 0 0 1 142.04 39.10 A 23.02 23.02 0 0 1 165.52 65.61 A 23.02 23.02 0 0 1 174.00 100.00 Z"
                    fill="url(#scallopGradient)"
                  />

                  {/* Bubbly Rounded "Order now" Text in Fredoka Tilted at -12deg */}
                  <g
                    transform="rotate(-12 100 100)"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    className="select-none pointer-events-none"
                    style={{
                      fontFamily: "'Fredoka', 'Nunito', sans-serif",
                      fontWeight: 800,
                    }}
                  >
                    <text
                      x="100"
                      y="93"
                      fontSize="34"
                      letterSpacing="-0.5"
                      stroke="#FFFFFF"
                      strokeWidth="1.2"
                      paintOrder="stroke fill"
                    >
                      Order
                    </text>
                    <text
                      x="100"
                      y="130"
                      fontSize="34"
                      letterSpacing="-0.5"
                      stroke="#FFFFFF"
                      strokeWidth="1.2"
                      paintOrder="stroke fill"
                    >
                      now
                    </text>
                  </g>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
