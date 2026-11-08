import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Sparkles, ArrowRight, Video, MessageSquareHeart, Coffee } from 'lucide-react';

const ReviewsPage = () => {
  return (
    <div className="relative w-full min-h-[85vh] bg-[#F6EFE5] text-[#331B0F] overflow-hidden py-10 sm:py-16 flex items-center justify-center">
      {/* Subtle Dot Matrix Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(#cbb7a2 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating Coffee Stains & Watermarks */}
      <div className="absolute -top-12 -left-12 w-80 h-80 rounded-full border-[14px] border-[#926848]/15 blur-[1px] pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-96 h-96 rounded-full border-[18px] border-[#926848]/10 blur-[1px] pointer-events-none" />

      {/* Ambient Floating Coffee Beans in background */}
      <div className="absolute top-16 left-12 sm:left-32 w-5 h-7 rounded-[50%] bg-[#331B0F] -rotate-45 shadow-md opacity-40 pointer-events-none" />
      <div className="absolute bottom-20 right-16 sm:right-40 w-4 h-6 rounded-[50%] bg-[#331B0F] rotate-45 shadow-md opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Top Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBDDCC] text-[#B23B14] text-xs font-black uppercase tracking-widest shadow-xs">
          <Star className="w-3.5 h-3.5 fill-[#B23B14]" />
          <span>Guest Experiences & Wall of Love</span>
        </div>

        {/* Textured Card */}
        <div className="relative bg-[#FAF6F0] border border-[#E8DCCF] rounded-3xl p-8 sm:p-12 shadow-xl overflow-hidden text-center space-y-6">
          {/* Top Washi Tape Graphic */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#E8D6C4]/90 border-b border-[#D8C2AD] rotate-[1deg] shadow-xs" />

          {/* Postal Stamp Badge */}
          <div className="absolute top-5 right-5 w-16 h-16 rounded-full border-2 border-dashed border-[#B38F72]/40 flex items-center justify-center rotate-12 pointer-events-none select-none hidden sm:flex">
            <span className="text-[8px] font-black text-[#9E7655] tracking-widest uppercase text-center leading-tight">
              TABLE<br />LOVE
            </span>
          </div>

          {/* Icon */}
          <div className="w-18 h-18 rounded-2xl bg-[#B23B14]/10 text-[#B23B14] flex items-center justify-center mx-auto shadow-inner">
            <MessageSquareHeart className="w-9 h-9 text-[#B23B14]" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#331B0F] tracking-tight">
              Reviews Will Be Added Soon Here
            </h1>
            <p className="font-sans text-sm sm:text-base text-[#7D5F4C] max-w-md mx-auto leading-relaxed">
              We are currently gathering authentic dine-in feedback, brew bar video moments, and napkin notes from our lovely guests. Customer reviews will be published here shortly!
            </p>
          </div>

          {/* Teaser Badges */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-semibold text-[#5A3825]">
            <div className="p-3 rounded-2xl bg-white border border-[#E8DCCF] flex items-center justify-center gap-1.5 shadow-2xs">
              <Video className="w-3.5 h-3.5 text-[#B23B14]" />
              <span>Brew Bar Reels</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-[#E8DCCF] flex items-center justify-center gap-1.5 shadow-2xs">
              <Heart className="w-3.5 h-3.5 text-[#B23B14]" />
              <span>Napkin Notes</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-[#E8DCCF] flex items-center justify-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B23B14]" />
              <span>Table Feedback</span>
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

export default ReviewsPage;
