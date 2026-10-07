'use client';

import React from 'react';
import { Menu, ShieldCheck } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
}

export function AdminHeader({ title, subtitle, onOpenMobileMenu }: AdminHeaderProps) {
  const today = new Date().toISOString();

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#e2ded7] py-3.5 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-[#121212] hover:bg-[#faf7f2] rounded-lg border border-[#e2ded7] cursor-pointer"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="font-serif text-lg md:text-xl font-bold text-[#121212]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#6b645c] hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <span className="hidden md:inline-block text-[#6b645c]">
          {formatDate(today, false)}
        </span>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#faf7f2] border border-[#e2ded7] text-[#121212]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#c29d59]" />
          <span className="font-semibold text-[11px]">Admin ZAHRIS</span>
        </div>
      </div>
    </header>
  );
}
