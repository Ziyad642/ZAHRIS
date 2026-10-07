import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Scissors, CheckCircle2, Heart, Award, Sparkles, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { getBusinessSettings, getWhatsAppSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Tentang Kami | Rumah Jahit ZAHRIS Sejak 2018',
  description: 'Mengenal Rumah Jahit ZAHRIS (Salamah Zahris). Usaha jasa jahit keluarga sejak 2018 yang berdedikasi menghasilkan pakaian rapi, presisi, dan nyaman dipakai.',
};

export default async function TentangPage() {
  const [settings, waSettings] = await Promise.all([
    getBusinessSettings(),
    getWhatsAppSettings(),
  ]);

  const waNumber = waSettings.phoneNumber || '6282298149440';

  return (
    <div className="flex flex-col min-h-screen bg-[#faf7f2]">
      <Navbar whatsAppNumber={waNumber} />

      <main className="flex-1 py-12 md:py-16">
        <div className="container-custom">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-[11px] font-bold tracking-widest text-[#c29d59] uppercase block mb-1">
              PROFIL USAHA KELUARGA
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#121212]">
              Tentang Rumah Jahit ZAHRIS
            </h1>
            <p className="text-xs md:text-sm text-[#6b645c] mt-2">
              Salamah Zahris • Berdedikasi dalam Seni Jahit Sejak 2018
            </p>
          </div>

          {/* Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-[#121212] shadow-xl bg-black">
                <Image
                  src="/logo.jpg"
                  alt="Logo Resmi Rumah Jahit Salamah ZAHRIS"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#121212]">
                Dari Ketelitian Mesin Jahit Klasik Menuju Layanan Digital Modern
              </h2>
              <p className="text-xs md:text-sm text-[#4a453e] leading-relaxed">
                Berdiri sejak tahun 2018 dengan identitas <strong>Salamah Zahris</strong>, Rumah Jahit ZAHRIS berawal dari kecintaan keluarga terhadap dunia tata busana dan jahit-menjahit. Kami meyakini bahwa pakaian yang baik bukan sekadar indah dipandang, melainkan harus nyaman dikenakan dan memiliki ketahanan jahitan yang kuat.
              </p>
              <p className="text-xs md:text-sm text-[#4a453e] leading-relaxed">
                Setiap helai kain yang dipercayakan kepada kami diperlakukan dengan penuh penghargaan atas seni craftsmanship: mulai dari pembuatan pola yang teliti, pemotongan serat kain yang searah, perakitan bertahap, obras tepi yang bersih, hingga penyetrikaan uap sebelum diserahkan.
              </p>
              <div className="p-4 rounded-xl bg-[#faf7f2] border-l-4 border-[#c29d59] text-xs text-[#2e2a25] italic font-serif">
                "Jahit Sesuai Keinginan, Hasil Rapi, Nyaman Dipakai."
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="p-8 md:p-12 rounded-2xl bg-white border border-[#e2ded7] shadow-xs mb-16">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-[11px] font-bold tracking-widest text-[#c29d59] uppercase block mb-1">
                FILOSOFI KAMI
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#121212]">
                4 Pilar Utama Rumah Jahit ZAHRIS
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-[#faf7f2] text-[#c29d59] flex items-center justify-center">
                  <Scissors className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#121212]">Ketelitian Pola</h4>
                <p className="text-xs text-[#6b645c] leading-relaxed">
                  Pola dirancang dengan mempertimbangkan kenyamanan gerak tubuh, jatuh kain, dan proporsi postur badan.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-[#faf7f2] text-[#c29d59] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#121212]">Kerapian Hasil Akhir</h4>
                <p className="text-xs text-[#6b645c] leading-relaxed">
                  Jahitan lurus, stik konsisten, obras rapat, serta penyelesaian kelim yang tidak berkerut.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-[#faf7f2] text-[#c29d59] flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#121212]">Pelayanan Hangat</h4>
                <p className="text-xs text-[#6b645c] leading-relaxed">
                  Sebagai usaha keluarga, kami melayani setiap pelanggan dengan ramah, komunikatif, dan penuh keakraban.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-[#faf7f2] text-[#c29d59] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#121212]">Transparansi & Waktu</h4>
                <p className="text-xs text-[#6b645c] leading-relaxed">
                  Estimasi pengerjaan yang jujur, progress produksi yang dapat dipantau online, dan harga yang jelas.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="text-center max-w-xl mx-auto space-y-4">
            <h3 className="font-serif text-2xl font-bold text-[#121212]">
              Ingin Menjahit Pakaian Bersama Kami?
            </h3>
            <p className="text-xs md:text-sm text-[#6b645c]">
              Silakan mampir ke workshop kami atau konsultasikan kebutuhan pakaian Anda secara online.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/katalog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#121212] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#c29d59] hover:text-[#121212] transition-colors"
              >
                <span>Lihat Koleksi Pakaian</span>
                <ArrowRight className="w-4 h-4 text-[#c29d59]" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer
        businessName={settings.businessName}
        address={settings.address}
        openingHours={settings.openingHours}
        instagram={settings.instagram}
        whatsAppNumber={waNumber}
      />
      <FloatingWhatsApp whatsAppNumber={waNumber} />
    </div>
  );
}
