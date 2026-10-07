'use client';

import React, { useState } from 'react';
import {
  MessageCircle,
  Save,
  Check,
  AlertCircle,
  Phone,
  Smartphone,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { WhatsAppSettings } from '@/lib/types';

interface WhatsAppCMSClientProps {
  initialSettings: WhatsAppSettings;
}

export function WhatsAppCMSClient({ initialSettings }: WhatsAppCMSClientProps) {
  const [settings, setSettings] = useState<WhatsAppSettings>(initialSettings);
  const [phoneNumber, setPhoneNumber] = useState(initialSettings.phoneNumber);
  const [businessName, setBusinessName] = useState(initialSettings.businessName);
  const [defaultGreeting, setDefaultGreeting] = useState(initialSettings.defaultGreeting);
  const [defaultMessage, setDefaultMessage] = useState(initialSettings.defaultMessage);
  const [productTemplate, setProductTemplate] = useState(initialSettings.productTemplate);
  const [bulkTemplate, setBulkTemplate] = useState(initialSettings.bulkTemplate);
  const [customFabricTemplate, setCustomFabricTemplate] = useState(initialSettings.customFabricTemplate);
  const [ownDesignTemplate, setOwnDesignTemplate] = useState(initialSettings.ownDesignTemplate);

  // States
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const cleanNumber = (num: string) => {
    return num.replace(/[^0-9]/g, '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = cleanNumber(phoneNumber);
    if (!cleaned || cleaned.length < 9) {
      setErrorMsg('Nomor WhatsApp tidak valid. Gunakan format angka, contoh: 6282298149440');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/whatsapp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: cleaned,
          businessName: businessName.trim(),
          defaultGreeting: defaultGreeting.trim(),
          defaultMessage: defaultMessage.trim(),
          productTemplate: productTemplate.trim(),
          bulkTemplate: bulkTemplate.trim(),
          customFabricTemplate: customFabricTemplate.trim(),
          ownDesignTemplate: ownDesignTemplate.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan pengaturan.');

      setSettings(data.settings);
      setPhoneNumber(data.settings.phoneNumber);
      showToast('Pengaturan WhatsApp berhasil disimpan!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSaving(false);
    }
  };

  // Live test link
  const testWaUrl = `https://wa.me/${cleanNumber(phoneNumber)}?text=${encodeURIComponent(defaultMessage)}`;

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
      <div className="bg-white p-6 rounded-2xl border border-[#e5dcd0] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1f2937]">Integrasi & Pengaturan WhatsApp</h1>
          <p className="text-sm text-[#6b7280] mt-1 max-w-2xl leading-relaxed">
            Semua tombol konsultasi di seluruh website (katalog, borongan, navbar, floating button) akan otomatis mengarah ke nomor dan pesan ini.
          </p>
        </div>
        <a
          href={testWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-colors shrink-0 shadow-xs"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Uji Coba WhatsApp</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Container (2 cols) */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#e5dcd0] p-6 shadow-xs space-y-6">
            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Nomor Utama */}
            <div className="bg-[#faf7f2] p-5 rounded-xl border border-[#e5dcd0] space-y-4">
              <h2 className="font-serif font-bold text-sm text-[#1f2937] flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c29d59]" />
                <span>Nomor Kontak WhatsApp Resmi</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                    Nomor WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="6282298149440"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59] font-mono font-bold"
                    />
                  </div>
                  <p className="text-[11px] text-[#6b7280] mt-1">
                    Format: awali dengan 62 (contoh: 6281234567890). Tanpa spasi atau tanda +.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                    Nama Usaha di Pesan
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                  />
                  <p className="text-[11px] text-[#6b7280] mt-1">
                    Ditampilkan dalam sapaan awal format WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            {/* Template Pesan */}
            <div className="space-y-4">
              <h2 className="font-serif font-bold text-base text-[#1f2937] border-b border-[#f4eee4] pb-2">
                Template Pesan Otomatis Pelanggan
              </h2>
              <p className="text-xs text-[#6b7280]">
                Teks yang otomatis terisi ketika pelanggan menekan tombol WhatsApp di website, sehingga pelanggan tidak perlu repot mengetik dari awal.
              </p>

              {/* Default Umum */}
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  1. Pesan Konsultasi Umum (Tombol Navbar & Floating)
                </label>
                <textarea
                  rows={3}
                  value={defaultMessage}
                  onChange={(e) => setDefaultMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-xs focus:outline-none focus:border-[#c29d59] font-mono leading-relaxed"
                />
              </div>

              {/* Produk */}
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  2. Pesan Tanya Produk Katalog
                </label>
                <textarea
                  rows={4}
                  value={productTemplate}
                  onChange={(e) => setProductTemplate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-xs focus:outline-none focus:border-[#c29d59] font-mono leading-relaxed"
                />
                <p className="text-[11px] text-[#6b7280] mt-1">
                  Tag <code>[NAMA PRODUK]</code> dan <code>[KATEGORI]</code> akan digantikan otomatis dengan model yang dipilih pelanggan.
                </p>
              </div>

              {/* Borongan */}
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  3. Pesan Konsultasi Borongan Seragam
                </label>
                <textarea
                  rows={3}
                  value={bulkTemplate}
                  onChange={(e) => setBulkTemplate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-xs focus:outline-none focus:border-[#c29d59] font-mono leading-relaxed"
                />
              </div>

              {/* Kain Sendiri */}
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  4. Pesan Bawa Kain Sendiri
                </label>
                <textarea
                  rows={3}
                  value={customFabricTemplate}
                  onChange={(e) => setCustomFabricTemplate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-xs focus:outline-none focus:border-[#c29d59] font-mono leading-relaxed"
                />
              </div>

              {/* Punya Desain Sendiri */}
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  5. Pesan Punya Desain Sendiri
                </label>
                <textarea
                  rows={3}
                  value={ownDesignTemplate}
                  onChange={(e) => setOwnDesignTemplate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-xs focus:outline-none focus:border-[#c29d59] font-mono leading-relaxed"
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
                <span>{isSaving ? 'Menyimpan...' : 'Simpan Pengaturan WhatsApp'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview WhatsApp Box (1 col) */}
        <div>
          <div className="bg-[#121b22] text-white rounded-2xl border border-[#262422] p-5 shadow-lg sticky top-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-lg">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">{businessName}</p>
                <p className="text-[11px] text-[#25D366]">+{cleanNumber(phoneNumber)} • Online</p>
              </div>
            </div>

            <div className="text-xs text-[#8696a0] text-center mb-4 bg-white/5 py-1 px-2 rounded-md">
              Pratinjau Pesan yang Masuk ke WhatsApp
            </div>

            {/* Bubble Chat Customer */}
            <div className="bg-[#005c4b] p-3.5 rounded-xl rounded-tr-none text-white text-xs leading-relaxed font-sans shadow-xs whitespace-pre-line mb-3">
              {defaultMessage}
              <div className="text-[10px] text-white/60 text-right mt-1.5">Sekarang ✓✓</div>
            </div>

            {/* Bubble Chat Katalog Preview */}
            <div className="bg-[#005c4b] p-3.5 rounded-xl rounded-tr-none text-white text-xs leading-relaxed font-sans shadow-xs whitespace-pre-line">
              {productTemplate
                .replace('[NAMA PRODUK]', 'Gamis Aira Silk Mewah')
                .replace('[KATEGORI]', 'Gamis & Dress')}
              <div className="text-[10px] text-white/60 text-right mt-1.5">Sekarang ✓✓</div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <a
                href={testWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#25D366] hover:underline"
              >
                <span>Buka WhatsApp Web Langsung</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
