// ============================================================
// RUMAH JAHIT ZAHRIS - DATA TYPES
// LANDING PAGE + DIGITAL CATALOG + GALLERY + WHATSAPP CMS
// ============================================================

export interface HeroContent {
  headline: string;
  subtitle: string;
  heroImage: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  badgeText: string;
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  order: number;
  isActive: boolean;
}

export interface HowToOrderItem {
  step: string;
  title: string;
  description: string;
}

export interface AboutContent {
  title: string;
  subtitle: string;
  description: string;
  story: string;
  imageUrl?: string;
}

export interface PickupDeliveryContent {
  title: string;
  pickupInfo: string;
  deliveryInfo: string;
  note: string;
}

export interface FinalCtaContent {
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  benefits: BenefitItem[];
  howToOrder: HowToOrderItem[];
  pickupDelivery: PickupDeliveryContent;
  finalCta: FinalCtaContent;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaType: 'whatsapp' | 'catalog' | 'borongan';
  icon: string;
  order: number;
  isActive: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  description: string;
  images: string[];
  isActive: boolean;
  order: number;
  badge?: string;
  caption?: string;
  priceNote?: string; // Optional: e.g. "Konsultasi via WA" or starting estimate
  createdAt: string;
  updatedAt?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string; // 'Sekolah' | 'Olahraga' | 'Keluarga' | 'Kantor' | 'Custom' | 'Vermak' | 'Lainnya'
  imageUrl: string;
  caption?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export interface WhatsAppSettings {
  phoneNumber: string; // e.g. "6281288997766"
  businessName: string;
  defaultGreeting: string;
  defaultMessage: string;
  productTemplate: string;
  bulkTemplate: string;
  customFabricTemplate: string;
  ownDesignTemplate: string;
}

export interface BusinessSettings {
  businessName: string;
  tagline: string;
  logoUrl: string;
  address: string;
  openingHours: string;
  instagram: string;
  mapsUrl?: string;
  phone?: string;
  email?: string;
  updatedAt?: string;
}

export interface BulkSectionItem {
  id: string;
  title: string;
  category: string;
  description: string;
  examples: string[];
  imageUrl: string;
  order: number;
}
