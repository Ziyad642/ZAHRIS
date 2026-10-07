import React from 'react';

export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-[#e2ded7] bg-white overflow-hidden shadow-xs animate-pulse"
        >
          <div className="aspect-3/4 bg-[#e8dfd2]/50 w-full" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-[#e8dfd2]/70 rounded-sm w-3/4" />
            <div className="h-3 bg-[#e8dfd2]/50 rounded-sm w-full" />
            <div className="h-3 bg-[#e8dfd2]/40 rounded-sm w-1/2" />
            <div className="pt-3 flex justify-between items-center border-t border-[#f4eee4]">
              <div className="h-5 bg-[#e8dfd2]/70 rounded-sm w-1/3" />
              <div className="h-7 bg-[#e8dfd2]/80 rounded-md w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function OrderRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-xl border border-[#e2ded7] bg-white animate-pulse flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="space-y-2 w-full sm:w-1/3">
            <div className="h-4 bg-[#e8dfd2]/70 rounded-sm w-2/3" />
            <div className="h-3 bg-[#e8dfd2]/50 rounded-sm w-1/2" />
          </div>
          <div className="h-6 bg-[#e8dfd2]/60 rounded-full w-24" />
          <div className="h-5 bg-[#e8dfd2]/70 rounded-sm w-20" />
        </div>
      ))}
    </div>
  );
}
