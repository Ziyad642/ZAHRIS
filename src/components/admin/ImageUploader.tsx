'use client';

import React, { useState, useId } from 'react';
import Image from 'next/image';
import {
  Camera,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
  FolderOpen,
} from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange?: (url: string) => void;
  currentImage?: string;
  onImageUploaded?: (url: string) => void;
  label?: string;
  description?: string;
}

// Helper: Kompresi gambar client-side via HTML5 Canvas agar ringan dan cepat di HP
async function compressImageClientSide(file: File, maxWidth = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file foto'));
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('Format foto tidak valid'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback ke data URL asli jika canvas gagal
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({
  value,
  onChange,
  currentImage,
  onImageUploaded,
  label = 'Foto Produk Hasil Jahitan Sendiri',
  description = 'Foto hasil jahitan asli menggunakan kamera HP atau upload dari galeri.',
}: ImageUploaderProps) {
  const actualValue = currentImage !== undefined ? currentImage : (value || '');
  const uniqueId = useId().replace(/:/g, '');
  const cameraInputId = `camera-input-${uniqueId}`;
  const galleryInputId = `gallery-input-${uniqueId}`;

  const triggerChange = (url: string) => {
    if (onChange) onChange(url);
    if (onImageUploaded) onImageUploaded(url);
  };

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showSampleSelector, setShowSampleSelector] = useState(false);

  const sampleImages = [
    { name: 'Gamis Aira Studio', url: '/images/product-gamis-aira.jpg' },
    { name: 'Kemeja Formal Toyobo', url: '/images/product-kemeja-formal.jpg' },
    { name: 'Dress Family Sarimbit', url: '/images/product-sarimbit.jpg' },
    { name: 'Celana Chino Custom', url: '/images/product-celana.jpg' },
    { name: 'Tunik Modern Silk', url: '/images/product-tunik.jpg' },
  ];

  const handleFileSelected = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('File yang dipilih harus berupa foto/gambar.');
      return;
    }

    setError('');
    setUploading(true);

    try {
      // 1. Kompresi gambar client-side (dari 8MB kamera HP menjadi ~150KB)
      const compressedDataUrl = await compressImageClientSide(file);

      // Coba upload ke endpoint /api/upload (jika ada file sistem lokal)
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            triggerChange(data.url);
            setUploading(false);
            return;
          }
        }
      } catch (apiErr) {
        // Abaikan error API upload jika berjalan di lingkungan serverless
      }

      // 2. Fallback langsung menggunakan Data URL (100% bekerja di Vercel tanpa filesystem)
      triggerChange(compressedDataUrl);
    } catch (err: any) {
      setError(err.message || 'Gagal memproses foto.');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelected(files[0]);
    }
    // Reset nilai agar bisa memilih file yang sama lagi jika perlu
    e.target.value = '';
  };

  const handleRemove = () => {
    triggerChange('');
    setError('');
  };

  return (
    <div className="space-y-3">
      {/* Label Header */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block font-semibold text-[#121212] text-xs">
            {label} <span className="text-red-500">*</span>
          </label>
          <p className="text-[11px] text-[#6b645c] mt-0.5">{description}</p>
        </div>

        <button
          type="button"
          onClick={() => setShowSampleSelector(!showSampleSelector)}
          className="text-[11px] text-[#c29d59] hover:text-[#a07e3e] font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
        >
          <ImageIcon className="w-3 h-3" />
          <span>{showSampleSelector ? 'Tutup Sample' : 'Gunakan Sample'}</span>
        </button>
      </div>

      {/* Input Kamera HP (Native - langsung membuka kamera di Android & iOS) */}
      <input
        id={cameraInputId}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleInputChange}
        className="sr-only"
      />

      {/* Input Galeri HP / File Manager */}
      <input
        id={galleryInputId}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="sr-only"
      />

      {/* Pesan Error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Sample Selector Dropdown */}
      {showSampleSelector && (
        <div className="p-3 bg-[#faf7f2] border border-[#e2ded7] rounded-xl space-y-2 text-xs">
          <p className="font-semibold text-[#121212]">Pilih dari foto sample bawaan:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {sampleImages.map((s) => (
              <button
                key={s.url}
                type="button"
                onClick={() => {
                  triggerChange(s.url);
                  setShowSampleSelector(false);
                }}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                  actualValue === s.url
                    ? 'border-[#c29d59] bg-[#f5efe4] font-semibold text-[#121212]'
                    : 'border-[#e2ded7] bg-white hover:border-[#121212] text-[#6b645c]'
                }`}
              >
                <div className="w-8 h-8 rounded relative shrink-0 overflow-hidden bg-gray-100">
                  <Image src={s.url} alt={s.name} fill className="object-cover" />
                </div>
                <span className="text-[11px] truncate">{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* KONDISI 1: SUDAH ADA FOTO (PREVIEW CARD) */}
      {actualValue ? (
        <div className="p-4 bg-[#faf7f2] border border-[#e2ded7] rounded-2xl flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-36 h-48 sm:w-28 sm:h-36 rounded-xl overflow-hidden border border-[#d6cfc5] shadow-xs shrink-0 bg-white">
            {actualValue.startsWith('data:') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={actualValue}
                alt="Preview Foto Pakaian"
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={actualValue}
                alt="Preview Foto Pakaian"
                fill
                className="object-cover"
                sizes="150px"
              />
            )}
          </div>

          <div className="space-y-2.5 flex-1 text-center sm:text-left w-full">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Foto Pakaian Terpasang</span>
            </div>

            <p className="text-xs text-[#121212] font-medium break-all">
              {actualValue.startsWith('data:')
                ? 'Foto kamera HP (tersimpan)'
                : actualValue.startsWith('/uploads/')
                ? 'Foto hasil upload workshop'
                : actualValue}
            </p>

            <p className="text-[11px] text-[#6b645c]">
              Foto ini langsung tampil di halaman katalog dan detail produk pelanggan.
            </p>

            {/* Tombol Aksi di HP (Menggunakan native label untuk membuka kamera/galeri tanpa batas klik) */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              {/* Tombol Ganti via Kamera HP */}
              <label
                htmlFor={cameraInputId}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#c29d59] text-[#121212] hover:bg-[#faf4ea] text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer touch-manipulation active:scale-95"
              >
                {uploading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c29d59]" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-[#c29d59]" />
                )}
                <span>{uploading ? 'Memproses...' : 'Kamera HP'}</span>
              </label>

              {/* Tombol Ganti dari Galeri */}
              <label
                htmlFor={galleryInputId}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#e2ded7] hover:border-[#121212] text-[#121212] text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer touch-manipulation active:scale-95"
              >
                <FolderOpen className="w-3.5 h-3.5 text-[#6b645c]" />
                <span>Pilih Galeri</span>
              </label>

              {/* Tombol Hapus */}
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1 px-2.5 py-2 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer touch-manipulation"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* KONDISI 2: BELUM ADA FOTO (BOX UPLOAD BESAR DENGAN 2 TOMBOL JELAS UNTUK HP) */
        <div className="relative border-2 border-dashed border-[#d6cfc5] rounded-2xl p-5 sm:p-7 text-center bg-[#faf7f2]">
          {uploading ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white border border-[#e2ded7] flex items-center justify-center shadow-xs">
                <RefreshCw className="w-6 h-6 animate-spin text-[#c29d59]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#121212]">Sedang Memproses Foto Pakaian...</p>
                <p className="text-[11px] text-[#6b645c] mt-0.5">Mohon tunggu sebentar.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#e2ded7] flex items-center justify-center shadow-xs text-[#c29d59]">
                <Camera className="w-7 h-7 text-[#121212]" />
              </div>

              <div>
                <p className="text-xs sm:text-sm font-bold text-[#121212]">
                  Foto Sendiri & Upload Hasil Jahitan
                </p>
                <p className="text-[11px] text-[#6b645c] mt-1 max-w-sm mx-auto">
                  Tukang jahit bisa langsung foto pakaian di manekin/meja menggunakan HP, atau ambil dari galeri.
                </p>
              </div>

              {/* Dua Tombol Jelas & Responsif untuk Layar HP */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto pt-1">
                {/* 1. Tombol Buka Kamera HP */}
                <label
                  htmlFor={cameraInputId}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#c29d59] hover:bg-[#b08c48] text-[#121212] text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer touch-manipulation"
                >
                  <Camera className="w-4 h-4 text-[#121212]" />
                  <span>Ambil Foto Kamera HP</span>
                </label>

                {/* 2. Tombol Pilih dari Galeri */}
                <label
                  htmlFor={galleryInputId}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#121212] hover:bg-[#262422] text-white text-xs font-semibold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer touch-manipulation"
                >
                  <Upload className="w-4 h-4 text-[#c29d59]" />
                  <span>Pilih dari Galeri</span>
                </label>
              </div>

              <p className="text-[10px] text-[#9c9387]">
                Mendukung semua format foto HP (JPG, PNG, WEBP). Otomatis dioptimalkan.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
