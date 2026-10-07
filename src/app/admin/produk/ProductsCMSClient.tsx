'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  Edit3,
  Shirt,
  Search,
  Check,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  UploadCloud,
  ImageIcon,
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductItem, CategoryItem } from '@/lib/types';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface ProductsCMSClientProps {
  initialProducts: ProductItem[];
  categories: CategoryItem[];
}

export function ProductsCMSClient({ initialProducts, categories }: ProductsCMSClientProps) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Modal State: Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [badge, setBadge] = useState('');
  const [caption, setCaption] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  // Status & Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<ProductItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setCategoryId(categories[0]?.id || '');
    setDescription('');
    setImages([]);
    setBadge('');
    setCaption('');
    setOrder(products.length + 1);
    setIsActive(true);
    setFormError('');
    setIsModalOpen(true);
  };

  React.useEffect(() => {
    if (searchParams?.get('tambah') === '1') {
      openCreateModal();
    }
  }, [searchParams]);

  const openEditModal = (p: ProductItem) => {
    setEditingProduct(p);
    setName(p.name);
    setCategoryId(p.categoryId);
    setDescription(p.description || '');
    setImages(p.images && p.images.length > 0 ? p.images : []);
    setBadge(p.badge || '');
    setCaption(p.caption || '');
    setOrder(p.order || 1);
    setIsActive(p.isActive);
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setFormError('Nama produk wajib diisi.');
      return;
    }

    const matchedCat = categories.find((c) => c.id === categoryId);
    const categoryName = matchedCat ? matchedCat.name : 'Lainnya';

    const finalImages =
      images.filter(Boolean).length > 0
        ? images.filter(Boolean)
        : ['/images/product-gamis-aira.jpg'];

    setIsSaving(true);
    setFormError('');

    try {
      if (editingProduct) {
        // Update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            categoryId,
            categoryName,
            description,
            images: finalImages,
            badge: badge.trim() || undefined,
            caption: caption.trim() || undefined,
            order: Number(order) || 1,
            isActive,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Gagal menyimpan perubahan produk.');
        }

        const data = await res.json();
        setProducts((prev) =>
          prev.map((item) => (item.id === editingProduct.id ? data.product : item))
        );
        showToast('Perubahan produk berhasil disimpan dan otomatis tayang di website.');
      } else {
        // Create
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            categoryId,
            categoryName,
            description,
            images: finalImages,
            badge: badge.trim() || undefined,
            caption: caption.trim() || undefined,
            order: Number(order) || 1,
            isActive,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Gagal menambahkan produk baru.');
        }

        const data = await res.json();
        setProducts((prev) => [data.product, ...prev]);
        showToast('Produk baru berhasil ditambahkan dan otomatis tayang di katalog website!');
      }

      router.refresh();
      closeModal();
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan saat menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (p: ProductItem) => {
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !p.isActive }),
      });
      if (!res.ok) throw new Error('Gagal mengubah status produk');
      const data = await res.json();
      setProducts((prev) => prev.map((item) => (item.id === p.id ? data.product : item)));
      router.refresh();
      showToast(`Status produk diperbarui: ${!p.isActive ? 'Aktif' : 'Nonaktif'}`);
    } catch (err) {
      alert('Gagal mengubah status produk.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Gagal menghapus produk');
      setProducts((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      router.refresh();
      showToast('Produk berhasil dihapus dari website.');
      setDeleteTarget(null);
    } catch (err) {
      alert('Gagal menghapus produk.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'Semua' || p.categoryId === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
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

      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e5dcd0] shadow-xs">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1f2937]">Katalog Produk & Contoh Jahitan</h1>
          <p className="text-sm text-[#6b7280] mt-1">
            Kelola model pakaian yang tampil di halaman Koleksi. Pelanggan dapat menanyakan setiap model langsung via WhatsApp.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#c29d59] hover:bg-[#b08c48] text-[#121212] font-semibold text-sm transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9c9387]" />
          <input
            type="text"
            placeholder="Cari nama produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e5dcd0] bg-white text-sm focus:outline-none focus:border-[#c29d59]"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('Semua')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'Semua'
                ? 'bg-[#121212] text-white'
                : 'bg-white text-[#4b5563] border border-[#e5dcd0] hover:bg-[#faf7f2]'
            }`}
          >
            Semua ({products.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-[#121212] text-white'
                  : 'bg-white text-[#4b5563] border border-[#e5dcd0] hover:bg-[#faf7f2]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid / List */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e5dcd0] p-12 text-center">
          <Shirt className="w-12 h-12 text-[#9c9387] mx-auto mb-3 opacity-50" />
          <h3 className="font-serif text-lg font-bold text-[#1f2937]">Belum Ada Produk</h3>
          <p className="text-sm text-[#6b7280] max-w-md mx-auto mt-1">
            {search
              ? 'Tidak ada produk yang cocok dengan pencarian Anda.'
              : 'Belum ada produk pada kategori ini. Silakan tambahkan produk baru.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((p) => {
            const mainImg = p.images?.[0] || '/logo.jpg';
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-[#e5dcd0] overflow-hidden flex flex-col hover:border-[#c29d59]/60 transition-all shadow-xs"
              >
                {/* Image & Badges */}
                <div className="relative aspect-4/3 bg-[#f4eee4] w-full">
                  <Image
                    src={mainImg}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#121212]/80 text-white backdrop-blur-xs">
                      {p.categoryName}
                    </span>
                    {p.badge && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#c29d59] text-[#121212]">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleToggleActive(p)}
                      title={p.isActive ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}
                      className={`p-1.5 rounded-full cursor-pointer transition-colors backdrop-blur-xs ${
                        p.isActive
                          ? 'bg-[#2d6a4f]/90 text-white hover:bg-[#2d6a4f]'
                          : 'bg-red-600/90 text-white hover:bg-red-600'
                      }`}
                    >
                      {p.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-serif font-bold text-base text-[#1f2937] line-clamp-1">{p.name}</h3>
                      <span className="text-xs text-[#9c9387] shrink-0 font-mono">Urutan: #{p.order}</span>
                    </div>
                    {p.caption && (
                      <p className="text-xs text-[#c29d59] font-medium mb-1.5 line-clamp-1">{p.caption}</p>
                    )}
                    <p className="text-xs text-[#6b7280] line-clamp-2 leading-relaxed mb-4">
                      {p.description || 'Tidak ada deskripsi.'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#f4eee4] flex items-center justify-between">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        p.isActive ? 'bg-[#d8f3dc] text-[#2d6a4f]' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {p.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(p)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#faf7f2] hover:bg-[#ede4d5] text-[#1f2937] transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#e5dcd0] w-full max-w-2xl my-8 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#e5dcd0] flex items-center justify-between bg-[#faf7f2]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1f2937]">
                  {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                </h3>
                <p className="text-xs text-[#6b7280]">
                  {editingProduct
                    ? 'Ubah informasi model atau foto produk.'
                    : 'Tambahkan contoh hasil jahitan atau busana baru ke katalog.'}
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
            <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Nama Produk */}
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Gamis Aira Silk Mewah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                />
              </div>

              {/* Kategori & Urutan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59] bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
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

              {/* Badge & Caption */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                    Badge Khusus (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Terlaris / Sarimbit / Favorit"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                    Keterangan Singkat / Bahan (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Katun Toyobo Fodu Jepang"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                  />
                </div>
              </div>

              {/* Upload Foto Produk */}
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Foto Produk Utama
                </label>
                <p className="text-[11px] text-[#6b7280] mb-2">
                  Pilih foto hasil jahitan dari HP/komputer atau foto langsung dengan kamera HP.
                </p>
                <ImageUploader
                  currentImage={images[0] || ''}
                  onImageUploaded={(url: string) => setImages([url])}
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Deskripsi Produk
                </label>
                <textarea
                  rows={4}
                  placeholder="Jelaskan detail potongan jahitan, kenyamanan bahan, dan kecocokan untuk acara..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                />
              </div>

              {/* Status Aktif */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#c29d59] focus:ring-[#c29d59]"
                />
                <label htmlFor="isActive" className="text-xs font-medium text-[#374151] cursor-pointer">
                  Tampilkan produk ini di website publik (Status Aktif)
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
                  {isSaving ? 'Menyimpan...' : editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
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
              Hapus Produk?
            </h3>
            <p className="text-xs text-center text-[#6b7280] leading-relaxed mb-6">
              Yakin ingin menghapus produk <span className="font-bold text-[#1f2937]">"{deleteTarget.name}"</span>?
              <br />
              Data yang sudah dihapus tidak dapat dikembalikan.
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
