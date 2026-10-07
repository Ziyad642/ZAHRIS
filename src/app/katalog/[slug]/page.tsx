import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { ProductDetailClient } from './ProductDetailClient';
import { getProductBySlug, getWhatsAppSettings, getBusinessSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan | Rumah Jahit ZAHRIS',
    };
  }

  return {
    title: `${product.name} | Koleksi Rumah Jahit ZAHRIS`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, waSettings, businessSettings] = await Promise.all([
    getProductBySlug(slug),
    getWhatsAppSettings(),
    getBusinessSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const waNumber = waSettings.phoneNumber || '6282298149440';

  return (
    <div className="flex flex-col min-h-screen bg-[#faf7f2]">
      <Navbar whatsAppNumber={waNumber} />

      <main className="flex-1 py-10 md:py-16">
        <div className="container-custom">
          <ProductDetailClient
            product={product}
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
