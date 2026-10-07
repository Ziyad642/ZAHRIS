'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductItem, CategoryItem, WhatsAppSettings } from '@/lib/types';
import { Search, MessageCircle, ArrowRight, Shirt, Sparkles } from 'lucide-react';
import { getWhatsAppUrl, generateWhatsAppMessage } from '@/lib/whatsapp';
import { EmptyState } from '@/components/EmptyState';

interface CatalogClientProps {
  initialProducts: ProductItem[];
  categories: CategoryItem[];
  waSettings?: WhatsAppSettings;
}

export function CatalogClient({ initialProducts, categories, waSettings }: CatalogClientProps) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Update if props change
  React.useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Real-time live synchronization (focus & interval)
  React.useEffect(() => {
    let isMounted = true;
    const syncProducts = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (Array.isArray(data.products)) {
            setProducts(data.products);
          }
        }
      } catch {
        // Silently continue
      }
    };

    window.addEventListener('focus', syncProducts);
    const interval = setInterval(syncProducts, 8000);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', syncProducts);
      clearInterval(interval);
    };
  }, []);

  const waNumber = waSettings?.phoneNumber || '6282298149440';

  const categoryNames = ['Semua', ...categories.map((c) => c.name)];

  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === 'Semua' || p.categoryName === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.caption && p.caption.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-[#e2ded7] shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-[#9c9387] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari model pakaian atau jenis busana..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#faf7f2] border border-[#e2ded7] rounded-xl text-xs placeholder:text-[#9c9387] focus:outline-none focus:border-[#c29d59]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categoryNames.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#121212] text-white shadow-xs'
                  : 'bg-[#faf7f2] hover:bg-[#ede7dd] text-[#6b645c]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const img = p.images?.[0] || '/images/product-gamis-aira.jpg';
            const waUrl = getWhatsAppUrl(
              waNumber,
              generateWhatsAppMessage(
                { type: 'product', productName: p.name, category: p.categoryName },
                waSettings
              )
            );

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-[#e2ded7] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <Link href={`/katalog/${p.slug}`} className="block relative aspect-3/4 w-full bg-[#f4eee4] overflow-hidden">
                    <Image
                      src={img}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {p.badge && (
                        <span className="px-2 py-0.5 rounded bg-[#121212] text-[#c29d59] text-[10px] font-bold">
                          {p.badge}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-white/95 text-[#121212] text-[10px] font-semibold backdrop-blur-xs">
                        {p.categoryName}
                      </span>
                    </div>
                  </Link>

                  <div className="p-5 space-y-2">
                    <Link href={`/katalog/${p.slug}`}>
                      <h3 className="font-serif text-base font-bold text-[#121212] hover:text-[#c29d59] transition-colors line-clamp-1">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#6b645c] line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                    {p.caption && (
                      <p className="text-[11px] text-[#8c6b2d] font-medium pt-1">
                        • {p.caption}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-[#faf7f2] border-t border-[#e2ded7] flex items-center justify-between gap-2">
                  <Link
                    href={`/katalog/${p.slug}`}
                    className="text-xs font-semibold text-[#6b645c] hover:text-[#121212]"
                  >
                    Detail Model
                  </Link>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Tanya via WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Tidak Ada Produk Ditemukan"
          description="Coba pilih kategori lain atau reset kata kunci pencarian Anda."
          actionText="Tampilkan Semua Produk"
          onAction={() => {
            setSelectedCategory('Semua');
            setSearchQuery('');
          }}
          icon={<Shirt className="w-8 h-8 text-[#9c9387]" />}
        />
      )}
    </div>
  );
}
