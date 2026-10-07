'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductItem, WhatsAppSettings } from '@/lib/types';
import { ArrowLeft, MessageCircle, CheckCircle2, Scissors, Sparkles, MapPin } from 'lucide-react';
import { getWhatsAppUrl, generateWhatsAppMessage } from '@/lib/whatsapp';

interface ProductDetailClientProps {
  product: ProductItem;
  waSettings?: WhatsAppSettings;
}

export function ProductDetailClient({ product, waSettings }: ProductDetailClientProps) {
  const images = (product.images && product.images.length > 0)
    ? product.images
    : ['/images/product-gamis-aira.jpg'];

  const [activeImage, setActiveImage] = useState(images[0]);

  const waNumber = waSettings?.phoneNumber || '6282298149440';
  const waUrl = getWhatsAppUrl(
    waNumber,
    generateWhatsAppMessage(
      { type: 'product', productName: product.name, category: product.categoryName },
      waSettings
    )
  );

  return (
    <div className="space-y-6">
      <Link
        href="/katalog"
        className="inline-flex items-center gap-1.5 text-xs text-[#6b645c] hover:text-[#121212] font-medium"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Koleksi Pakaian</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Gallery Photos */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-3/4 w-full rounded-2xl overflow-hidden bg-[#faf7f2] border border-[#e2ded7] shadow-sm">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#121212] text-[#c29d59] font-bold text-xs shadow-md">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnail list */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImage === img
                      ? 'border-[#c29d59] ring-2 ring-[#c29d59]/20'
                      : 'border-[#e2ded7] hover:border-[#121212]'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Information & WhatsApp CTA */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl border border-[#e2ded7] p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#c29d59] block">
                {product.categoryName}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#121212] mt-1">
                {product.name}
              </h1>
              {product.caption && (
                <p className="text-xs text-[#8c6b2d] font-medium mt-1">
                  • {product.caption}
                </p>
              )}
            </div>

            {/* Price Transparency Box */}
            <div className="p-4 bg-[#faf4ea] rounded-xl border border-[#eedcbe] space-y-1">
              <span className="text-xs font-bold text-[#8c6b2d] block uppercase tracking-wide">
                Informasi Pemesanan & Biaya
              </span>
              <p className="text-xs text-[#6e531f] leading-relaxed">
                Biaya pembuatan pakaian bergantung pada pilihan bahan kain, ukuran postur tubuh, dan tingkat kesulitan model. Konsultasikan detailnya langsung bersama penjahit kami via WhatsApp.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2 text-xs text-[#6b645c] leading-relaxed">
              <h3 className="font-semibold text-[#121212]">Deskripsi Pakaian:</h3>
              <p>{product.description}</p>
            </div>

            {/* Features list */}
            <div className="space-y-2 pt-2 border-t border-[#f4eee4] text-xs text-[#4a453e]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bisa request ukuran standar (S, M, L, XL) atau ukuran custom</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bisa bawa bahan sendiri atau menggunakan bahan dari ZAHRIS</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pengerjaan rapi standar butik keluarga</span>
              </div>
            </div>

            {/* Primary WhatsApp Action */}
            <div className="pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>💬 Tanya Produk via WhatsApp</span>
              </a>
              <p className="text-[11px] text-[#9c9387] text-center mt-2">
                Pesan otomatis akan terisi dengan nama produk ini untuk memudahkan konsultasi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
