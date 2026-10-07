'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl, generateWhatsAppMessage } from '@/lib/whatsapp';

const NAV_LINKS = [
  { name: 'Beranda', href: '/' },
  { name: 'Layanan', href: '/#layanan' },
  { name: 'Koleksi', href: '/katalog' },
  { name: 'Borongan', href: '/borongan' },
  { name: 'Galeri', href: '/galeri' },
  { name: 'Tentang Kami', href: '/tentang' },
];

interface NavbarProps {
  whatsAppNumber?: string;
}

export function Navbar({ whatsAppNumber = '6282298149440' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const waUrl = getWhatsAppUrl(
    whatsAppNumber,
    generateWhatsAppMessage({ type: 'general' })
  );

  return (
    <header className="sticky top-0 z-50 bg-[#faf7f2]/95 backdrop-blur-md border-b border-[#e2ded7] transition-all">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand with Authentic Circular Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border border-[#262422]/20 shadow-sm shrink-0 bg-black">
              <Image
                src="/logo.jpg"
                alt="Logo Resmi Rumah Jahit Salamah ZAHRIS"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg md:text-xl font-bold tracking-tight text-[#121212] leading-none uppercase">
                Rumah Jahit
              </span>
              <span className="font-serif text-base md:text-lg font-black tracking-widest text-[#c29d59] leading-tight">
                ZAHRIS
              </span>
              <span className="text-[10px] tracking-wider text-[#6b645c] uppercase font-sans">
                Sejak 2018 • Jahit Rapi
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#c29d59] relative py-1 ${
                    isActive
                      ? 'text-[#121212] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#c29d59]'
                      : 'text-[#4a453e]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop WhatsApp Action */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konsultasi WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Konsultasi WhatsApp"
              className="p-2.5 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-[#121212] hover:text-[#c29d59] bg-[#f4eee4] hover:bg-[#e8dfd2] rounded-xl border border-[#e2ded7] transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#faf7f2] border-b border-[#e2ded7] shadow-xl animate-in slide-in-from-top duration-200">
          <div className="container-custom py-4 space-y-3">
            <nav className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-[#1c1917] hover:bg-[#f4eee4] hover:text-[#c29d59] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="pt-2 border-t border-[#e2ded7]">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konsultasi via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
