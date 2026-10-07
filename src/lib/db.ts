import fs from 'fs';
import path from 'path';
import {
  SiteContent,
  ServiceItem,
  CategoryItem,
  ProductItem,
  GalleryItem,
  WhatsAppSettings,
  BusinessSettings,
} from './types';

interface DatabaseStore {
  siteContent: SiteContent;
  services: ServiceItem[];
  categories: CategoryItem[];
  products: ProductItem[];
  gallery: GalleryItem[];
  whatsappSettings: WhatsAppSettings;
  businessSettings: BusinessSettings;
}

const isVercel = process.env.VERCEL === '1';
const DATA_DIR = isVercel ? '/tmp/zahris-data' : path.join(process.cwd(), 'data');
const STORE_PATH = isVercel ? path.join('/tmp/zahris-data', 'store.json') : path.join(DATA_DIR, 'store.json');
const BUNDLED_STORE_PATH = path.join(process.cwd(), 'data', 'store.json');

// In-memory cache for fast access & serverless fallback
let memoryStoreCache: DatabaseStore | null = null;

const INITIAL_STORE: DatabaseStore = {
  siteContent: {
    hero: {
      headline: 'Jahit Rapi, Sesuai Kebutuhan Anda',
      subtitle: 'Melayani jasa jahit custom, vermak, pakaian keluarga, seragam, dan pesanan borongan dengan pengerjaan teliti dan ukuran nyaman.',
      heroImage: '/images/hero-tailor.jpg',
      primaryCtaText: '💬 Konsultasi via WhatsApp',
      secondaryCtaText: 'Lihat Koleksi',
      badgeText: 'Usaha Jahit Keluarga Terpercaya Sejak 2018',
    },
    about: {
      title: 'Tentang Rumah Jahit ZAHRIS',
      subtitle: 'Dedikasi Kerapian & Kenyamanan Sejak 2018',
      description: 'Rumah Jahit ZAHRIS adalah usaha jasa jahit keluarga yang melayani berbagai kebutuhan jahit custom, pakaian keluarga/sarimbit, seragam, dan vermak. Kami mengutamakan ketepatan pola, kerapian jahitan, dan kenyamanan saat dikenakan.',
      story: 'Bermula dari kecintaan pada seni menjahit dan ketelitian potongan busana keluarga, Rumah Jahit ZAHRIS (Salamah Zahris) telah dipercaya oleh ratusan keluarga, sekolah, kantor, dan komunitas untuk mewujudkan pakaian impian mereka.',
      imageUrl: '/images/hero-tailor.jpg',
    },
    benefits: [
      { id: 'b-1', title: 'Bisa Konsultasi Model', description: 'Diskusikan model busana impian atau kirim foto referensi langsung melalui WhatsApp.', order: 1, isActive: true },
      { id: 'b-2', title: 'Bisa Bawa Kain Sendiri', description: 'Punya bahan kain sendiri? Bawa langsung ke workshop kami untuk dijahit sesuai selera.', order: 2, isActive: true },
      { id: 'b-3', title: 'Melayani Jahit Custom', description: 'Pola dan potongan disesuaikan dengan postur tubuh agar nyaman dan pas di badan.', order: 3, isActive: true },
      { id: 'b-4', title: 'Melayani Pesanan Borongan', description: 'Kapasitas pengerjaan seragam sekolah, kantor, organisasi, dan event dalam jumlah banyak.', order: 4, isActive: true },
      { id: 'b-5', title: 'Pakaian Keluarga & Seragam', description: 'Spesialis sarimbit pesta keluarga, baju dinas, hingga seragam sekolah dengan bordir rapi.', order: 5, isActive: true },
    ],
    howToOrder: [
      { step: '01', title: 'Pilih Model', description: 'Lihat koleksi di website atau ceritakan model pakaian yang ingin Anda buat.' },
      { step: '02', title: 'Konsultasi via WhatsApp', description: 'Hubungi Rumah Jahit ZAHRIS untuk membahas model, bahan, ukuran, dan jadwal pengerjaan.' },
      { step: '03', title: 'Proses & Jadi', description: 'Setelah detail disepakati dan bahan siap, pakaian dipotong dan dijahit hingga selesai rapi.' },
    ],
    pickupDelivery: {
      title: 'Pengambilan & Pengantaran Pesanan',
      pickupInfo: 'Pesanan yang telah selesai dapat diambil langsung di workshop Rumah Jahit ZAHRIS.',
      deliveryInfo: 'Untuk area sekitar, pengantaran dapat didiskusikan terlebih dahulu melalui WhatsApp.',
      note: 'Kami mengutamakan kepuasan hasil fitting pakaian Anda.',
    },
    finalCta: {
      title: 'Masih Bingung Mau Mulai dari Mana?',
      subtitle: 'Ceritakan kebutuhan pakaian atau seragam Anda. Tim Rumah Jahit ZAHRIS siap membantu konsultasi secara ramah dan profesional.',
      buttonText: '💬 Konsultasi via WhatsApp',
    },
  },

  services: [
    {
      id: 'srv-1',
      title: 'Jasa Jahit',
      description: 'Punya kain sendiri? Kami bantu membuat pakaian sesuai model dan kebutuhan Anda dengan hasil rapi dan nyaman.',
      ctaText: 'Konsultasi via WhatsApp',
      ctaType: 'whatsapp',
      icon: 'Scissors',
      order: 1,
      isActive: true,
    },
    {
      id: 'srv-2',
      title: 'Pre-Order',
      description: 'Pilih model dari koleksi Rumah Jahit ZAHRIS dan konsultasikan ukuran serta detailnya sesuai keinginan.',
      ctaText: 'Lihat Koleksi',
      ctaType: 'catalog',
      icon: 'Shirt',
      order: 2,
      isActive: true,
    },
    {
      id: 'srv-3',
      title: 'Bahan + Jahit',
      description: 'Belum punya kain? Kami dapat membantu memilih bahan yang sesuai dengan model dan kebutuhan pakaian Anda.',
      ctaText: 'Konsultasi via WhatsApp',
      ctaType: 'whatsapp',
      icon: 'Layers',
      order: 3,
      isActive: true,
    },
    {
      id: 'srv-4',
      title: 'Borongan',
      description: 'Seragam sekolah, olahraga, keluarga, kantor, komunitas, dan kebutuhan pakaian dalam jumlah banyak.',
      ctaText: 'Lihat Borongan',
      ctaType: 'borongan',
      icon: 'Users',
      order: 4,
      isActive: true,
    },
  ],

  categories: [
    { id: 'cat-1', name: 'Gamis & Dress', slug: 'gamis-dress', order: 1, isActive: true },
    { id: 'cat-2', name: 'Kemeja & Atasan', slug: 'kemeja-atasan', order: 2, isActive: true },
    { id: 'cat-3', name: 'Seragam Sekolah', slug: 'seragam-sekolah', order: 3, isActive: true },
    { id: 'cat-4', name: 'Seragam Kantor', slug: 'seragam-kantor', order: 4, isActive: true },
    { id: 'cat-5', name: 'Pakaian Keluarga', slug: 'pakaian-keluarga', order: 5, isActive: true },
    { id: 'cat-6', name: 'Bawahan & Celana', slug: 'bawahan-celana', order: 6, isActive: true },
    { id: 'cat-7', name: 'Batik', slug: 'batik', order: 7, isActive: true },
    { id: 'cat-8', name: 'Custom & Lainnya', slug: 'custom-lainnya', order: 8, isActive: true },
  ],

  products: [
    {
      id: 'prod-1',
      name: 'Gamis Aira Studio',
      slug: 'gamis-aira-studio',
      categoryId: 'cat-1',
      categoryName: 'Gamis & Dress',
      description: 'Gamis anggun bernuansa modest dengan siluet jatuh, potongan rapi, dan aksen bordir tailoring halus. Cocok untuk pengajian, silaturahmi, maupun acara semi-formal keluarga.',
      images: ['/images/product-gamis-aira.jpg'],
      isActive: true,
      order: 1,
      badge: 'Best Seller',
      caption: 'Bahan Toyobo Fodu Silk',
      priceNote: 'Konsultasi via WhatsApp',
      createdAt: '2026-10-01T08:00:00Z',
    },
    {
      id: 'prod-2',
      name: 'Kemeja Formal Putih Toyobo',
      slug: 'kemeja-formal-putih-toyobo',
      categoryId: 'cat-2',
      categoryName: 'Kemeja & Atasan',
      description: 'Kemeja pria lengan panjang dengan kerah kaku presisi, saku rapi, dan jahitan stik balik halus. Sangat nyaman untuk seragam kerja kantor atau ibadah.',
      images: ['/images/product-kemeja-formal.jpg'],
      isActive: true,
      order: 2,
      badge: 'Favorit',
      caption: 'Katun Toyobo Export',
      priceNote: 'Konsultasi via WhatsApp',
      createdAt: '2026-10-01T08:30:00Z',
    },
    {
      id: 'prod-3',
      name: 'Set Sarimbit Keluarga Harmoni',
      slug: 'set-sarimbit-keluarga-harmoni',
      categoryId: 'cat-5',
      categoryName: 'Pakaian Keluarga',
      description: 'Setelan serasi gamis ibu & anak putri serta kemeja ayah & anak laki-laki. Dibuat dengan ukuran custom perorangan agar seluruh anggota keluarga nyaman.',
      images: ['/images/product-sarimbit.jpg'],
      isActive: true,
      order: 3,
      badge: 'Keluarga',
      caption: 'Koleksi Sarimbit Pesta',
      priceNote: 'Konsultasi via WhatsApp',
      createdAt: '2026-10-01T09:00:00Z',
    },
    {
      id: 'prod-4',
      name: 'Celana Panjang Chino Formal',
      slug: 'celana-panjang-chino-formal',
      categoryId: 'cat-6',
      categoryName: 'Bawahan & Celana',
      description: 'Celana panjang potongan reguler fit / slim fit dengan resleting YKK berkualitas, saku samping, dan ban pinggang presisi pas di badan.',
      images: ['/images/product-celana.jpg'],
      isActive: true,
      order: 4,
      caption: 'Cotton Twill Stretch',
      priceNote: 'Konsultasi via WhatsApp',
      createdAt: '2026-10-01T09:30:00Z',
    },
    {
      id: 'prod-5',
      name: 'Tunik Modern Silk Kombinasi',
      slug: 'tunik-modern-silk-kombinasi',
      categoryId: 'cat-1',
      categoryName: 'Gamis & Dress',
      description: 'Tunik wanita potongan longgar modern dengan belahan samping dan manset kancing wudhu friendly.',
      images: ['/images/product-tunik.jpg'],
      isActive: true,
      order: 5,
      caption: 'Silk Viscose Halus',
      priceNote: 'Konsultasi via WhatsApp',
      createdAt: '2026-10-01T10:00:00Z',
    },
  ],

  gallery: [
    {
      id: 'gal-1',
      title: 'Seragam Batik Siswa SMP',
      category: 'Sekolah',
      imageUrl: '/images/product-sarimbit.jpg',
      caption: 'Jahitan seragam batik siswa dengan lis kerah rapi dan kancing tertutup.',
      order: 1,
      isActive: true,
      createdAt: '2026-10-01T08:00:00Z',
    },
    {
      id: 'gal-2',
      title: 'Kemeja Seragam PDH Kantor',
      category: 'Kantor',
      imageUrl: '/images/product-kemeja-formal.jpg',
      caption: 'Kemeja PDH bahan American Drill dengan bordir nama dan logo perusahaan.',
      order: 2,
      isActive: true,
      createdAt: '2026-10-01T08:30:00Z',
    },
    {
      id: 'gal-3',
      title: 'Gamis Pesta Brokat Mutiara',
      category: 'Keluarga',
      imageUrl: '/images/product-gamis-aira.jpg',
      caption: 'Gamis pesta pesanan ibu dengan furing adem dan potongan A-line jatuh.',
      order: 3,
      isActive: true,
      createdAt: '2026-10-01T09:00:00Z',
    },
    {
      id: 'gal-4',
      title: 'Setelan Celana Kerja Wanita',
      category: 'Custom',
      imageUrl: '/images/product-celana.jpg',
      caption: 'Celana bahan formal wanita hasil pengukuran langsung di workshop.',
      order: 4,
      isActive: true,
      createdAt: '2026-10-01T09:30:00Z',
    },
    {
      id: 'gal-5',
      title: 'Tunik Muslimah Santai',
      category: 'Custom',
      imageUrl: '/images/product-tunik.jpg',
      caption: 'Tunik santai dari kain milik pelanggan yang dibawa langsung ke workshop.',
      order: 5,
      isActive: true,
      createdAt: '2026-10-01T10:00:00Z',
    },
    {
      id: 'gal-6',
      title: 'Setelan Olahraga Sekolah',
      category: 'Olahraga',
      imageUrl: '/images/product-celana.jpg',
      caption: 'Kaos dryfit kombinasi celana training sekolah bahan diadora tebal.',
      order: 6,
      isActive: true,
      createdAt: '2026-10-01T10:30:00Z',
    },
  ],

  whatsappSettings: {
    phoneNumber: '6282298149440',
    businessName: 'Rumah Jahit ZAHRIS',
    defaultGreeting: 'Halo Rumah Jahit ZAHRIS 👋',
    defaultMessage: 'Halo Rumah Jahit ZAHRIS 👋\n\nSaya ingin konsultasi mengenai kebutuhan jahit pakaian.\n\nTerima kasih.',
    productTemplate: 'Halo Rumah Jahit ZAHRIS 👋\n\nSaya tertarik dengan produk:\n[NAMA PRODUK]\nKategori: [KATEGORI]\n\nSaya ingin konsultasi mengenai model, bahan, ukuran, dan harga.\n\nTerima kasih.',
    bulkTemplate: 'Halo Rumah Jahit ZAHRIS 👋\n\nSaya ingin konsultasi pesanan borongan seragam.\n\nMohon informasi pilihan bahan dan penawaran harganya.\n\nTerima kasih.',
    customFabricTemplate: 'Halo Rumah Jahit ZAHRIS 👋\n\nSaya punya kain sendiri dan ingin dijahitkan di Rumah Jahit ZAHRIS.\n\nTerima kasih.',
    ownDesignTemplate: 'Halo Rumah Jahit ZAHRIS 👋\n\nSaya memiliki desain sendiri dan ingin konsultasi pembuatan pakaian.\n\nTerima kasih.',
  },

  businessSettings: {
    businessName: 'Rumah Jahit ZAHRIS',
    tagline: 'Jahit Rapi, Sesuai Kebutuhan Anda',
    logoUrl: '/logo.jpg',
    address: 'Depan Jl. Cinyosog No.50, Burangkeng, Kec. Setu, Kabupaten Bekasi, Jawa Barat 17320',
    openingHours: 'Senin – Sabtu: 08:30 – 17:30 WIB (Minggu: Dengan Perjanjian)',
    instagram: '@rumahjahit.zahris',
    mapsUrl: 'https://maps.google.com',
    phone: '0822-9814-9440',
    email: 'kontak@zahris.com',
  },
};

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';

