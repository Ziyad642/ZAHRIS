import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { HomeFeaturedProducts } from '@/components/home/HomeFeaturedProducts';
import {
  getSiteContent,
  getServices,
  getProducts,
  getGallery,
  getWhatsAppSettings,
  getBusinessSettings,
} from '@/lib/db';
import { getWhatsAppUrl, generateWhatsAppMessage } from '@/lib/whatsapp';
import {
  Scissors,
  Shirt,
  Layers,
  Users,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  HelpCircle,
  Phone,
  Image as ImageIcon,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Rumah Jahit ZAHRIS | Jasa Jahit & Custom Sejak 2018',
  description: 'Rumah Jahit ZAHRIS melayani jasa jahit custom bawa kain sendiri, pre-order pakaian, seragam borongan sekolah & kantor, serta vermak pakaian dengan hasil rapi dan ukuran nyaman.',
};

export default async function HomePage() {
  const [
    siteContent,
    services,
    products,
    galleryItems,
    waSettings,
    businessSettings,
  ] = await Promise.all([
    getSiteContent(),
    getServices(),
    getProducts(),
    getGallery(),
    getWhatsAppSettings(),
    getBusinessSettings(),
  ]);

  const { hero, about, benefits, howToOrder, pickupDelivery, finalCta } = siteContent;
  const waNumber = waSettings.phoneNumber || '6282298149440';

  // WhatsApp URLs
  const heroPrimaryWaUrl = getWhatsAppUrl(
    waNumber,
    generateWhatsAppMessage({ type: 'general' }, waSettings)
  );
  const customFabricWaUrl = getWhatsAppUrl(
    waNumber,
    generateWhatsAppMessage({ type: 'custom_fabric' }, waSettings)
  );
  const fabricPlusSewWaUrl = getWhatsAppUrl(
    waNumber,
    generateWhatsAppMessage({ type: 'fabric_plus_sew' }, waSettings)
  );
  const ownDesignWaUrl = getWhatsAppUrl(
    waNumber,
    generateWhatsAppMessage({ type: 'own_design' }, waSettings)
  );
  const schoolWaUrl = getWhatsAppUrl(
    waNumber,
    generateWhatsAppMessage({ type: 'school_uniform', category: 'Sekolah' }, waSettings)
  );
  const finalCtaWaUrl = getWhatsAppUrl(
    waNumber,
    generateWhatsAppMessage({ type: 'general' }, waSettings)
  );

  const featuredProducts = products.slice(0, 6);
  const previewGallery = galleryItems.slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-[#faf7f2] text-[#1c1917]">
      <Navbar whatsAppNumber={waNumber} />

      <main className="flex-1">
        {/* ============================================================ */}
        {/* 1. HERO SECTION                                              */}
        {/* ============================================================ */}
        <section className="relative py-16 sm:py-24 md:py-32 bg-[#121212] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <Image
              src={hero.heroImage || '/images/hero-tailor.jpg'}
              alt="Workshop Rumah Jahit ZAHRIS"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/90 to-[#121212]/60" />

          <div className="container-custom relative z-10">
            <div className="max-w-2xl space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#c29d59] font-medium">
                <Scissors className="w-3.5 h-3.5" />
                <span>{hero.badgeText}</span>
              </div>

              {/* Headline */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                {hero.headline}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base md:text-lg text-[#b3aca2] leading-relaxed max-w-xl">
                {hero.subtitle}
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <a
                  href={heroPrimaryWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{hero.primaryCtaText}</span>
                </a>

                <Link
                  href="/katalog"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wide text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl backdrop-blur-sm transition-all"
                >
                  <span>{hero.secondaryCtaText}</span>
                  <ArrowRight className="w-4 h-4 text-[#c29d59]" />
                </Link>
              </div>

              {/* Trust Metric Simple */}
              <div className="pt-4 border-t border-white/10 text-xs text-[#9c9387] flex items-center gap-4">
                <span>✓ Sejak 2018</span>
                <span>•</span>
                <span>✓ Konsultasi Langsung via WhatsApp</span>
                <span>•</span>
                <span>✓ Ukuran Pas di Badan</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. SERVICES / LAYANAN (4 PILIHAN UTAMA)                      */}
        {/* ============================================================ */}
        <section id="layanan" className="py-14 md:py-20 -mt-6 relative z-20">
          <div className="container-custom">
            <div className="text-center max-w-xl mx-auto mb-10 bg-white/95 backdrop-blur-xs p-6 rounded-2xl border border-[#e2ded7] shadow-xs">
              <span className="text-[11px] font-bold tracking-widest text-[#c29d59] uppercase block mb-1">
                PILIH SESUAI KEBUTUHAN ANDA
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#121212]">
                Layanan Rumah Jahit ZAHRIS
              </h2>
              <p className="text-xs text-[#6b645c] mt-1.5 leading-relaxed">
                Empat layanan utama yang kami sediakan untuk mewujudkan pakaian nyaman dan rapi bagi Anda:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {services.map((srv) => {
                const isCatalog = srv.ctaType === 'catalog';
                const isBorongan = srv.ctaType === 'borongan';
                const targetUrl = isCatalog ? '/katalog' : isBorongan ? '/borongan' : heroPrimaryWaUrl;

                return (
                  <div
                    key={srv.id}
                    className="p-6 bg-white rounded-2xl border border-[#e2ded7] shadow-xs hover:shadow-md transition-all hover:border-[#c29d59] flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-[#f4eee4] text-[#121212] group-hover:bg-[#121212] group-hover:text-[#c29d59] flex items-center justify-center mb-4 transition-colors">
                        {srv.icon === 'Shirt' ? (
                          <Shirt className="w-6 h-6" />
                        ) : srv.icon === 'Layers' ? (
                          <Layers className="w-6 h-6" />
                        ) : srv.icon === 'Users' ? (
                          <Users className="w-6 h-6" />
                        ) : (
                          <Scissors className="w-6 h-6" />
                        )}
                      </div>

                      <h3 className="font-serif text-lg font-bold text-[#121212] group-hover:text-[#c29d59] transition-colors">
                        {srv.title}
                      </h3>
                      <p className="text-xs text-[#6b645c] mt-2 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-[#f4eee4]">
                      {isCatalog || isBorongan ? (
                        <Link
                          href={targetUrl}
                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-[#121212] hover:bg-[#282624] text-white text-xs font-semibold rounded-xl transition-colors"
                        >
                          <span>{srv.ctaText}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#c29d59]" />
                        </Link>
                      ) : (
                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{srv.ctaText}</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. TIGA BLOK KEBUTUHAN KHUSUS (KAIN SENDIRI / BAHAN / DESAIN) */}
        {/* ============================================================ */}
        <section className="py-12 bg-white border-y border-[#e2ded7]">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Blok 1: Punya Kain Sendiri */}
              <div className="p-6 bg-[#faf7f2] rounded-2xl border border-[#e2ded7] flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-[#faf4ea] text-[#c29d59] flex items-center justify-center">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#121212]">
                    Punya Kain Sendiri? Kami Bantu Jahitkan
                  </h3>
                  <p className="text-xs text-[#6b645c] leading-relaxed">
                    Anda dapat membawa kain sendiri langsung ke workshop Rumah Jahit ZAHRIS untuk dijahit sesuai model dan kebutuhan Anda.
                  </p>
                </div>
                <div>
                  <a
                    href={customFabricWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>💬 Konsultasi Jasa Jahit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Blok 2: Belum Punya Kain */}
              <div className="p-6 bg-[#faf7f2] rounded-2xl border border-[#e2ded7] flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-[#faf4ea] text-[#c29d59] flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#121212]">
                    Belum Punya Kain? Kami Bantu Pilihkan
                  </h3>
                  <p className="text-xs text-[#6b645c] leading-relaxed">
                    Jika belum memiliki bahan, kami dapat membantu memilih bahan yang sesuai dengan model, jatuh kain, dan kenyamanan pakaian Anda.
                  </p>
                </div>
                <div>
                  <a
                    href={fabricPlusSewWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>💬 Konsultasi Bahan + Jahit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Blok 3: Sudah Punya Desain Sendiri */}
              <div className="p-6 bg-[#faf7f2] rounded-2xl border border-[#e2ded7] flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-[#faf4ea] text-[#c29d59] flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#121212]">
                    Sudah Punya Desain? Kirim via WhatsApp
                  </h3>
                  <p className="text-xs text-[#6b645c] leading-relaxed">
                    Sudah memiliki desain, foto referensi, screenshot, atau logo sendiri? Kirimkan langsung melalui chat WhatsApp untuk kami pelajari.
                  </p>
                </div>
                <div>
                  <a
                    href={ownDesignWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>💬 Kirim Desain via WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. KOLEKSI / DIGITAL CATALOG HIGHLIGHT                       */}
        {/* ============================================================ */}
        <section className="py-14 md:py-20">
          <div className="container-custom space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold tracking-widest text-[#c29d59] uppercase block mb-1">
                  KATALOG DIGITAL
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#121212]">
                  Contoh Koleksi Pakaian ZAHRIS
                </h2>
                <p className="text-xs text-[#6b645c] mt-1 max-w-lg">
                  Lihat contoh model busana yang sudah kami buat. Hubungi kami via WhatsApp untuk konsultasi ukuran, warna, dan bahan.
                </p>
              </div>

              <Link
                href="/katalog"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#121212] hover:text-[#c29d59] group shrink-0"
              >
                <span>Lihat Semua Koleksi</span>
                <ArrowRight className="w-4 h-4 text-[#c29d59] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <HomeFeaturedProducts
              initialProducts={featuredProducts}
              waNumber={waNumber}
              waSettings={waSettings}
            />
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. PESANAN BORONGAN SECTION                                  */}
        {/* ============================================================ */}
        <section className="py-14 md:py-20 bg-[#121212] text-white">
          <div className="container-custom space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-[11px] font-bold tracking-widest text-[#c29d59] uppercase block">
                PESANAN JUMLAH BANYAK
              </span>
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-white">
                Pesanan Borongan & Seragam
              </h2>
              <p className="text-xs md:text-sm text-[#b3aca2] leading-relaxed">
                Untuk kebutuhan sekolah, olahraga, keluarga, kantor, komunitas, hingga event. Jahitan rapi, bordir presisi, dan kapasitas memadai.
              </p>
            </div>

            {/* Grid 6 Kategori Borongan */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
              {[
                { title: 'Seragam Sekolah', desc: 'SD, SMP, SMA, Pramuka, Batik' },
                { title: 'Seragam Olahraga', desc: 'Kaos Dryfit, Training, Klub' },
                { title: 'Seragam Keluarga', desc: 'Sarimbit Pesta, Lebaran' },
                { title: 'Seragam Kantor', desc: 'Kemeja PDH, PDL, Dinas' },
                { title: 'Komunitas', desc: 'Polo Shirt, Jaket, Kaos' },
                { title: 'Event & Acara', desc: 'Panitia, Seminar, Reuni' },
              ].map((b, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <h4 className="font-serif text-sm font-bold text-white">{b.title}</h4>
                  <p className="text-[11px] text-[#9c9387]">{b.desc}</p>
                </div>
              ))}
            </div>

            {/* School Uniform Special Callout */}
            <div className="p-6 md:p-8 rounded-2xl bg-white/10 border border-white/15 max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-bold text-[#c29d59] uppercase tracking-wider block">
                  Khusus Sekolah & Yayasan
                </span>
                <h3 className="font-serif text-lg md:text-xl font-bold text-white">
                  Sudah Punya Desain atau Logo Sekolah?
                </h3>
                <p className="text-xs text-[#b3aca2]">
                  Kirimkan desain, logo sekolah (untuk bordir), daftar ukuran, dan jumlah pesanan Anda langsung melalui WhatsApp.
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                <a
                  href={schoolWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Desain via WA</span>
                </a>
                <Link
                  href="/borongan"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold transition-all"
                >
                  <span>Info Borongan</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c29d59]" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. GALERI HASIL JAHITAN PREVIEW                              */}
        {/* ============================================================ */}
        <section className="py-14 md:py-20 bg-white border-b border-[#e2ded7]">
          <div className="container-custom space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold tracking-widest text-[#c29d59] uppercase block mb-1">
                  PORTOFOLIO
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#121212]">
                  Galeri Hasil Jahitan ZAHRIS
                </h2>
                <p className="text-xs text-[#6b645c] mt-1">
                  Dokumentasi pakaian karya Rumah Jahit ZAHRIS yang telah selesai dikerjakan untuk para pelanggan.
                </p>
              </div>

              <Link
                href="/galeri"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#121212] hover:text-[#c29d59] group shrink-0"
              >
                <ImageIcon className="w-4 h-4 text-[#c29d59]" />
                <span>Lihat Semua Galeri</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {previewGallery.map((g) => (
                <div
                  key={g.id}
                  className="group relative aspect-4/3 rounded-xl overflow-hidden bg-[#faf7f2] border border-[#e2ded7] shadow-2xs"
                >
                  <Image
                    src={g.imageUrl}
                    alt={g.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <span className="text-[10px] text-[#c29d59] font-bold uppercase">{g.category}</span>
                    <h4 className="text-xs font-serif font-bold text-white line-clamp-1">{g.title}</h4>
                    {g.caption && <p className="text-[11px] text-[#d6cfc5] line-clamp-1">{g.caption}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7. ABOUT & KEUNGGULAN (BENEFITS)                             */}
        {/* ============================================================ */}
        <section className="py-14 md:py-20 bg-[#faf7f2]">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-4/3 sm:aspect-square w-full rounded-2xl overflow-hidden border border-[#e2ded7] shadow-sm">
                  <Image
                    src={about.imageUrl || '/images/hero-tailor.jpg'}
                    alt="Rumah Jahit ZAHRIS Tailoring"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 p-4 rounded-xl bg-[#121212] text-white text-xs border border-white/10 shadow-lg hidden sm:block">
                  <p className="font-serif font-bold text-sm text-[#c29d59]">Salamah Zahris</p>
                  <p className="text-[11px] text-[#9c9387]">Usaha Jahit Keluarga • Sejak 2018</p>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-[11px] font-bold tracking-widest text-[#c29d59] uppercase block mb-1">
                    {about.subtitle}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-[#121212]">
                    {about.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6b645c] mt-3 leading-relaxed">
                    {about.description}
                  </p>
                  <p className="text-xs sm:text-sm text-[#6b645c] mt-2 leading-relaxed">
                    {about.story}
                  </p>
                </div>

                {/* 5 Keunggulan Items */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-serif text-sm font-bold text-[#121212]">
                    Kenapa Memilih Rumah Jahit ZAHRIS?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {benefits.map((b) => (
                      <div key={b.id} className="p-3 bg-white rounded-xl border border-[#e2ded7] flex items-start gap-2.5 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#121212] block">{b.title}</strong>
                          <span className="text-[#6b645c] text-[11px] leading-snug block">{b.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 8. CARA PESAN (3 LANGKAH SEDERHANA)                          */}
        {/* ============================================================ */}
        <section className="py-14 md:py-20 bg-white border-y border-[#e2ded7]">
          <div className="container-custom max-w-4xl">
            <div className="text-center mb-10 space-y-2">
              <span className="text-[11px] font-bold tracking-widest text-[#c29d59] uppercase block">
                ALUR MUDAH
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#121212]">
                Cara Pesan di Rumah Jahit ZAHRIS
              </h2>
              <p className="text-xs text-[#6b645c]">
                Cukup 3 langkah mudah tanpa perlu registrasi akun atau checkout rumit:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {howToOrder.map((step) => (
                <div
                  key={step.step}
                  className="p-6 bg-[#faf7f2] rounded-2xl border border-[#e2ded7] text-center space-y-3 relative group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#121212] text-[#c29d59] font-mono font-bold text-base flex items-center justify-center mx-auto shadow-xs">
                    {step.step}
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#121212]">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#6b645c] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Informasi Pengambilan & Pengantaran */}
            <div className="mt-10 p-6 bg-[#faf4ea] rounded-2xl border border-[#eedcbe] text-xs text-[#6e531f] space-y-2">
              <h4 className="font-serif text-sm font-bold text-[#8c6b2d] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#8c6b2d]" />
                <span>{pickupDelivery.title}</span>
              </h4>
              <p>• {pickupDelivery.pickupInfo}</p>
              <p>• {pickupDelivery.deliveryInfo}</p>
              <p className="text-[11px] text-[#8c6b2d] italic pt-1">{pickupDelivery.note}</p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 9. FINAL WHATSAPP CTA                                        */}
        {/* ============================================================ */}
        <section className="py-16 md:py-24 bg-[#121212] text-white text-center">
          <div className="container-custom max-w-2xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <MessageCircle className="w-8 h-8" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              {finalCta.title}
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-[#b3aca2] leading-relaxed max-w-lg mx-auto">
              {finalCta.subtitle}
            </p>

            <div className="pt-2">
              <a
                href={finalCtaWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{finalCta.buttonText}</span>
              </a>
            </div>
          </div>
        </section>
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
