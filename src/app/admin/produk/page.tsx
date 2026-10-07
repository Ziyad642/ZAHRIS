import { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/db';
import { ProductsCMSClient } from './ProductsCMSClient';

export const dynamic = 'force-dynamic';

export default async function AdminProdukPage() {
  const [products, categories] = await Promise.all([
    getProducts(true),
    getCategories(true),
  ]);

  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#6b645c]">Memuat Katalog Produk...</div>}>
      <ProductsCMSClient initialProducts={products} categories={categories} />
    </Suspense>
  );
}
