# 🪡 RUMAH JAHIT ZAHRIS (Salamah Zahris • Since 2018)

Website Full-Stack Production-Ready untuk **Rumah Jahit ZAHRIS**, usaha jasa jahit keluarga profesional di Indonesia. Dibangun menggunakan Next.js (App Router), TypeScript, Tailwind CSS, serta arsitektur database Supabase / PostgreSQL dengan fallback data store terpadu.

---

## 🌟 Fitur Utama

### Sisi Pelanggan (Customer)
1. **Beranda Eksklusif**:
   - Hero section dengan visual autentik workshop jahit.
   - 4 Kartu Layanan Cepat (Jasa Jahit Custom, Bahan + Jahit, Pre-Order Sample, Borongan).
   - 8 Poin Keunggulan Rumah Jahit ZAHRIS.
   - Showcase Katalog Pre-Order Sample terbaru.
   - Alur kerja 5 tahap (Konsultasi → Pilih Layanan → Pengukuran → Proses Jahit → Selesai & Ambil/Antar).
   - Ulasan testimoni pelanggan terpercaya.
   - Tombol mengambang (Floating) WhatsApp resmi.
2. **Katalog Pre-Order (`/katalog`)**:
   - Filter interaktif berdasarkan Kategori (Gamis, Kemeja, Sarimbit, Celana, Tunik) dan Ukuran (S, M, L, XL, Custom).
   - Pencarian cerdas dan pengurutan harga/terbaru.
3. **Detail Produk PO (`/katalog/[slug]`)**:
   - Pilihan ukuran standar atau **Custom Size** (lingkar dada, pinggang, pinggul, panjang baju, lengan, bahu dlm cm).
   - Selector kuantitas pakaian `[-] [+]`.
   - Metode penyerahan: **Ambil di Rumah Jahit ZAHRIS** vs **Diantar Kurir ZAHRIS** (dengan pengecekan wilayah).
   - Sistem auto-generate pesan WhatsApp terstruktur dan penyimpanan otomatis pesanan ke database.
4. **Jasa Jahit Custom Kain Sendiri (`/jasa-jahit`)**:
   - Panduan alur bawa kain fisik langsung ke workshop Cipete Selatan.
   - Daftar estimasi ongkos jahit mulai dari.
5. **Paket Bahan + Jahit (`/layanan`)**:
   - Katalog bahan kain premium (Katun Toyobo Fodu, Linen Pure Look, Rayon Twill, Wolfis Grade A, Silk Satin Roberto Cavalli, Japan Drill Unione).
6. **Pesanan Borongan Seragam (`/borongan`)**:
   - Formulir pengajuan seragam sekolah, kantor, keluarga/sarimbit, dan komunitas.
   - Opsi jadwal ukur di lokasi maupun datang ke workshop.
7. **Jasa Vermak Pakaian (`/vermak`)**:
   - Daftar estimasi tarif potong celana, kecilkan baju, ganti resleting, dan permak jahitan.
8. **Cek & Lacak Pesanan (`/cek-pesanan`)**:
   - Pencarian instan berdasarkan **Nomor Pesanan** (`ZHR-...`) atau **Nomor WhatsApp**.
   - Timeline vertikal tahapan pengerjaan (Pesanan Diterima → Menunggu Bahan → Pengukuran → Pemotongan → Jahit → Finishing → Siap Diambil/Diantar → Selesai) lengkap dengan timestamp dan catatan per tahap.
   - Rincian uang muka (DP 50%) dan sisa pelunasan.

---

### Sisi Pengelola (Admin Dashboard)
1. **Autentikasi Aman (`/admin/login`)**:
   - Menggunakan logo resmi autentik Rumah Jahit ZAHRIS.
   - Proteksi sesi berbasis cookie HTTP-Only.
2. **Dashboard Overview (`/admin`)**:
   - 7 Kartu Statistik Utama (Total Pesanan, Pesanan Baru, Sedang Dijahit, Finishing, Siap Diambil/Diantar, Belum Lunas, Borongan).
   - Tabel pesanan terbaru di desktop & list card responsif di perangkat mobile.
3. **Manajemen Pesanan (`/admin/orders` & `/admin/orders/[id]`)**:
   - Filter status jahit dan pembayaran.
   - Pengubah tahapan produksi step-by-step dengan catatan timestamp.
   - Pencatatan pembayaran uang muka (DP 50%) dan pelunasan dengan metode bayar (BCA, Mandiri, BRI, QRIS, Tunai).
4. **Katalog Produk Admin (`/admin/products` & `/admin/products/new`)**:
   - Tambah dan kelola busana sample, harga mulai, estimasi pengerjaan, dan toggle aktif/nonaktif.
