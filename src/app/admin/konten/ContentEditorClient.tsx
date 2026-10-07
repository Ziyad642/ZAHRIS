'use client';

import React, { useState } from 'react';
import { SiteContent } from '@/lib/types';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Check, AlertCircle, Sparkles, RefreshCw, Layers, HelpCircle } from 'lucide-react';

interface ContentEditorClientProps {
  initialContent: SiteContent;
}

export function ContentEditorClient({ initialContent }: ContentEditorClientProps) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'benefits' | 'howToOrder' | 'finalCta'>('hero');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan konten');

      setContent(data.content);
      setSuccessMessage('✓ Perubahan konten beranda berhasil disimpan ke database!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Alert Banners */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'hero', label: '1. Banner Utama (Hero)' },
          { id: 'about', label: '2. Tentang Kami' },
          { id: 'benefits', label: '3. Keunggulan' },
          { id: 'howToOrder', label: '4. Cara Pesan' },
          { id: 'finalCta', label: '5. Ajakan WA Bawah' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#121212] text-white shadow-xs'
                : 'bg-white hover:bg-[#faf7f2] border border-[#e2ded7] text-[#6b645c]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: HERO */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-2xl border border-[#e2ded7] p-6 sm:p-8 space-y-5">
          <h2 className="font-serif text-lg font-bold text-[#121212] border-b border-[#f4eee4] pb-3">
            Pengaturan Bagian Atas (Hero Banner)
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[#121212] mb-1">
              Teks Badge Kecil
            </label>
            <input
              type="text"
              value={content.hero.badgeText}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, badgeText: e.target.value },
                })
              }
              placeholder="Contoh: Usaha Jahit Keluarga Terpercaya Sejak 2018"
              className="w-full px-3 py-2 bg-[#faf7f2] border border-[#e2ded7] rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#121212] mb-1">
              Judul Utama (Headline) *
            </label>
            <input
              type="text"
              required
              value={content.hero.headline}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, headline: e.target.value },
                })
              }
              placeholder="Contoh: Jahit Rapi, Sesuai Kebutuhan Anda"
              className="w-full px-3 py-2 bg-[#faf7f2] border border-[#e2ded7] rounded-lg text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#121212] mb-1">
              Subjudul (Penjelasan Singkat) *
            </label>
            <textarea
              rows={3}
              required
              value={content.hero.subtitle}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, subtitle: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-[#faf7f2] border border-[#e2ded7] rounded-lg text-xs leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#121212] mb-1">
                Teks Tombol Utama (WhatsApp)
              </label>
              <input
                type="text"
                value={content.hero.primaryCtaText}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, primaryCtaText: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-[#faf7f2] border border-[#e2ded7] rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#121212] mb-1">
                Teks Tombol Kedua (Koleksi)
              </label>
              <input
                type="text"
                value={content.hero.secondaryCtaText}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, secondaryCtaText: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-[#faf7f2] border border-[#e2ded7] rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <ImageUploader
              value={content.hero.heroImage}
              onChange={(url) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, heroImage: url },
                })
              }
              label="Foto Latar Belakang Hero"
              description="Foto workshop atau penjahit untuk latar belakang banner utama."
            />
          </div>
        </div>
      )}

      {/* TAB 2: ABOUT */}
      {activeTab === 'about' && (
        <div className="bg-white rounded-2xl border border-[#e2ded7] p-6 sm:p-8 space-y-5">
          <h2 className="font-serif text-lg font-bold text-[#121212] border-b border-[#f4eee4] pb-3">
            Pengaturan Bagian Tentang Kami
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[#121212] mb-1">
              Judul Seksi
            </label>
            <input
              type="text"
              value={content.about.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, title: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-[#faf7f2] border border-[#e2ded7] rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#121212] mb-1">
              Subjudul / Tagline
            </label>
            <input
              type="text"
              value={content.about.subtitle}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, subtitle: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-[#faf7f2] border border-[#e2ded7] rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#121212] mb-1">
              Deskripsi Utama
            </label>
            <textarea
              rows={3}
              value={content.about.description}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, description: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-[#faf7f2] border border-[#e2ded7] rounded-lg text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#121212] mb-1">
              Kisah / Cerita Dedikasi Usaha Keluarga
            </label>
            <textarea
              rows={3}
              value={content.about.story}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, story: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-[#faf7f2] border border-[#e2ded7] rounded-lg text-xs leading-relaxed"
            />
          </div>

          <div>
            <ImageUploader
              value={content.about.imageUrl || '/images/hero-tailor.jpg'}
              onChange={(url) =>
                setContent({
                  ...content,
                  about: { ...content.about, imageUrl: url },
                })
              }
              label="Foto Bagian Tentang Kami"
              description="Foto penjahit, mesin jahit, atau suasana workshop."
            />
          </div>
        </div>
      )}

      {/* TAB 3: BENEFITS */}
      {activeTab === 'benefits' && (
        <div className="bg-white rounded-2xl border border-[#e2ded7] p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#f4eee4] pb-3">
            <h2 className="font-serif text-lg font-bold text-[#121212]">
              Pengaturan 5 Poin Keunggulan
            </h2>
            <p className="text-xs text-[#6b645c] mt-0.5">
              Poin alasan mengapa pelanggan memilih menjahit di Rumah Jahit ZAHRIS.
            </p>
          </div>

          <div className="space-y-4">
            {content.benefits.map((b, idx) => (
              <div key={b.id} className="p-4 bg-[#faf7f2] rounded-xl border border-[#e2ded7] space-y-3">
                <span className="text-[10px] font-bold text-[#c29d59] uppercase tracking-wider block">
                  Poin Keunggulan #{idx + 1}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-semibold text-[#121212] mb-1">Judul Poin</label>
                    <input
                      type="text"
                      value={b.title}
                      onChange={(e) => {
                        const next = [...content.benefits];
                        next[idx].title = e.target.value;
                        setContent({ ...content, benefits: next });
                      }}
                      className="w-full px-3 py-2 bg-white border border-[#e2ded7] rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#121212] mb-1">Penjelasan Singkat</label>
                    <input
                      type="text"
                      value={b.description}
                      onChange={(e) => {
                        const next = [...content.benefits];
                        next[idx].description = e.target.value;
                        setContent({ ...content, benefits: next });
                      }}
                      className="w-full px-3 py-2 bg-white border border-[#e2ded7] rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HOW TO ORDER */}
      {activeTab === 'howToOrder' && (
        <div className="bg-white rounded-2xl border border-[#e2ded7] p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#f4eee4] pb-3">
            <h2 className="font-serif text-lg font-bold text-[#121212]">
              Pengaturan 3 Langkah Cara Pesan
            </h2>
            <p className="text-xs text-[#6b645c] mt-0.5">
              Alur pemesanan mudah untuk memandu pelanggan baru.
            </p>
          </div>

          <div className="space-y-4">
            {content.howToOrder.map((step, idx) => (
              <div key={step.step} className="p-4 bg-[#faf7f2] rounded-xl border border-[#e2ded7] space-y-3">
                <span className="text-[10px] font-mono font-bold text-[#c29d59] uppercase tracking-wider block">
                  LANGKAH {step.step}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-semibold text-[#121212] mb-1">Judul Langkah</label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const next = [...content.howToOrder];
                        next[idx].title = e.target.value;
                        setContent({ ...content, howToOrder: next });
                      }}
                      className="w-full px-3 py-2 bg-white border border-[#e2ded7] rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#121212] mb-1">Deskripsi Langkah</label>
                    <input
                      type="text"
                      value={step.description}
                      onChange={(e) => {
                        const next = [...content.howToOrder];
                        next[idx].description = e.target.value;
                        setContent({ ...content, howToOrder: next });
                      }}
                      className="w-full px-3 py-2 bg-white border border-[#e2ded7] rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: FINAL CTA */}
      {activeTab === 'finalCta' && (
        <div className="bg-white rounded-2xl border border-[#e2ded7] p-6 sm:p-8 space-y-5">
          <h2 className="font-serif text-lg font-bold text-[#121212] border-b border-[#f4eee4] pb-3">
            Pengaturan Ajakan Konsultasi Terakhir (Bagian Bawah)
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[#121212] mb-1">
              Judul Ajakan
            </label>
            <input
              type="text"
              value={content.finalCta.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  finalCta: { ...content.finalCta, title: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-[#faf7f2] border border-[#e2ded7] rounded-lg text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#121212] mb-1">
              Kalimat Penjelas
            </label>
            <textarea
              rows={3}
              value={content.finalCta.subtitle}
              onChange={(e) =>
                setContent({
                  ...content,
                  finalCta: { ...content.finalCta, subtitle: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-[#faf7f2] border border-[#e2ded7] rounded-lg text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#121212] mb-1">
              Teks Tombol
            </label>
            <input
              type="text"
              value={content.finalCta.buttonText}
              onChange={(e) =>
                setContent({
                  ...content,
                  finalCta: { ...content.finalCta, buttonText: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-[#faf7f2] border border-[#e2ded7] rounded-lg text-xs"
            />
          </div>
        </div>
      )}

      {/* Submit Button Sticky */}
      <div className="p-4 bg-white rounded-2xl border border-[#e2ded7] shadow-sm flex items-center justify-between">
        <p className="text-xs text-[#6b645c]">
          Pastikan isi teks sudah sesuai sebelum menekan tombol simpan.
        </p>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-[#121212] hover:bg-[#282624] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin text-[#c29d59]" />
          ) : (
            <Check className="w-4 h-4 text-[#c29d59]" />
          )}
          <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
        </button>
      </div>
    </form>
  );
}
