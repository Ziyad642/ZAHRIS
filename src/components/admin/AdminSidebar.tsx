'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileEdit,
  Shirt,
  Tag,
  Scissors,
  Image as ImageIcon,
  MessageCircle,
  Settings,
  LogOut,
  ExternalLink,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const MENU_ITEMS = [
  { name: 'Beranda CMS', href: '/admin', icon: LayoutDashboard },
  { name: 'Konten Website', href: '/admin/konten', icon: FileEdit },
  { name: 'Produk Koleksi', href: '/admin/produk', icon: Shirt },
  { name: 'Kategori', href: '/admin/kategori', icon: Tag },
  { name: 'Layanan Jahit', href: '/admin/layanan', icon: Scissors },
  { name: 'Galeri Foto', href: '/admin/galeri', icon: ImageIcon },
  { name: 'WhatsApp', href: '/admin/whatsapp', icon: MessageCircle },
  { name: 'Pengaturan Toko', href: '/admin/pengaturan', icon: Settings },
];

export function AdminSidebar({ mobileOpen = false, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-[#121212] text-[#f4eee4] border-r border-[#262422]">
      {/* Brand Header with Authentic Logo */}
      <div className="p-5 border-b border-[#262422] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/20 bg-black shrink-0">
            <Image
              src="/logo.jpg"
              alt="Logo Resmi Rumah Jahit ZAHRIS"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h2 className="font-serif text-sm font-bold tracking-tight text-white uppercase leading-none">
              Rumah Jahit ZAHRIS
            </h2>
            <p className="text-[10px] text-[#c29d59] font-medium tracking-wider mt-1">
              CMS PENGELOLA WEB
            </p>
          </div>
        </div>

        {mobileOpen && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1 text-[#9c9387] hover:text-white rounded-md md:hidden"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[#c29d59] text-[#121212] font-bold shadow-xs'
                  : 'text-[#b3aca2] hover:bg-[#1f1d1a] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Shortcuts */}
      <div className="p-4 border-t border-[#262422] space-y-2 text-xs">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-[#9c9387] hover:text-white rounded-lg hover:bg-[#1f1d1a] transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-[#c29d59]" />
            <span>Lihat Website</span>
          </span>
          <span className="text-[10px] text-[#6b645c]">Tab baru</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar CMS</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#121212]">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
