import React from 'react';

const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-3xl border border-[#ebdccd] p-4 flex flex-col animate-pulse shadow-sm"
        >
          {/* Image skeleton */}
          <div className="w-full h-48 rounded-2xl bg-[#eee4d8] mb-4" />

          {/* Category & prep time row skeleton */}
          <div className="flex items-center justify-between mb-3">
            <div className="w-20 h-4 bg-[#eee4d8] rounded-full" />
            <div className="w-14 h-4 bg-[#eee4d8] rounded-full" />
          </div>

          {/* Title skeleton */}
          <div className="w-3/4 h-5 bg-[#eee4d8] rounded-md mb-2" />

          {/* Description skeleton */}
          <div className="w-full h-3 bg-[#eee4d8] rounded-md mb-1.5" />
          <div className="w-2/3 h-3 bg-[#eee4d8] rounded-md mb-6" />

          {/* Price & button row */}
          <div className="mt-auto pt-3 border-t border-[#f4ebe1] flex items-center justify-between">
            <div className="w-16 h-6 bg-[#eee4d8] rounded-md" />
            <div className="w-24 h-9 bg-[#eee4d8] rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;