async function fetchFromKV(): Promise<DatabaseStore | null> {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(`${KV_URL}/get/zahris_store`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.result) return null;
    const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
    return parsed as DatabaseStore;
  } catch (err) {
    console.error('KV fetch error:', err);
    return null;
  }
}

async function writeToKV(data: DatabaseStore): Promise<boolean> {
  if (!KV_URL || !KV_TOKEN) return false;
  try {
    const res = await fetch(`${KV_URL}/set/zahris_store`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(data)),
      cache: 'no-store',
    });
    return res.ok;
  } catch (err) {
    console.error('KV write error:', err);
    return false;
  }
}

function readStoreFromDisk(): DatabaseStore {
  try {
    if (isVercel && !fs.existsSync(STORE_PATH) && fs.existsSync(BUNDLED_STORE_PATH)) {
      try {
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.copyFileSync(BUNDLED_STORE_PATH, STORE_PATH);
      } catch {}
    }

    if (!fs.existsSync(STORE_PATH)) {
      if (fs.existsSync(BUNDLED_STORE_PATH)) {
        const bundledContent = fs.readFileSync(BUNDLED_STORE_PATH, 'utf-8');
        const parsed = JSON.parse(bundledContent);
        return { ...INITIAL_STORE, ...parsed };
      }
      return INITIAL_STORE;
    }

    const content = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(content);
    return {
      siteContent: parsed.siteContent || INITIAL_STORE.siteContent,
      services: parsed.services || INITIAL_STORE.services,
      categories: parsed.categories || INITIAL_STORE.categories,
      products: parsed.products || INITIAL_STORE.products,
      gallery: parsed.gallery || INITIAL_STORE.gallery,
      whatsappSettings: parsed.whatsappSettings || INITIAL_STORE.whatsappSettings,
      businessSettings: parsed.businessSettings || INITIAL_STORE.businessSettings,
    };
  } catch (err) {
    return INITIAL_STORE;
  }
}

