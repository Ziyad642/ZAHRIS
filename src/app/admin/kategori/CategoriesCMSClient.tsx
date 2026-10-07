'use client';

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Tag,
  Check,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowUpDown,
} from 'lucide-react';
import { CategoryItem } from '@/lib/types';

interface CategoriesCMSClientProps {
  initialCategories: CategoryItem[];
}

export function CategoriesCMSClient({ initialCategories }: CategoriesCMSClientProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  // State
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setOrder(categories.length + 1);
    setIsActive(true);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (c: CategoryItem) => {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setOrder(c.order || 1);
    setIsActive(c.isActive);
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Nama kategori wajib diisi.');
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      if (editingCategory) {
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            slug: slug.trim() || undefined,
            order: Number(order) || 1,
            isActive,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal mengubah kategori.');

        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? data.category : c))
        );
        showToast('Kategori berhasil diperbarui.');
      } else {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim() }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal menambahkan kategori.');

        setCategories((prev) => [...prev, data.category]);
        showToast('Kategori baru berhasil ditambahkan.');
      }

      closeModal();
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (c: CategoryItem) => {
    try {
      const res = await fetch(`/api/categories/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !c.isActive }),
      });
      if (!res.ok) throw new Error('Gagal mengubah status kategori');
      const data = await res.json();
      setCategories((prev) => prev.map((item) => (item.id === c.id ? data.category : item)));
      showToast(`Status kategori: ${!c.isActive ? 'Aktif' : 'Nonaktif'}`);
    } catch (err) {
      alert('Gagal mengubah status kategori.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/categories/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || 'Gagal menghapus kategori.');
        return;
      }

      setCategories((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      showToast('Kategori berhasil dihapus.');
      setDeleteTarget(null);
    } catch (err: any) {
      setDeleteError(err.message || 'Gagal menghapus kategori.');
    } finally {
      setIsDeleting(false);
    }
  };

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

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
          <h1 className="font-serif text-2xl font-bold text-[#1f2937]">Kategori Produk & Koleksi</h1>
          <p className="text-sm text-[#6b7280] mt-1">
            Atur kelompok pakaian seperti Gamis, Kemeja Pria, Seragam Sekolah, Sarimbit, dll.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#c29d59] hover:bg-[#b08c48] text-[#121212] font-semibold text-sm transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori Baru</span>
        </button>
      </div>

      {/* Categories Table / Card List */}
      <div className="bg-white rounded-2xl border border-[#e5dcd0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e5dcd0] bg-[#faf7f2] text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">
                <th className="py-3.5 px-5 w-20 text-center">Urutan</th>
                <th className="py-3.5 px-5">Nama Kategori</th>
                <th className="py-3.5 px-5">Slug / URL</th>
                <th className="py-3.5 px-5 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4eee4] text-xs">
              {sortedCategories.map((c) => (
                <tr key={c.id} className="hover:bg-[#faf7f2]/50 transition-colors">
                  <td className="py-4 px-5 text-center font-mono font-bold text-[#6b7280]">
                    #{c.order}
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-[#faf7f2] text-[#c29d59]">
                        <Tag className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-[#1f2937] text-sm">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 font-mono text-[#6b7280]">
                    {c.slug}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <button
                      onClick={() => handleToggleActive(c)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                        c.isActive
                          ? 'bg-[#d8f3dc] text-[#2d6a4f] hover:bg-[#b7e4c7]'
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      {c.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{c.isActive ? 'Aktif' : 'Nonaktif'}</span>
                    </button>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(c)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#faf7f2] hover:bg-[#ede4d5] text-[#1f2937] transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          setDeleteError(null);
                          setDeleteTarget(c);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#e5dcd0] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#e5dcd0] flex items-center justify-between bg-[#faf7f2]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1f2937]">
                  {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                </h3>
                <p className="text-xs text-[#6b7280]">
                  {editingCategory
                    ? 'Ubah nama atau urutan tampil kategori.'
                    : 'Kategori baru untuk memfilter model pakaian.'}
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
                  Nama Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Seragam Batik"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59]"
                />
              </div>

              {editingCategory && (
                <div>
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                    Slug URL
                  </label>
                  <input
                    type="text"
                    placeholder="seragam-batik"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] text-sm focus:outline-none focus:border-[#c29d59] font-mono text-xs"
                  />
                </div>
              )}

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
                  id="catIsActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#c29d59] focus:ring-[#c29d59]"
                />
                <label htmlFor="catIsActive" className="text-xs font-medium text-[#374151] cursor-pointer">
                  Kategori aktif (Tampil di filter website)
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
                  {isSaving ? 'Menyimpan...' : editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog with Protection Alert */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#e5dcd0] w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-center text-[#1f2937] mb-2">
              Hapus Kategori?
            </h3>
            <p className="text-xs text-center text-[#6b7280] leading-relaxed mb-4">
              Yakin ingin menghapus kategori <span className="font-bold text-[#1f2937]">"{deleteTarget.name}"</span>?
            </p>

            {deleteError && (
              <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteError(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-[#e5dcd0] text-xs font-semibold text-[#4b5563] hover:bg-[#faf7f2] transition-colors cursor-pointer"
              >
                {deleteError ? 'Tutup' : 'Batal'}
              </button>
              {!deleteError && (
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
