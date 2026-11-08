import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Coffee, Sparkles, ArrowRight, Clock, Compass } from 'lucide-react';

const NotesPage = () => {
  return (
    <div className="relative w-full min-h-[85vh] bg-[#F6EFE5] text-[#331B0F] overflow-hidden py-10 sm:py-16 flex items-center justify-center">
      {/* BACKGROUND GRAPHICS: Watermark Coffee Rings, Botanical Leaves, Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(#cbb7a2 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Coffee Stain Ring Watermark 1 (Top Right) */}
      <div className="absolute -top-10 -right-10 w-80 h-80 rounded-full border-[14px] border-[#926848]/15 blur-[1px] pointer-events-none" />
      <div className="absolute -top-6 -right-6 w-72 h-72 rounded-full border-[6px] border-[#926848]/20 blur-[2px] pointer-events-none" />

      {/* Coffee Stain Ring Watermark 2 (Bottom Left) */}
      <div className="absolute bottom-10 -left-16 w-96 h-96 rounded-full border-[18px] border-[#926848]/10 blur-[1px] pointer-events-none" />

      {/* Botanical Coffee Branch SVG Sketch in Background */}
      <svg
        className="absolute top-1/4 -right-16 w-72 h-72 text-[#331B0F]/5 pointer-events-none rotate-45"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <path d="M100 20 Q120 60 100 100 Q80 140 100 180" stroke="currentColor" strokeWidth="3" fill="none" />
        <ellipse cx="80" cy="60" rx="20" ry="10" transform="rotate(-30 80 60)" />
        <ellipse cx="120" cy="80" rx="20" ry="10" transform="rotate(30 120 80)" />
        <ellipse cx="75" cy="120" rx="22" ry="11" transform="rotate(-25 75 120)" />
        <ellipse cx="125" cy="140" rx="22" ry="11" transform="rotate(25 125 140)" />
        <circle cx="100" cy="70" r="8" fill="#B23B14" opacity="0.3" />
        <circle cx="95" cy="130" r="9" fill="#B23B14" opacity="0.3" />
      </svg>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Top Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBDDCC] text-[#B23B14] text-xs font-black uppercase tracking-widest shadow-xs">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Roaster's Field Notes & Journal</span>
        </div>

        {/* Textured Notebook Paper Card */}
        <div className="relative bg-[#FAF6F0] border border-[#E8DCCF] rounded-3xl p-8 sm:p-12 shadow-xl overflow-hidden text-center space-y-6">
          {/* Washi Paper Tape Graphic at Top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#E8D6C4]/90 border-b border-[#D8C2AD] rotate-[-1deg] shadow-xs" />

          {/* Postal Stamp Badge */}
          <div className="absolute top-5 right-5 w-16 h-16 rounded-full border-2 border-dashed border-[#B38F72]/40 flex items-center justify-center rotate-12 pointer-events-none select-none hidden sm:flex">
            <span className="text-[8px] font-black text-[#9E7655] tracking-widest uppercase text-center leading-tight">
              ROASTERY<br />LOGS
            </span>
          </div>

          {/* Icon */}
          <div className="w-18 h-18 rounded-2xl bg-[#B23B14]/10 text-[#B23B14] flex items-center justify-center mx-auto shadow-inner">
            <Coffee className="w-9 h-9 text-[#B23B14]" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#331B0F] tracking-tight">
              Notes Will Be Added Soon Here
            </h1>
            <p className="font-sans text-sm sm:text-base text-[#7D5F4C] max-w-md mx-auto leading-relaxed">
              Our head roasters and baristas are currently curating harvest logs, single-origin cupping scores, and step-by-step brew guides. Fresh stories will be published here very soon!
            </p>
          </div>

          {/* Teaser Badges */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-semibold text-[#5A3825]">
            <div className="p-3 rounded-2xl bg-white border border-[#E8DCCF] flex items-center justify-center gap-1.5 shadow-2xs">
              <Compass className="w-3.5 h-3.5 text-[#B23B14]" />
              <span>Harvest Diaries</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-[#E8DCCF] flex items-center justify-center gap-1.5 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#B23B14]" />
              <span>Brew Guides</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-[#E8DCCF] flex items-center justify-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B23B14]" />
              <span>Cupping Scores</span>
            </div>
          </div>

          {/* CTA Link to Menu */}
          <div className="pt-4 border-t border-[#E8DCCF]/60">
            <Link
              to="/#menu-section"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B23B14] hover:bg-[#962E0B] text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Explore Cafe Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