function writeStoreToDisk(data: DatabaseStore): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch {}
}

async function getStore(): Promise<DatabaseStore> {
  if (KV_URL && KV_TOKEN) {
    const cloud = await fetchFromKV();
    if (cloud && cloud.products) {
      memoryStoreCache = cloud;
      return cloud;
    }
  }

  if (memoryStoreCache) {
    return memoryStoreCache;
  }

  const diskStore = readStoreFromDisk();
  memoryStoreCache = diskStore;

  if (KV_URL && KV_TOKEN) {
    writeToKV(diskStore).catch(() => {});
  }

  return diskStore;
}

async function saveStore(data: DatabaseStore): Promise<void> {
  memoryStoreCache = data;

  if (KV_URL && KV_TOKEN) {
    await writeToKV(data);
  }

  writeStoreToDisk(data);
}

// ==================== SITE CONTENT ====================

export async function getSiteContent(): Promise<SiteContent> {
  const store = await getStore();
  return store.siteContent;
}

export async function updateSiteContent(updates: Partial<SiteContent>): Promise<SiteContent> {
  const store = await getStore();
  store.siteContent = {
    ...store.siteContent,
    ...updates,
    hero: { ...store.siteContent.hero, ...(updates.hero || {}) },
    about: { ...store.siteContent.about, ...(updates.about || {}) },
    pickupDelivery: { ...store.siteContent.pickupDelivery, ...(updates.pickupDelivery || {}) },
    finalCta: { ...store.siteContent.finalCta, ...(updates.finalCta || {}) },
  };
  await saveStore(store);
  return store.siteContent;
}

