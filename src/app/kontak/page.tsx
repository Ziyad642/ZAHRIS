import React from 'react';
import { MapPin, Clock, Phone, MessageCircle, Mail, Scissors } from 'lucide-react';

function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { getBusinessSettings, getWhatsAppSettings } from '@/lib/db';
import { getWhatsAppUrl, generateWhatsAppMessage } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Kontak & Lokasi Workshop | Rumah Jahit ZAHRIS',
  description: 'Alamat, nomor WhatsApp, jam buka, dan peta petunjuk menuju workshop Rumah Jahit ZAHRIS di Jakarta Selatan.',
};

export default async function KontakPage() {
  const [settings, waSettings] = await Promise.all([
    getBusinessSettings(),
    getWhatsAppSettings(),
  ]);

  const waNumber = waSettings.phoneNumber || '6282298149440';
  const waUrl = getWhatsAppUrl(
    waNumber,
    generateWhatsAppMessage({ type: 'general' }, waSettings)
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar whatsAppNumber={waNumber} />

      <main className="flex-1 py-12 md:py-16">
        <div className="container-custom">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-[11px] font-bold tracking-widest text-[#c29d59] uppercase block mb-1">
              HUBUNGI KAMI
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#121212]">
              Kontak & Lokasi Workshop
            </h1>
            <p className="text-xs md:text-sm text-[#6b645c] mt-2 leading-relaxed">
              Kami siap menyambut kunjungan Anda untuk konsultasi bahan, fitting pakaian, atau penyerahan kain jahit langsung di workshop.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
            {/* Contact Details Card */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#e2ded7] p-6 md:p-8 shadow-xs space-y-6">
              <h2 className="font-serif text-xl font-bold text-[#121212] border-b border-[#f4eee4] pb-3">
                Informasi Workshop
              </h2>

              <div className="space-y-5 text-xs md:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#faf7f2] text-[#c29d59] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#121212] font-semibold">Alamat Lengkap:</strong>
                    <p className="text-[#6b645c] mt-0.5 leading-relaxed">
                      {settings.address}
                    </p>
                    <span className="text-[11px] text-[#c29d59] block mt-1">
                      (Patokan: Depan Jl. Cinyosog No.50, Burangkeng, Setu, Kab. Bekasi)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#faf7f2] text-[#c29d59] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#121212] font-semibold">Jam Operasional:</strong>
                    <p className="text-[#6b645c] mt-0.5 leading-relaxed">
                      {settings.openingHours}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#faf7f2] text-[#c29d59] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#121212] font-semibold">Nomor WhatsApp Resmi:</strong>
                    <p className="text-[#6b645c] mt-0.5">
                      {settings.phone || '0822-9814-9440'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#faf7f2] text-[#c29d59] flex items-center justify-center shrink-0 mt-0.5">
                    <InstagramIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#121212] font-semibold">Instagram:</strong>
                    <p className="text-[#6b645c] mt-0.5">
                      {settings.instagram}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#f4eee4]">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs md:text-sm font-bold uppercase tracking-wider shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat WhatsApp Sekarang</span>
                </a>
              </div>
            </div>

            {/* Map Placeholder & Instructions */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#e2ded7] p-6 md:p-8 shadow-xs flex flex-col justify-between space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#121212] mb-3">
                  Panduan Menuju Lokasi Workshop
                </h3>
                <p className="text-xs md:text-sm text-[#6b645c] leading-relaxed mb-6">
                  Workshop kami berada di lingkungan perumahan yang asri dan tenang dengan akses parkir motor serta mobil yang nyaman.
                </p>

                {/* Map Graphic Box */}
                <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-[#f4eee4] border border-[#e2ded7] flex items-center justify-center p-6 text-center">
                  <div className="space-y-2">
                    <MapPin className="w-8 h-8 text-[#c29d59] mx-auto animate-bounce" />
                    <span className="font-serif text-sm font-bold text-[#121212] block">
                      Rumah Jahit ZAHRIS
                    </span>
                    <p className="text-xs text-[#6b645c] max-w-sm">
                      {settings.address}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address || 'Depan Jl. Cinyosog No.50, Burangkeng, Kec. Setu, Kabupaten Bekasi, Jawa Barat 17320')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 px-4 py-1.5 bg-[#121212] text-white text-xs font-semibold rounded-md hover:bg-[#262422]"
                    >
                      Buka Google Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* Tips for Visiting */}
              <div className="p-4 rounded-xl bg-[#faf7f2] border border-[#e2ded7] text-xs space-y-2">
                <span className="font-bold text-[#121212] block">Tips Sebelum Berkunjung:</span>
                <ul className="space-y-1.5 text-[#6b645c] list-disc list-inside">
                  <li>Disarankan mengirim pesan WhatsApp sebelum datang untuk memastikan penjahit standby di workshop.</li>
                  <li>Jika membawa bahan kain sendiri, pastikan kain sudah dicuci atau disetrika awal jika berpotensi menyusut.</li>
                  <li>Bawa contoh baju yang paling pas sebagai referensi lingkar dada & panjang badan.</li>
                </ul>
              </div>
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
