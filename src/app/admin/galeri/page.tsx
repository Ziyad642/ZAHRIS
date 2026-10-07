import { Suspense } from 'react';
import { getGallery } from '@/lib/db';
import { GalleryCMSClient } from './GalleryCMSClient';

export const dynamic = 'force-dynamic';

export default async function AdminGaleriPage() {
  const gallery = await getGallery(undefined, true);
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#6b645c]">Memuat Galeri Foto...</div>}>
      <GalleryCMSClient initialGallery={gallery} />
    </Suspense>
  );
}