// ==================== SERVICES ====================

export async function getServices(includeInactive = false): Promise<ServiceItem[]> {
  const store = await getStore();
  const list = store.services || [];
  const filtered = includeInactive ? list : list.filter((s) => s.isActive);
  return filtered.sort((a, b) => a.order - b.order);
}

export async function updateService(id: string, updates: Partial<ServiceItem>): Promise<ServiceItem | null> {
  const store = await getStore();
  const index = store.services.findIndex((s) => s.id === id);
  if (index === -1) return null;
  store.services[index] = { ...store.services[index], ...updates };
  await saveStore(store);
  return store.services[index];
}

// ==================== CATEGORIES ====================

export async function getCategories(includeInactive = false): Promise<CategoryItem[]> {
  const store = await getStore();
  const list = store.categories || [];
  const filtered = includeInactive ? list : list.filter((c) => c.isActive);
  return filtered.sort((a, b) => a.order - b.order);
}

export async function createCategory(name: string): Promise<CategoryItem> {
  const store = await getStore();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newCat: CategoryItem = {
    id: `cat-${Date.now()}`,
    name,
    slug,
    order: store.categories.length + 1,
    isActive: true,
  };
  store.categories.push(newCat);
  await saveStore(store);
  return newCat;
}

export async function updateCategory(id: string, updates: Partial<CategoryItem>): Promise<CategoryItem | null> {
  const store = await getStore();
  const index = store.categories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  store.categories[index] = { ...store.categories[index], ...updates };
  await saveStore(store);
  return store.categories[index];
}

