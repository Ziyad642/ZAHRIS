import React from 'react';
import Link from 'next/link';
import {
  getAdminDashboardStats,
  getBusinessSettings,
  getWhatsAppSettings,
} from '@/lib/db';
import {
  Shirt,
  Tag,
  ImageIcon,
  Scissors,
  ArrowRight,
  FileEdit,
  Plus,
  MessageCircle,
  Settings,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const [stats, settings, waSettings] = await Promise.all([
    getAdminDashboardStats(),
    getBusinessSettings(),
    getWhatsAppSettings(),
  ]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#121212] text-white p-6 md:p-8 rounded-3xl border border-[#262422] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-[#c29d59] uppercase tracking-widest block">
            PENGELOLA KONTEN WEBSITE
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold">
            Selamat Datang di CMS Rumah Jahit ZAHRIS
          </h1>
          <p className="text-xs md:text-sm text-[#b3aca2] max-w-xl leading-relaxed">
            Kelola teks beranda, katalog pakaian, foto galeri, nomor WhatsApp, dan informasi toko dengan mudah tanpa perlu coding.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-colors shrink-0"
        >
          <ExternalLink className="w-4 h-4 text-[#c29d59]" />
          <span>Buka Website Publik</span>
        </Link>
      </div>

      {/* 4 Summary Stats Cards */}
      <div>
        <h2 className="font-serif text-lg font-bold text-[#121212] mb-4">
          Ringkasan Konten Aktif
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {/* Card 1: Produk */}
          <div className="p-5 bg-white rounded-2xl border border-[#e2ded7] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#faf4ea] text-[#c29d59] flex items-center justify-center">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif text-2xl md:text-3xl font-bold text-[#121212]">
                {stats.activeProductsCount}
              </div>
              <p className="text-xs text-[#6b645c] mt-0.5">Produk Koleksi Aktif</p>
            </div>
            <Link
              href="/admin/produk"
              className="text-[11px] font-semibold text-[#c29d59] hover:underline inline-flex items-center gap-1"
            >
              <span>Kelola produk</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 2: Kategori */}
          <div className="p-5 bg-white rounded-2xl border border-[#e2ded7] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#faf4ea] text-[#c29d59] flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif text-2xl md:text-3xl font-bold text-[#121212]">
                {stats.categoriesCount}
              </div>
              <p className="text-xs text-[#6b645c] mt-0.5">Kategori Pakaian</p>
            </div>
            <Link
              href="/admin/kategori"
              className="text-[11px] font-semibold text-[#c29d59] hover:underline inline-flex items-center gap-1"
            >
              <span>Kelola kategori</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 3: Galeri Foto */}
          <div className="p-5 bg-white rounded-2xl border border-[#e2ded7] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#faf4ea] text-[#c29d59] flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif text-2xl md:text-3xl font-bold text-[#121212]">
                {stats.galleryCount}
              </div>
              <p className="text-xs text-[#6b645c] mt-0.5">Foto Portofolio Galeri</p>
            </div>
            <Link
              href="/admin/galeri"
              className="text-[11px] font-semibold text-[#c29d59] hover:underline inline-flex items-center gap-1"
            >
              <span>Kelola galeri</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 4: Layanan */}
          <div className="p-5 bg-white rounded-2xl border border-[#e2ded7] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#faf4ea] text-[#c29d59] flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif text-2xl md:text-3xl font-bold text-[#121212]">
                {stats.servicesCount}
              </div>
              <p className="text-xs text-[#6b645c] mt-0.5">Layanan Utama</p>
            </div>
            <Link
              href="/admin/layanan"
              className="text-[11px] font-semibold text-[#c29d59] hover:underline inline-flex items-center gap-1"
            >
              <span>Kelola layanan</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Shortcut Buttons (Master Prompt Section 24) */}
      <div className="bg-white rounded-2xl border border-[#e2ded7] p-6 space-y-4">
        <h2 className="font-serif text-lg font-bold text-[#121212]">
          Aksi Cepat Pengelolaan
        </h2>
        <p className="text-xs text-[#6b645c]">
          Pilih salah satu menu di bawah ini untuk langsung memperbarui isi website Anda:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Shortcut 1 */}
          <Link
            href="/admin/konten"
            className="p-4 rounded-xl border border-[#e2ded7] hover:border-[#121212] bg-[#faf7f2] hover:bg-white transition-all space-y-2 group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-lg bg-[#121212] text-white group-hover:bg-[#c29d59] group-hover:text-[#121212] flex items-center justify-center transition-colors">
              <FileEdit className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-sm font-bold text-[#121212]">
              Edit Beranda
            </h3>
            <p className="text-[11px] text-[#6b645c] leading-relaxed">
              Ubah headline, subtitle hero, teks tentang kami, dan keunggulan.
            </p>
          </Link>

          {/* Shortcut 2 */}
          <Link
            href="/admin/produk?tambah=1"
            className="p-4 rounded-xl border border-[#e2ded7] hover:border-[#121212] bg-[#faf7f2] hover:bg-white transition-all space-y-2 group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-lg bg-[#121212] text-white group-hover:bg-[#c29d59] group-hover:text-[#121212] flex items-center justify-center transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-sm font-bold text-[#121212]">
              Tambah Produk
            </h3>
            <p className="text-[11px] text-[#6b645c] leading-relaxed">
              Upload foto jepretan kamera dan tambahkan pakaian sample ke katalog.
            </p>
          </Link>

          {/* Shortcut 3 */}
          <Link
            href="/admin/galeri?tambah=1"
            className="p-4 rounded-xl border border-[#e2ded7] hover:border-[#121212] bg-[#faf7f2] hover:bg-white transition-all space-y-2 group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-lg bg-[#121212] text-white group-hover:bg-[#c29d59] group-hover:text-[#121212] flex items-center justify-center transition-colors">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-sm font-bold text-[#121212]">
              Tambah Galeri
            </h3>
            <p className="text-[11px] text-[#6b645c] leading-relaxed">
              Upload foto dokumentasi seragam sekolah, kantor, atau karya jahit baru.
            </p>
          </Link>

          {/* Shortcut 4 */}
          <Link
            href="/admin/whatsapp"
            className="p-4 rounded-xl border border-[#e2ded7] hover:border-[#121212] bg-[#faf7f2] hover:bg-white transition-all space-y-2 group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center transition-colors">
              <MessageCircle className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-sm font-bold text-[#121212]">
              Pengaturan WhatsApp
            </h3>
            <p className="text-[11px] text-[#6b645c] leading-relaxed">
              Ubah nomor WhatsApp tujuan ({waSettings.phoneNumber}) dan template chat.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
