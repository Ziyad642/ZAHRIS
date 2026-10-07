import { getServices } from '@/lib/db';
import { ServicesCMSClient } from './ServicesCMSClient';

export const dynamic = 'force-dynamic';

export default async function AdminLayananPage() {
  const services = await getServices(true);
  return <ServicesCMSClient initialServices={services} />;
}