export async function deleteCategory(id: string): Promise<{ success: boolean; message?: string }> {
  const store = await getStore();
  // Check if any product is using this category
  const used = store.products.some((p) => p.categoryId === id);
  if (used) {
    return {
      success: false,
      message: 'Kategori ini tidak dapat dihapus karena masih digunakan oleh produk dalam katalog. Silakan ubah kategori produk terlebih dahulu.',
    };
  }
  const index = store.categories.findIndex((c) => c.id === id);
  if (index === -1) return { success: false, message: 'Kategori tidak ditemukan.' };
  store.categories.splice(index, 1);
  await saveStore(store);
  return { success: true };
}

// ==================== PRODUCTS ====================

export async function getProducts(includeInactive = false): Promise<ProductItem[]> {
  const store = await getStore();
  const list = store.products || [];
  const filtered = includeInactive ? list : list.filter((p) => p.isActive);
  return filtered.sort((a, b) => a.order - b.order);
}

export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  const store = await getStore();
  return store.products.find((p) => p.slug === slug && p.isActive) || null;
}

export async function getProductById(id: string): Promise<ProductItem | null> {
  const store = await getStore();
  return store.products.find((p) => p.id === id) || null;
}

export async function createProduct(data: Omit<ProductItem, 'id' | 'createdAt'>): Promise<ProductItem> {
  const store = await getStore();
  const newProduct: ProductItem = {
    ...data,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  store.products.unshift(newProduct);
  await saveStore(store);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<ProductItem>): Promise<ProductItem | null> {
  const store = await getStore();
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  store.products[index] = {
    ...store.products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await saveStore(store);
  return store.products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const store = await getStore();
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  store.products.splice(index, 1);
  await saveStore(store);
  return true;
}

// ==================== GALLERY ====================

export async function getGallery(category?: string, includeInactive = false): Promise<GalleryItem[]> {
  const store = await getStore();
  let list = store.gallery || [];
  if (!includeInactive) list = list.filter((g) => g.isActive);
  if (category && category !== 'Semua') {
    list = list.filter((g) => g.category.toLowerCase() === category.toLowerCase());
  }
  return list.sort((a, b) => a.order - b.order);
}

export async function createGalleryItem(data: Omit<GalleryItem, 'id' | 'createdAt'>): Promise<GalleryItem> {
  const store = await getStore();
  const newItem: GalleryItem = {
    ...data,
    id: `gal-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  store.gallery.unshift(newItem);
  await saveStore(store);
  return newItem;
}

export async function updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem | null> {
  const store = await getStore();
  const index = store.gallery.findIndex((g) => g.id === id);
  if (index === -1) return null;
  store.gallery[index] = { ...store.gallery[index], ...updates };
  await saveStore(store);
  return store.gallery[index];
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  const store = await getStore();
  const index = store.gallery.findIndex((g) => g.id === id);
  if (index === -1) return false;
  store.gallery.splice(index, 1);
  await saveStore(store);
  return true;
}

// ==================== WHATSAPP SETTINGS ====================

export async function getWhatsAppSettings(): Promise<WhatsAppSettings> {
  const store = await getStore();
  return store.whatsappSettings;
}

export async function updateWhatsAppSettings(updates: Partial<WhatsAppSettings>): Promise<WhatsAppSettings> {
  const store = await getStore();
  store.whatsappSettings = { ...store.whatsappSettings, ...updates };
  await saveStore(store);
  return store.whatsappSettings;
}

// ==================== BUSINESS SETTINGS ====================

export async function getBusinessSettings(): Promise<BusinessSettings> {
  const store = await getStore();
  return store.businessSettings;
}

export async function updateBusinessSettings(updates: Partial<BusinessSettings>): Promise<BusinessSettings> {
  const store = await getStore();
  store.businessSettings = {
    ...store.businessSettings,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await saveStore(store);
  return store.businessSettings;
}

// ==================== ADMIN DASHBOARD STATS ====================

export async function getAdminDashboardStats() {
  const store = await getStore();
  return {
    activeProductsCount: (store.products || []).filter((p) => p.isActive).length,
    categoriesCount: (store.categories || []).filter((c) => c.isActive).length,
    galleryCount: (store.gallery || []).filter((g) => g.isActive).length,
    servicesCount: (store.services || []).filter((s) => s.isActive).length,
    whatsAppNumber: store.whatsappSettings.phoneNumber,
  };
}
