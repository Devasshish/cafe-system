import React from 'react';
import { Sparkles, Clock, ShieldCheck } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2e1c14] to-[#452b1e] text-[#faf7f2] p-8 sm:p-12 mb-10 shadow-lg border border-[#523324]">
      {/* Background aesthetic glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c86227]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#df9755]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c86227]/20 border border-[#c86227]/40 text-xs font-medium text-[#f6be95] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#df9755]" />
          <span>Freshly Roasted Daily • Single Origin</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#fbf8f5] leading-tight mb-4">
          Crafted With Passion, <br className="hidden sm:inline" />
          <span className="text-[#df9755]">Served Fresh</span> To Your Table
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-[#d8c3b3] leading-relaxed mb-6 max-w-xl">
          Browse our curated selection of artisanal pour-overs, chilled cold brews, and oven-fresh pastries.
          Order directly from your seat for freshly prepared table service.
        </p>

        {/* Value badges */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 border-t border-[#4a3022] text-xs text-[#c4ab99]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#df9755]" />
            <span>Fast 5-10 Min Table Prep</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#df9755]" />
            <span>No Account Needed</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

