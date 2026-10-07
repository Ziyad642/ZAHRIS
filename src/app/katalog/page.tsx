import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { CatalogClient } from './CatalogClient';
import { getProducts, getCategories, getWhatsAppSettings, getBusinessSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Koleksi & Katalog Digital Pakaian | Rumah Jahit ZAHRIS',
  description: 'Lihat koleksi pakaian buatan Rumah Jahit ZAHRIS. Konsultasikan model, bahan, dan ukuran favorit Anda langsung melalui WhatsApp.',
};

export default async function KatalogPage() {
  const [products, categories, waSettings, businessSettings] = await Promise.all([
    getProducts(),
    getCategories(),
    getWhatsAppSettings(),
    getBusinessSettings(),
  ]);

  const waNumber = waSettings.phoneNumber || '6282298149440';

  return (
    <div className="flex flex-col min-h-screen bg-[#faf7f2]">
      <Navbar whatsAppNumber={waNumber} />

      <main className="flex-1 py-12 md:py-16">
        <div className="container-custom">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-10">
            <span className="text-[11px] font-bold tracking-widest text-[#c29d59] uppercase block mb-1">
              KATALOG DIGITAL
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#121212]">
              Koleksi Pakaian ZAHRIS
            </h1>
            <p className="text-xs md:text-sm text-[#6b645c] mt-2">
              Model pakaian pilihan yang dirancang dan dijahit presisi. Konsultasikan ukuran, bahan, dan warna impian Anda langsung via WhatsApp.
            </p>
          </div>

          <CatalogClient
            initialProducts={products}
            categories={categories}
            waSettings={waSettings}
          />
        </div>
      </main>

      <Footer
        businessName={businessSettings.businessName}
        address={businessSettings.address}
        openingHours={businessSettings.openingHours}
        instagram={businessSettings.instagram}
        whatsAppNumber={waNumber}
      />

      <FloatingWhatsApp phoneNumber={waNumber} />
    </div>
  );
}
