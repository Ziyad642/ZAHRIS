import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Phone, Scissors, Lock } from 'lucide-react';
import { getWhatsAppUrl, generateWhatsAppMessage } from '@/lib/whatsapp';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface FooterProps {
  businessName?: string;
  address?: string;
  openingHours?: string;
  instagram?: string;
  whatsAppNumber?: string;
}

export function Footer({
  businessName = 'Rumah Jahit ZAHRIS',
  address = 'Depan Jl. Cinyosog No.50, Burangkeng, Kec. Setu, Kabupaten Bekasi, Jawa Barat 17320',
  openingHours = 'Senin – Sabtu: 08:30 – 17:30 WIB (Minggu: Dengan Perjanjian)',
  instagram = '@rumahjahit.zahris',
  whatsAppNumber = '6282298149440',
}: FooterProps) {
  const currentYear = 2026;
  const waUrl = getWhatsAppUrl(whatsAppNumber, generateWhatsAppMessage({ type: 'general' }));

  return (
    <footer className="bg-[#121212] text-[#f4eee4] border-t border-[#262422] mt-auto">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Brand Info with Authentic Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/20 bg-black shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="Rumah Jahit ZAHRIS"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold tracking-tight text-white uppercase">
                  {businessName}
                </h3>
                <p className="text-xs text-[#c29d59] font-medium tracking-wider">
                  SALAMAH ZAHRIS • SEJAK 2018
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-[#b3aca2]">
              Usaha jasa jahit keluarga terpercaya yang mengutamakan hasil rapi, ketepatan pola, dan kenyamanan pemakai. Melayani jahit custom, pakaian keluarga, seragam, dan vermak.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-[#c29d59]">
              <Scissors className="w-3.5 h-3.5" />
              <span>Keahlian & Ketelitian Sejak 2018</span>
            </div>
          </div>

          {/* Navigasi Menu */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-white uppercase border-b border-[#333333] pb-2">
              Menu Cepat
            </h4>
            <ul className="space-y-2 text-xs text-[#b3aca2]">
              <li>
                <Link href="/" className="hover:text-[#c29d59] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/#layanan" className="hover:text-[#c29d59] transition-colors">
                  Layanan Jahit
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-[#c29d59] transition-colors">
                  Koleksi Pakaian
                </Link>
              </li>
              <li>
                <Link href="/borongan" className="hover:text-[#c29d59] transition-colors">
                  Pesanan Borongan
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-[#c29d59] transition-colors">
                  Galeri Karya Jahit
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-[#c29d59] transition-colors">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Layanan Utama */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-white uppercase border-b border-[#333333] pb-2">
              Layanan Kami
            </h4>
            <ul className="space-y-2 text-xs text-[#b3aca2]">
              <li>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#c29d59] transition-colors">
                  Jasa Jahit (Bawa Kain Sendiri)
                </a>
              </li>
              <li>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#c29d59] transition-colors">
                  Pre-Order Model ZAHRIS
                </a>
              </li>
              <li>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#c29d59] transition-colors">
                  Paket Bahan + Jahit
                </a>
              </li>
              <li>
                <Link href="/borongan" className="hover:text-[#c29d59] transition-colors">
                  Seragam Sekolah & Kantor
                </Link>
              </li>
              <li>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#c29d59] transition-colors">
                  Vermak & Perbaikan Busana
                </a>
              </li>
            </ul>
          </div>

          {/* Workshop Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-white uppercase border-b border-[#333333] pb-2">
              Workshop & Kontak
            </h4>
            <div className="space-y-2.5 text-xs text-[#b3aca2]">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Depan Jl. Cinyosog No.50, Burangkeng, Kec. Setu, Kabupaten Bekasi, Jawa Barat 17320')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-[#c29d59] transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#c29d59] shrink-0 mt-0.5" />
                <span>{address}</span>
              </a>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#c29d59] shrink-0 mt-0.5" />
                <span>{openingHours}</span>
              </div>
              <a
                href="https://instagram.com/rumahjahit.zahris"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-[#c29d59] transition-colors"
              >
                <InstagramIcon className="w-4 h-4 text-[#c29d59] shrink-0" />
                <span>{instagram}</span>
              </a>
              <div className="pt-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Chat WhatsApp ZAHRIS</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#262422] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716c]">
          <p>
            © {currentYear} {businessName}. Hak cipta dilindungi undang-undang.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-[#57534e]">Crafted for Tailoring Excellence</span>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 text-[11px] text-[#78716c] hover:text-[#c29d59] transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
