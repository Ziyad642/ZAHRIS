import { WhatsAppSettings } from './types';

export function cleanPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

export interface WhatsAppMessageParams {
  type: 'general' | 'product' | 'bulk' | 'custom_fabric' | 'own_design' | 'fabric_plus_sew' | 'school_uniform';
  productName?: string;
  category?: string;
  notes?: string;
}

export function generateWhatsAppMessage(
  params: WhatsAppMessageParams,
  settings?: Partial<WhatsAppSettings>
): string {
  const businessName = settings?.businessName || 'Rumah Jahit ZAHRIS';

  switch (params.type) {
    case 'product':
      return `Halo ${businessName} 👋

Saya tertarik dengan produk:
*${params.productName || 'Pakaian ZAHRIS'}*
Kategori: ${params.category || 'Koleksi'}

Saya ingin konsultasi mengenai model, bahan, ukuran, dan harga.

Terima kasih.`;

    case 'custom_fabric':
      return `Halo ${businessName} 👋

Saya memiliki kain sendiri dan ingin konsultasi untuk jasa jahit pakaian. 
Rencana saya akan membawa kain langsung ke workshop Rumah Jahit ZAHRIS.

Bisa dibantu informasi jadwal dan modelnya? Terima kasih.`;

    case 'fabric_plus_sew':
      return `Halo ${businessName} 👋

Saya belum memiliki kain dan ingin konsultasi paket Bahan + Jahit dari ${businessName}.
Mohon rekomendasi pilihan bahan dan model pakaian yang cocok.

Terima kasih.`;

    case 'own_design':
      return `Halo ${businessName} 👋

Saya memiliki desain sendiri dan ingin konsultasi untuk pembuatan pakaian/seragam.
Saya akan mengirimkan foto desain atau contoh pakaiannya melalui WhatsApp ini.

Terima kasih.`;

    case 'bulk':
      return `Halo ${businessName} 👋

Saya ingin konsultasi untuk pesanan borongan / seragam ${params.category ? `(${params.category})` : ''}.
Mohon informasi mengenai estimasi pengerjaan, pilihan bahan, dan penawaran harganya.

Terima kasih.`;

    case 'school_uniform':
      return `Halo ${businessName} 👋

Saya ingin konsultasi mengenai pembuatan seragam sekolah ${params.category ? `(${params.category})` : ''}.
Saya sudah memiliki logo/desain sekolah yang akan saya kirimkan melalui chat ini.

Mohon dibantu informasinya. Terima kasih.`;

    case 'general':
    default:
      return settings?.defaultMessage || `Halo ${businessName} 👋

Saya ingin konsultasi mengenai kebutuhan jahit pakaian.

Terima kasih.`;
  }
}

export function getWhatsAppUrl(phoneNumber: string, message: string): string {
  const normalizedPhone = cleanPhoneNumber(phoneNumber || '6282298149440');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${normalizedPhone}?text=${encodedText}`;
}

export function generateWhatsAppServiceConsultation(serviceName: string): string {
  return `Halo Rumah Jahit ZAHRIS 👋\n\nSaya ingin konsultasi mengenai layanan ${serviceName}.\n\nTerima kasih.`;
}