5. **Manajemen Borongan (`/admin/bulk-orders`)**:
   - Tinjau pengajuan seragam masuk, perbarui status dari survei hingga produksi, dan direct WhatsApp link.
6. **Data Pelanggan (`/admin/customers`)**:
   - Rekap pelanggan tetap, total transaksi, dan riwayat pesanan.
7. **Catatan Pembayaran (`/admin/payments`)**:
   - Rekap total pemasukan kas dan piutang belum lunas.
8. **Wilayah Pengantaran (`/admin/delivery-areas`)**:
   - Konfigurasi kecamatan, kelurahan, dan tarif kurir ZAHRIS.
9. **Pengaturan Toko (`/admin/settings`)**:
   - Ubah nomor WhatsApp resmi, alamat workshop, jam buka, Instagram, dan minimal DP.

---

## 🛠️ Panduan Menjalankan Project

### 1. Kebutuhan Sistem
- **Node.js** v18+ (Rekomendasi v20 atau v24)
- **npm** atau package manager setara

### 2. Instalasi & Menjalankan Lokal
```bash
# Clone atau buka direktori proyek
cd d:/xampp/htdocs/ZAHRIS

# Instal dependensi (jika belum)
npm install

# Jalankan server pengembangan lokal
npm run dev
```

Buka browser Anda di `http://localhost:3000`.

---

## 🔐 Kredensial Default Login Admin

- **URL Login**: `http://localhost:3000/admin/login`
- **Email**: `admin@zahris.com`
- **Password**: `adminzahris2026`

*(Kredensial dapat diganti pada file `.env.local`)*

---

## ⚙️ Konfigurasi Environment Variables

File `.env.local` dapat disesuaikan:

```env
# Koneksi Supabase (Opsional saat lokal, wajib saat deploy cloud)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Kredensial Admin
ADMIN_EMAIL=admin@zahris.com
ADMIN_PASSWORD=adminzahris2026
ADMIN_JWT_SECRET=super-secret-zahris-jwt-key-2026

# Nomor WhatsApp Resmi Rumah Jahit ZAHRIS (Format Internasional: 628...)
NEXT_PUBLIC_WHATSAPP_NUMBER=6281288997766

# Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🗄️ Setup Database Supabase & Migrasi

Aplikasi telah dilengkapi skrip SQL lengkap:

1. **Jalankan Schema Migration**:
   - Buka dashboard project di [Supabase](https://supabase.com/).
   - Masuk ke menu **SQL Editor**.
   - Buka file `supabase/schema.sql`, salin seluruh isinya, dan klik **Run**.
   - Skrip ini akan membuat tabel `business_settings`, `products`, `fabrics`, `delivery_areas`, `orders`, `order_status_history`, `payments`, `bulk_orders`, `customers`, `testimonials`, serta konfigurasi Row Level Security (RLS) dan index.

2. **Jalankan Seed Data**:
   - Di menu **SQL Editor**, buka file `supabase/seed.sql`, salin isinya, dan klik **Run**.
   - Data awal produk (Gamis Aira, Kemeja Formal, Dress Sarimbit, dll.), kain, wilayah, dan testimoni akan terisi otomatis.

3. **Fallback Resilien**:
   - Jika kredensial Supabase belum diisi, aplikasi **tetap dapat berjalan 100% interaktif** menggunakan file store persisten lokal di `data/store.json`. Setiap order baru dan update status tetap tersimpan!

---

## 📱 Cara Mengganti Nomor WhatsApp & Info Bisnis

Anda tidak perlu mengubah kode program:
1. Login ke panel admin di `/admin/login`.
2. Klik menu **Pengaturan Toko** (`/admin/settings`).
3. Ubah **Nomor WhatsApp**, **Alamat**, **Jam Operasional**, atau **Instagram**.
4. Klik **Simpan Perubahan Pengaturan**. Seluruh link deep-link WhatsApp di website akan langsung mengikuti konfigurasi baru.

---

## 🚀 Panduan Deployment (Vercel)

1. Hubungkan repository ke [Vercel](https://vercel.com).
2. Tambahkan Environment Variables dari `.env.example` ke dashboard Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
3. Klik **Deploy**. Vercel akan mem-build project secara otomatis.

---

## 🎨 Identitas Brand
- **Nama Usaha**: RUMAH JAHIT ZAHRIS (Salamah Zahris • Since 2018)
- **Tagline**: *"Jahit Sesuai Keinginan, Hasil Rapi, Nyaman Dipakai."*
- **Aset Resmi**: Emblem Logo Hitam Putih Klasik di `public/logo.jpg`.
