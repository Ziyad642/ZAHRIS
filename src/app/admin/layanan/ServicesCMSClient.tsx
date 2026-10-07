'use client';

import React, { useState } from 'react';
import {
  Scissors,
  Edit3,
  Check,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { ServiceItem } from '@/lib/types';

interface ServicesCMSClientProps {
  initialServices: ServiceItem[];
}

export function ServicesCMSClient({ initialServices }: ServicesCMSClientProps) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaType, setCtaType] = useState<'whatsapp' | 'catalog' | 'borongan'>('whatsapp');
  const [order, setOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  // States
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openEditModal = (s: ServiceItem) => {
    setEditingService(s);
    setTitle(s.title);
    setDescription(s.description);
    setCtaText(s.ctaText);
    setCtaType(s.ctaType);
    setOrder(s.order || 1);
    setIsActive(s.isActive);
    setFormError('');
  };

  const closeModal = () => {
    setEditingService(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    if (!title.trim()) {
      setFormError('Judul layanan wajib diisi.');
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      const res = await fetch(`/api/services/${editingService.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          ctaText: ctaText.trim() || 'Konsultasi via WhatsApp',
          ctaType,
          order: Number(order) || 1,
          isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengubah layanan.');

      setServices((prev) =>
        prev.map((s) => (s.id === editingService.id ? data.service : s))
      );
      showToast('Layanan berhasil diperbarui.');
      closeModal();
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (s: ServiceItem) => {
    try {
      const res = await fetch(`/api/services/${s.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !s.isActive }),
      });
      if (!res.ok) throw new Error('Gagal mengubah status layanan');
      const data = await res.json();
      setServices((prev) => prev.map((item) => (item.id === s.id ? data.service : item)));
      showToast(`Status layanan diperbarui: ${!s.isActive ? 'Aktif' : 'Nonaktif'}`);
    } catch (err) {
      alert('Gagal mengubah status layanan.');
    }
  };

  const sortedServices = [...services].sort((a, b) => a.order - b.order);

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
        <h1 className="font-serif text-2xl font-bold text-[#1f2937]">Layanan Rumah Jahit ZAHRIS</h1>
        <p className="text-sm text-[#6b7280] mt-1 max-w-2xl leading-relaxed">
          Atur 4 pilar layanan utama yang tampil di beranda: Jasa Jahit (kain sendiri), Pre-Order (koleksi model), Bahan + Jahit (disediakan), dan Borongan (seragam banyak).
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sortedServices.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl border border-[#e5dcd0] p-6 flex flex-col justify-between hover:border-[#c29d59]/70 transition-all shadow-xs"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#faf7f2] border border-[#e5dcd0] flex items-center justify-center text-[#c29d59]">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-[#9c9387]">URUTAN #{s.order}</span>
                    <h3 className="font-serif font-bold text-lg text-[#1f2937]">{s.title}</h3>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleActive(s)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                    s.isActive
                      ? 'bg-[#d8f3dc] text-[#2d6a4f] hover:bg-[#b7e4c7]'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                  title={s.isActive ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}
                >
                  {s.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{s.isActive ? 'Aktif' : 'Nonaktif'}</span>
                </button>
              </div>

              <p className="text-xs text-[#6b7280] leading-relaxed mb-4">
                {s.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#f4eee4] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#9c9387]">
                <span>Tombol:</span>
                <span className="font-medium text-[#1f2937] bg-[#faf7f2] px-2 py-0.5 rounded border border-[#e5dcd0]">
                  {s.ctaText}
                </span>
              </div>

              <button
                onClick={() => openEditModal(s)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#faf7f2] hover:bg-[#ede4d5] text-[#1f2937] transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Layanan</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#e5dcd0] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#e5dcd0] flex items-center justify-between bg-[#faf7f2]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1f2937]">Edit Layanan</h3>
                <p className="text-xs text-[#6b7280]">
                  Sesuaikan judul, deskripsi, dan tombol aksi layanan.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 text-[#6b7280] hover:text-[#121212] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Nama Layanan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Deskripsi Layanan
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                    Teks Tombol CTA
                  </label>
                  <input
                    type="text"
                    required
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                    Tujuan Aksi Tombol
                  </label>
                  <select
                    value={ctaType}
                    onChange={(e) => setCtaType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59] bg-white"
                  >
                    <option value="whatsapp">Langsung ke WhatsApp</option>
                    <option value="catalog">Halaman Koleksi (/katalog)</option>
                    <option value="borongan">Halaman Borongan (/borongan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Urutan Tampil
                </label>
                <input
                  type="number"
                  min="1"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="serviceActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#c29d59] focus:ring-[#c29d59]"
                />
                <label htmlFor="serviceActive" className="text-xs font-medium text-[#374151] cursor-pointer">
                  Layanan aktif (Tampil di website publik)
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-[#e5dcd0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl border border-[#e5dcd0] text-xs font-semibold text-[#4b5563] hover:bg-[#faf7f2] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#c29d59] hover:bg-[#b08c48] text-[#121212] text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
