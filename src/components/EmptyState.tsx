import React from 'react';
import Link from 'next/link';
import { PackageOpen, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'Belum Ada Data',
  description = 'Saat ini belum ada item yang dapat ditampilkan.',
  actionText,
  actionHref,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl bg-white border border-[#e2ded7] shadow-xs">
      <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#f4eee4] text-[#c29d59] mb-4">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <h3 className="font-serif text-base md:text-lg font-bold text-[#121212] mb-1">
        {title}
      </h3>
      <p className="text-xs md:text-sm text-[#6b645c] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && (
        <>
          {onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#121212] hover:bg-[#c29d59] hover:text-[#121212] rounded-xl transition-colors cursor-pointer"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#121212] hover:bg-[#c29d59] hover:text-[#121212] rounded-xl transition-colors"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : null}
        </>
      )}
    </div>
  );
}
