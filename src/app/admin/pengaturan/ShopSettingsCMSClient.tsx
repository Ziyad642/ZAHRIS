'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Settings,
  Save,
  Check,
  AlertCircle,
  MapPin,
  Clock,
  Mail,
  Phone,
  Compass,
  RotateCcw,
} from 'lucide-react';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
import { BusinessSettings } from '@/lib/types';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface ShopSettingsCMSClientProps {
  initialSettings: BusinessSettings;
}

export function ShopSettingsCMSClient({ initialSettings }: ShopSettingsCMSClientProps) {
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);

  // Form Fields
  const [businessName, setBusinessName] = useState(initialSettings.businessName);
  const [tagline, setTagline] = useState(initialSettings.tagline);
  const [logoUrl, setLogoUrl] = useState(initialSettings.logoUrl);
  const [address, setAddress] = useState(initialSettings.address);
  const [openingHours, setOpeningHours] = useState(initialSettings.openingHours);
  const [instagram, setInstagram] = useState(initialSettings.instagram || '');
  const [mapsUrl, setMapsUrl] = useState(initialSettings.mapsUrl || '');
  const [phone, setPhone] = useState(initialSettings.phone || '');
  const [email, setEmail] = useState(initialSettings.email || '');

  // States
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const resetToOfficialLogo = () => {
    setLogoUrl('/logo.jpg');
    showToast('Logo diatur kembali ke Logo Resmi Rumah Jahit ZAHRIS.');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setErrorMsg('Nama usaha wajib diisi.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: businessName.trim(),
          tagline: tagline.trim(),
          logoUrl,
          address: address.trim(),
          openingHours: openingHours.trim(),
          instagram: instagram.trim(),
          mapsUrl: mapsUrl.trim(),
          phone: phone.trim(),
          email: email.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan pengaturan.');

      setSettings(data.settings);
      showToast('Informasi toko & bisnis berhasil disimpan!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-[#2d6a4f] text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-3">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5dcd0] shadow-xs">
        <h1 className="font-serif text-2xl font-bold text-[#1f2937]">Pengaturan Profil & Usaha</h1>
        <p className="text-sm text-[#6b7280] mt-1 max-w-2xl leading-relaxed">
          Kelola identitas resmi Rumah Jahit ZAHRIS, alamat workshop untuk pelanggan bawa kain/fitting, jam buka operasional, dan akun media sosial.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form (2 cols) */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#e5dcd0] p-6 shadow-xs space-y-6">
            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Identitas Brand & Logo */}
            <div className="space-y-4">
              <h2 className="font-serif font-bold text-base text-[#1f2937] border-b border-[#f4eee4] pb-2">
                1. Identitas Usaha & Logo
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                    Nama Usaha <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                    Slogan / Tagline
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                  />
                </div>
              </div>

              {/* Logo Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider">
                    Logo Resmi Toko
                  </label>
                  <button
                    type="button"
                    onClick={resetToOfficialLogo}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#c29d59] hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Gunakan Logo Asli ZAHRIS (/logo.jpg)</span>
                  </button>
                </div>
                <ImageUploader
                  currentImage={logoUrl}
                  onImageUploaded={(url: string) => setLogoUrl(url)}
                />
              </div>
            </div>

            {/* Alamat & Jam Buka */}
            <div className="space-y-4 pt-4 border-t border-[#f4eee4]">
              <h2 className="font-serif font-bold text-base text-[#1f2937] border-b border-[#f4eee4] pb-2">
                2. Lokasi Workshop & Jam Operasional
              </h2>

              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Alamat Lengkap Workshop <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Depan Jl. Cinyosog No.50, Burangkeng, Kec. Setu, Kabupaten Bekasi, Jawa Barat 17320..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                />
                <p className="text-[11px] text-[#6b7280] mt-1">
                  Alamat ini tampil di footer dan petunjuk jahit bagi pelanggan yang membawa kain sendiri.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Jam Buka Operasional
                </label>
                <input
                  type="text"
                  placeholder="Senin – Sabtu: 08:30 – 17:30 WIB"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Link Google Maps (URL)
                </label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/..."
                  value={mapsUrl}
                  onChange={(e) => setMapsUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                />
              </div>
            </div>

            {/* Kontak & Media Sosial */}
            <div className="space-y-4 pt-4 border-t border-[#f4eee4]">
              <h2 className="font-serif font-bold text-base text-[#1f2937] border-b border-[#f4eee4] pb-2">
                3. Kontak & Media Sosial
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                    Telepon / No. HP
                  </label>
                  <input
                    type="text"
                    placeholder="0822-9814-9440"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                    Akun Instagram
                  </label>
                  <input
                    type="text"
                    placeholder="@rumahjahit.zahris"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Email Usaha (Opsional)
                </label>
                <input
                  type="email"
                  placeholder="kontak@zahris.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#e5dcd0] flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c29d59] hover:bg-[#b08c48] text-[#121212] font-bold text-sm transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan Profil'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card (1 col) */}
        <div>
          <div className="bg-[#121212] text-white rounded-2xl border border-[#262422] p-6 shadow-lg sticky top-6">
            <h3 className="font-serif font-bold text-sm text-[#c29d59] uppercase tracking-wider mb-4">
              Pratinjau Informasi Toko
            </h3>

            <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-white/10">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#c29d59]/50 bg-black shrink-0">
                <Image
                  src={logoUrl || '/logo.jpg'}
                  alt={businessName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-white">{businessName}</h4>
                <p className="text-xs text-[#c29d59]">{tagline}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-[#a39e93]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#c29d59] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Alamat Workshop</p>
                  <p className="leading-relaxed mt-0.5">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#c29d59] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Jam Operasional</p>
                  <p className="mt-0.5">{openingHours}</p>
                </div>
              </div>

              {phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#c29d59] shrink-0" />
                  <div>
                    <span className="font-semibold text-white">{phone}</span>
                  </div>
                </div>
              )}

              {instagram && (
                <div className="flex items-center gap-3">
                  <InstagramIcon className="w-4 h-4 text-[#c29d59] shrink-0" />
                  <div>
                    <span className="font-semibold text-white">{instagram}</span>
                  </div>
                </div>
              )}

              {email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#c29d59] shrink-0" />
                  <div>
                    <span className="font-semibold text-white">{email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
