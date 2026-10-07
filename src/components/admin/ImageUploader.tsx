'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, Upload, Trash2, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange?: (url: string) => void;
  currentImage?: string;
  onImageUploaded?: (url: string) => void;
  label?: string;
  description?: string;
}

export function ImageUploader({
  value,
  onChange,
  currentImage,
  onImageUploaded,
  label = 'Foto Produk Hasil Jahitan Sendiri',
  description = 'Foto hasil jahitan asli menggunakan kamera HP atau upload dari galeri/komputer.',
}: ImageUploaderProps) {
  const actualValue = currentImage !== undefined ? currentImage : (value || '');
  const triggerChange = (url: string) => {
    if (onChange) onChange(url);
    if (onImageUploaded) onImageUploaded(url);
  };
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [showSampleSelector, setShowSampleSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleImages = [
    { name: 'Gamis Aira Studio', url: '/images/product-gamis-aira.jpg' },
    { name: 'Kemeja Formal Toyobo', url: '/images/product-kemeja-formal.jpg' },
    { name: 'Dress Family Sarimbit', url: '/images/product-sarimbit.jpg' },
    { name: 'Celana Chino Custom', url: '/images/product-celana.jpg' },
    { name: 'Tunik Modern Silk', url: '/images/product-tunik.jpg' },
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    // Client-side quick check
    if (!file.type.startsWith('image/')) {
      setError('File yang dipilih harus berupa gambar (JPG, PNG, atau WEBP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('Ukuran foto terlalu besar. Maksimal 15MB.');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengunggah foto.');
      }

      triggerChange(data.url);
    } catch (err: any) {
      setError(err.message || 'Gagal mengunggah foto ke server.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    triggerChange('');
    setError('');
  };

  return (
    <div className="space-y-3">
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
          className="text-[11px] text-[#c29d59] hover:text-[#a07e3e] font-semibold underline underline-offset-2 flex items-center gap-1"
        >
          <ImageIcon className="w-3 h-3" />
          <span>{showSampleSelector ? 'Tutup Pilihan Sample' : 'Gunakan Sample Bawaan'}</span>
        </button>
      </div>

      {/* Hidden native input with camera & gallery capture support */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Sample Selector Dropdown if toggled */}
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
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
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

      {/* Upload Area / Current Preview */}
      {actualValue ? (
        /* Preview Card */
        <div className="p-4 bg-[#faf7f2] border border-[#e2ded7] rounded-2xl flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-36 h-48 sm:w-28 sm:h-36 rounded-xl overflow-hidden border border-[#d6cfc5] shadow-xs shrink-0 bg-white">
            <Image
              src={actualValue}
              alt="Preview Foto Pakaian"
              fill
              className="object-cover"
              sizes="150px"
            />
          </div>

          <div className="space-y-2 flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Foto Pakaian Terpasang</span>
            </div>

            <p className="text-xs text-[#121212] font-medium break-all">
              {actualValue.startsWith('/uploads/') ? 'Foto hasil upload workshop' : actualValue}
            </p>
            <p className="text-[11px] text-[#6b645c]">
              Foto ini akan ditampilkan di halaman katalog dan detail produk pelanggan.
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e2ded7] hover:border-[#121212] text-[#121212] text-xs font-semibold rounded-lg shadow-2xs transition-colors"
              >
                {uploading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c29d59]" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-[#c29d59]" />
                )}
                <span>{uploading ? 'Mengunggah...' : 'Ganti Foto'}</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Drag & Drop / Click to Upload Box */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-[#c29d59] bg-[#faf4ea]'
              : 'border-[#d6cfc5] hover:border-[#c29d59] bg-[#faf7f2] hover:bg-[#f7f2ea]'
          }`}
        >
          {uploading ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white border border-[#e2ded7] flex items-center justify-center shadow-xs">
                <RefreshCw className="w-6 h-6 animate-spin text-[#c29d59]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#121212]">Sedang Mengunggah Foto Pakaian...</p>
                <p className="text-[11px] text-[#6b645c] mt-0.5">Mohon tunggu beberapa saat.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#e2ded7] flex items-center justify-center shadow-xs text-[#c29d59] group-hover:scale-105 transition-transform">
                <Camera className="w-7 h-7 text-[#121212]" />
              </div>

              <div>
                <p className="text-xs sm:text-sm font-bold text-[#121212]">
                  Foto Sendiri & Upload Hasil Jahitan
                </p>
                <p className="text-[11px] text-[#6b645c] mt-1 max-w-sm mx-auto">
                  Ketuk di sini untuk <strong className="text-[#121212]">buka Kamera HP</strong> dan foto baju di manekin/meja jahit, atau pilih dari galeri.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#121212] hover:bg-[#262422] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors">
                <Upload className="w-3.5 h-3.5 text-[#c29d59]" />
                <span>Pilih / Ambil Foto</span>
              </div>

              <p className="text-[10px] text-[#9c9387]">
                Mendukung JPG, PNG, WEBP (maksimal 15MB)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
