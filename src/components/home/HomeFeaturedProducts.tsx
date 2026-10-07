'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { ProductItem, WhatsAppSettings } from '@/lib/types';
import { getWhatsAppUrl, generateWhatsAppMessage } from '@/lib/whatsapp';

interface HomeFeaturedProductsProps {
  initialProducts: ProductItem[];
  waNumber: string;
  waSettings?: WhatsAppSettings;
}

export function HomeFeaturedProducts({
  initialProducts,
  waNumber,
  waSettings,
}: HomeFeaturedProductsProps) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    let isMounted = true;
    const syncProducts = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (Array.isArray(data.products)) {
            setProducts(data.products.slice(0, 6));
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

  const displayList = products.slice(0, 6);

  if (displayList.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-[#6b645c] bg-white rounded-2xl border border-[#e2ded7]">
        Belum ada produk koleksi yang ditampilkan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayList.map((p) => {
        const img = p.images?.[0] || '/images/product-gamis-aira.jpg';
        const productWaUrl = getWhatsAppUrl(
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
              <Link
                href={`/katalog/${p.slug}`}
                className="block relative aspect-3/4 w-full bg-[#f4eee4] overflow-hidden"
              >
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
                  <span className="px-2 py-0.5 rounded bg-white/90 text-[#121212] text-[10px] font-semibold backdrop-blur-xs">
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
                href={productWaUrl}
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
  );
}
