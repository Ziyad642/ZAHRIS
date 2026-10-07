import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { getWhatsAppSettings, getBusinessSettings } from '@/lib/db';
import { getWhatsAppUrl, generateWhatsAppMessage } from '@/lib/whatsapp';
import {
  Users,
  MessageCircle,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  Trophy,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Scissors
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Pesanan Borongan Seragam Sekolah & Kantor | Rumah Jahit ZAHRIS',
  description: 'Layanan pesanan jahit borongan seragam sekolah, olahraga, kantor, keluarga, dan komunitas di Rumah Jahit ZAHRIS. Konsultasi langsung via WhatsApp.',
};

export default async function BoronganPage() {
  const [waSettings, businessSettings] = await Promise.all([
    getWhatsAppSettings(),
    getBusinessSettings(),
  ]);

  const waNumber = waSettings.phoneNumber || '6282298149440';

  const bulkWaUrl = getWhatsAppUrl(
    waNumber,
    generateWhatsAppMessage({ type: 'bulk' }, waSettings)
  );

  const schoolWaUrl = getWhatsAppUrl(
    waNumber,
    generateWhatsAppMessage({ type: 'school_uniform', category: 'Sekolah' }, waSettings)
  );

  const ownDesignWaUrl = getWhatsAppUrl(
    waNumber,
    generateWhatsAppMessage({ type: 'own_design' }, waSettings)
  );

  const categories = [
    {
      title: 'Seragam Sekolah',
      desc: 'SD, SMP, SMA/SMK, seragam batik identitas, seragam olahraga siswa, pramuka, dan jas almamater.',
      icon: GraduationCap,
      examples: ['Seragam Putih Abu / Biru / Merah', 'Batik Khusus Sekolah', 'Pramuka Lengkap', 'Jas Almamater'],
      waText: 'Halo Rumah Jahit ZAHRIS 👋, saya ingin konsultasi pemesanan seragam sekolah.',
    },
    {
      title: 'Seragam Olahraga',
      desc: 'Setelan training dan kaos olahraga dryfit pori halus untuk sekolah, klub futsal/voli, atau komunitas senam.',
      icon: Trophy,
      examples: ['Kaos Dryfit Milano/Benzema', 'Celana Training Diadora/Lotto', 'Kombinasi Lis Warna'],
      waText: 'Halo Rumah Jahit ZAHRIS 👋, saya ingin konsultasi pemesanan seragam olahraga.',
    },
    {
      title: 'Seragam Kantor & Instansi',
      desc: 'Kemeja PDH, kemeja lapangan PDL, batik kantor seragam, dan wearpack kerja dengan jahitan kuat dan rapi.',
      icon: Briefcase,
      examples: ['American / Nagata Drill', 'Bordir Komputer Nama & Logo', 'Lidah Pangkat & Saku Pulpen'],
      waText: 'Halo Rumah Jahit ZAHRIS 👋, saya ingin konsultasi seragam kerja kantor.',
    },
    {
      title: 'Seragam Keluarga & Sarimbit',
      desc: 'Seragam keluarga untuk acara pernikahan, lamaran, pengajian, atau hari raya Idulfitri dalam jumlah banyak.',
      icon: HeartHandshake,
      examples: ['Gamis Ibu & Anak Perempuan', 'Kemeja Ayah & Anak Laki-laki', 'Ukuran Custom Masing-masing'],
      waText: 'Halo Rumah Jahit ZAHRIS 👋, saya ingin konsultasi seragam sarimbit keluarga.',
    },
    {
      title: 'Komunitas & Organisasi',
      desc: 'Polo shirt lacoste, jaket komunitas, kemeja angkatan, atau seragam paguyuban dengan bordir logo.',
      icon: Users,
      examples: ['Polo Shirt Lacoste Pique', 'Kemeja Safari / Outdoor', 'Bordir Dada & Punggung'],
      waText: 'Halo Rumah Jahit ZAHRIS 👋, saya ingin konsultasi seragam komunitas / organisasi.',
    },
    {
      title: 'Event & Acara Khusus',
      desc: 'Seragam panitia kepanitiaan, seminar, reuni akbar, gathering perusahaan, atau seragam tour.',
      icon: Calendar,
      examples: ['Kaos Event Katun Combed', 'Kemeja Panitia Semi-Formal', 'Rompi Kegiatan'],
      waText: 'Halo Rumah Jahit ZAHRIS 👋, saya ingin konsultasi seragam panitia event.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#faf7f2]">
      <Navbar whatsAppNumber={waNumber} />

      <main className="flex-1 py-12 md:py-16">
        <div className="container-custom space-y-12">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-[11px] font-bold tracking-widest text-[#c29d59] uppercase block">
              LAYANAN SPESIALIS KONVEKSI & TAILORING
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#121212]">
              Pesanan Borongan ZAHRIS
            </h1>
            <p className="text-xs md:text-sm text-[#6b645c] leading-relaxed">
              Untuk kebutuhan sekolah, olahraga, keluarga, kantor, komunitas, hingga event. Seluruh konsultasi dan pengiriman desain dapat dilakukan dengan mudah melalui WhatsApp.
            </p>
            <div className="pt-2">
              <a
                href={bulkWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konsultasi Borongan via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* School Uniform Special Highlight */}
          <div className="p-6 md:p-8 rounded-2xl bg-white border border-[#e2ded7] shadow-xs max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-[#c29d59] uppercase tracking-wider block">
                Khusus Sekolah & Yayasan Pendidikan
              </span>
              <h3 className="font-serif text-xl font-bold text-[#121212]">
                Sudah Punya Desain atau Logo Sekolah Sendiri?
              </h3>
              <p className="text-xs text-[#6b645c] max-w-xl">
                Cukup kirimkan file logo sekolah, foto contoh seragam, jumlah siswa, dan daftar ukuran melalui WhatsApp. Tim ZAHRIS siap membantu hitung kebutuhan bahan dan estimasi biayanya.
              </p>
            </div>

            <a
              href={schoolWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-[#121212] hover:bg-[#282624] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#c29d59]" />
              <span>Kirim Desain via WA</span>
            </a>
          </div>

          {/* 6 Kategori Borongan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              const catWaUrl = getWhatsAppUrl(waNumber, cat.waText);

              return (
                <div
                  key={idx}
                  className="p-6 bg-white rounded-2xl border border-[#e2ded7] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#faf4ea] text-[#c29d59] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#121212]">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-[#6b645c] leading-relaxed">
                      {cat.desc}
                    </p>

                    <div className="pt-2 border-t border-[#f4eee4] space-y-1">
                      <span className="text-[11px] font-bold text-[#121212] block">Contoh Pengerjaan:</span>
                      <ul className="text-[11px] text-[#6b645c] space-y-0.5">
                        {cat.examples.map((ex, eIdx) => (
                          <li key={eIdx}>• {ex}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#f4eee4]">
                    <a
                      href={catWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#faf7f2] hover:bg-[#ede7dd] border border-[#e2ded7] text-[#121212] text-xs font-semibold rounded-xl transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Konsultasi {cat.title}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Block: Sudah Punya Desain Sendiri */}
          <div className="p-8 bg-[#121212] text-white rounded-2xl text-center max-w-3xl mx-auto space-y-4">
            <h3 className="font-serif text-xl sm:text-2xl font-bold">
              Sudah Memiliki Desain Sendiri?
            </h3>
            <p className="text-xs sm:text-sm text-[#b3aca2] max-w-xl mx-auto leading-relaxed">
              Anda tidak perlu mengisi formulir panjang. Cukup kirimkan sketsa gambar, foto pakaian, file logo, atau screenshot referensi pakaian Anda langsung melalui WhatsApp kami.
            </p>
            <div className="pt-2">
              <a
                href={ownDesignWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim Desain via WhatsApp</span>
              </a>
            </div>
          </div>
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
