import React from 'react';
import { getSiteContent } from '@/lib/db';
import { ContentEditorClient } from './ContentEditorClient';

export default async function AdminContentPage() {
  const content = await getSiteContent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#121212]">
          Edit Konten Beranda Website
        </h1>
        <p className="text-xs text-[#6b645c] mt-1">
          Ubah judul headline, deskripsi, foto hero, profil tentang kami, dan teks ajakan WhatsApp tanpa perlu coding.
        </p>
      </div>

      <ContentEditorClient initialContent={content} />
    </div>
  );
}
