'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Check,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  UploadCloud,
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GalleryItem } from '@/lib/types';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface GalleryCMSClientProps {
  initialGallery: GalleryItem[];
}

const GALLERY_CATEGORIES = [
  'Sekolah',
  'Olahraga',
  'Keluarga',
  'Kantor',
  'Custom',
  'Vermak',
  'Lainnya',
];

export function GalleryCMSClient({ initialGallery }: GalleryCMSClientProps) {
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [selectedFilter, setSelectedFilter] = useState('Semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(GALLERY_CATEGORIES[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  // Status
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setCategory(GALLERY_CATEGORIES[0]);
    setImageUrl('');
    setCaption('');
    setOrder(gallery.length + 1);
    setIsActive(true);
    setFormError('');
    setIsModalOpen(true);
  };

  React.useEffect(() => {
    if (searchParams?.get('tambah') === '1') {
      openCreateModal();
    }
  }, [searchParams]);

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setImageUrl(item.imageUrl);
    setCaption(item.caption || '');
    setOrder(item.order || 1);
    setIsActive(item.isActive);
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Judul foto wajib diisi.');
      return;
    }
    if (!imageUrl) {
      setFormError('Silakan pilih/upload foto terlebih dahulu.');
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      if (editingItem) {
        const res = await fetch(`/api/gallery/${editingItem.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            category,
            imageUrl,
            caption: caption.trim(),
            order: Number(order) || 1,
            isActive,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal mengubah foto galeri.');

        setGallery((prev) =>
          prev.map((g) => (g.id === editingItem.id ? data.item : g))
        );
        showToast('Foto galeri berhasil diperbarui.');
      } else {
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            category,
            imageUrl,
            caption: caption.trim(),
            order: Number(order) || 1,
            isActive,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal menambahkan foto ke galeri.');

        setGallery((prev) => [data.item, ...prev]);
        showToast('Foto baru berhasil ditambahkan ke galeri.');
      }

      router.refresh();
      closeModal();
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (item: GalleryItem) => {
    try {
      const res = await fetch(`/api/gallery/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      if (!res.ok) throw new Error('Gagal mengubah status foto');
      const data = await res.json();
      setGallery((prev) => prev.map((g) => (g.id === item.id ? data.item : g)));
      router.refresh();
      showToast(`Status foto: ${!item.isActive ? 'Aktif' : 'Nonaktif'}`);
    } catch (err) {
      alert('Gagal mengubah status foto.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/gallery/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Gagal menghapus foto.');
      setGallery((prev) => prev.filter((g) => g.id !== deleteTarget.id));
      router.refresh();
      showToast('Foto galeri berhasil dihapus.');
      setDeleteTarget(null);
    } catch (err) {
      alert('Gagal menghapus foto.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredGallery = gallery.filter((g) => {
    if (selectedFilter === 'Semua') return true;
    return g.category.toLowerCase() === selectedFilter.toLowerCase();
  });

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e5dcd0] shadow-xs">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1f2937]">Galeri Hasil Jahitan</h1>
          <p className="text-sm text-[#6b7280] mt-1">
            Foto portofolio hasil jahitan seragam, kebaya, pakaian kerja, sarimbit keluarga, dan vermak.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#c29d59] hover:bg-[#b08c48] text-[#121212] font-semibold text-sm transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Foto Galeri</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedFilter('Semua')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            selectedFilter === 'Semua'
              ? 'bg-[#121212] text-white'
              : 'bg-white text-[#4b5563] border border-[#e5dcd0] hover:bg-[#faf7f2]'
          }`}
        >
          Semua Foto ({gallery.length})
        </button>
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedFilter === cat
                ? 'bg-[#121212] text-white'
                : 'bg-white text-[#4b5563] border border-[#e5dcd0] hover:bg-[#faf7f2]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredGallery.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e5dcd0] p-12 text-center">
          <ImageIcon className="w-12 h-12 text-[#9c9387] mx-auto mb-3 opacity-50" />
          <h3 className="font-serif text-lg font-bold text-[#1f2937]">Belum Ada Foto</h3>
          <p className="text-sm text-[#6b7280] max-w-md mx-auto mt-1">
            Belum ada foto dalam kategori {selectedFilter}. Klik tombol "Upload Foto Galeri" untuk menambahkan portofolio baru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#e5dcd0] overflow-hidden flex flex-col hover:border-[#c29d59]/70 transition-all shadow-xs group"
            >
              <div className="relative aspect-square bg-[#f4eee4] w-full">
                <Image
                  src={item.imageUrl || '/logo.jpg'}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#121212]/80 text-white backdrop-blur-xs">
                    {item.category}
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`p-1.5 rounded-full cursor-pointer transition-colors backdrop-blur-xs ${
                      item.isActive
                        ? 'bg-[#2d6a4f]/90 text-white hover:bg-[#2d6a4f]'
                        : 'bg-red-600/90 text-white hover:bg-red-600'
                    }`}
                    title={item.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  >
                    {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#1f2937] line-clamp-1">{item.title}</h3>
                  {item.caption && (
                    <p className="text-xs text-[#6b7280] line-clamp-2 mt-1 leading-relaxed">
                      {item.caption}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-[#f4eee4] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#9c9387]">Urutan #{item.order}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg text-[#1f2937] hover:bg-[#faf7f2] transition-colors cursor-pointer"
                      title="Edit Foto"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#e5dcd0] w-full max-w-lg my-8 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-[#e5dcd0] flex items-center justify-between bg-[#faf7f2]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1f2937]">
                  {editingItem ? 'Edit Portofolio Galeri' : 'Upload Foto Galeri'}
                </h3>
                <p className="text-xs text-[#6b7280]">
                  {editingItem ? 'Ubah judul atau foto portofolio.' : 'Pilih foto hasil jahitan dari HP atau galeri.'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 text-[#6b7280] hover:text-[#121212] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Foto Hasil Jahitan <span className="text-red-500">*</span>
                </label>
                <ImageUploader
                  currentImage={imageUrl}
                  onImageUploaded={(url: string) => setImageUrl(url)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Judul Portofolio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Seragam Batik Siswa SMP 1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                    Kategori Galeri
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59] bg-white"
                  >
                    {GALLERY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
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
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Keterangan Singkat / Caption (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Detail jahitan rapi dengan bahan American Drill tahan lama..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="galActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#c29d59] focus:ring-[#c29d59]"
                />
                <label htmlFor="galActive" className="text-xs font-medium text-[#374151] cursor-pointer">
                  Tampilkan foto ini di galeri website (Status Aktif)
                </label>
              </div>

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
                  {isSaving ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Upload & Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#e5dcd0] w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-center text-[#1f2937] mb-2">
              Hapus Foto Galeri?
            </h3>
            <p className="text-xs text-center text-[#6b7280] leading-relaxed mb-6">
              Yakin ingin menghapus foto <span className="font-bold text-[#1f2937]">"{deleteTarget.title}"</span>?
              <br />
              Foto yang dihapus tidak dapat dipulihkan.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#e5dcd0] text-xs font-semibold text-[#4b5563] hover:bg-[#faf7f2] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
