import { getBusinessSettings } from '@/lib/db';
import { ShopSettingsCMSClient } from './ShopSettingsCMSClient';

export const dynamic = 'force-dynamic';

export default async function AdminPengaturanPage() {
  const settings = await getBusinessSettings();
  return <ShopSettingsCMSClient initialSettings={settings} />;
}
