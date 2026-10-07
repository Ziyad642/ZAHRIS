import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { GalleryClient } from './GalleryClient';
import { getGallery, getWhatsAppSettings, getBusinessSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Galeri Karya Jahit & Hasil Produksi | Rumah Jahit ZAHRIS',
  description: 'Dokumentasi hasil karya jahit Rumah Jahit ZAHRIS: seragam sekolah, seragam olahraga, pakaian keluarga, batik, kemeja kantor, dan vermak.',
};

export default async function GaleriPage() {
  const [galleryItems, waSettings, businessSettings] = await Promise.all([
    getGallery(),
    getWhatsAppSettings(),
    getBusinessSettings(),
  ]);

  const waNumber = waSettings.phoneNumber || '6282298149440';

  return (
    <div className="flex flex-col min-h-screen bg-[#faf7f2]">
      <Navbar whatsAppNumber={waNumber} />

      <main className="flex-1 py-12 md:py-16">
        <div className="container-custom space-y-8">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <span className="text-[11px] font-bold tracking-widest text-[#c29d59] uppercase block">
              DOKUMENTASI KARYA
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#121212]">
              Galeri Hasil Jahitan ZAHRIS
            </h1>
            <p className="text-xs md:text-sm text-[#6b645c]">
              Foto pakaian asli hasil jahitan tim Rumah Jahit ZAHRIS untuk kebutuhan seragam, pesta, kerja, dan custom fitting.
            </p>
          </div>

          <GalleryClient initialItems={galleryItems} />
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
