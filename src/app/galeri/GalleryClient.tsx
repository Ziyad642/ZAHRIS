'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/lib/types';
import { EmptyState } from '@/components/EmptyState';
import { Image as ImageIcon } from 'lucide-react';

interface GalleryClientProps {
  initialItems: GalleryItem[];
}

const CATEGORIES = [
  'Semua',
  'Sekolah',
  'Olahraga',
  'Keluarga',
  'Kantor',
  'Custom',
  'Vermak',
  'Lainnya',
];

export function GalleryClient({ initialItems }: GalleryClientProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  React.useEffect(() => {
    let isMounted = true;
    const syncGallery = async () => {
      try {
        const res = await fetch('/api/gallery', { cache: 'no-store' });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (Array.isArray(data.items)) {
            setItems(data.items);
          }
        }
      } catch {
        // Silently continue
      }
    };

    window.addEventListener('focus', syncGallery);
    const interval = setInterval(syncGallery, 8000);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', syncGallery);
      clearInterval(interval);
    };
  }, []);

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'Semua') return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-8">
      {/* Category Pills */}
      <div className="bg-white p-3 rounded-2xl border border-[#e2ded7] shadow-xs flex items-center justify-center gap-2 overflow-x-auto no-scrollbar text-xs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#121212] text-white shadow-xs'
                : 'bg-[#faf7f2] hover:bg-[#ede7dd] text-[#6b645c]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#e2ded7] overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 w-full bg-[#f4eee4] overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#121212] text-[#c29d59] text-[10px] font-bold">
                  {item.category}
                </span>
              </div>

              <div className="p-4 space-y-1">
                <h3 className="font-serif text-base font-bold text-[#121212]">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-xs text-[#6b645c] leading-relaxed">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Belum Ada Foto dalam Kategori Ini"
          description="Pilih kategori lain untuk melihat dokumentasi karya jahit ZAHRIS."
          actionText="Tampilkan Semua Galeri"
          onAction={() => setSelectedCategory('Semua')}
          icon={<ImageIcon className="w-8 h-8 text-[#9c9387]" />}
        />
      )}
    </div>
  );
}
