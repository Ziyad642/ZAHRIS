import { getWhatsAppSettings } from '@/lib/db';
import { WhatsAppCMSClient } from './WhatsAppCMSClient';

export const dynamic = 'force-dynamic';

export default async function AdminWhatsAppPage() {
  const settings = await getWhatsAppSettings();
  return <WhatsAppCMSClient initialSettings={settings} />;
}
