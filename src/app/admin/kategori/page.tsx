import { getCategories } from '@/lib/db';
import { CategoriesCMSClient } from './CategoriesCMSClient';

export const dynamic = 'force-dynamic';

export default async function AdminKategoriPage() {
  const categories = await getCategories(true);
  return <CategoriesCMSClient initialCategories={categories} />;
}
