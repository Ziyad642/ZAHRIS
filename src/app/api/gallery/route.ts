import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getGallery, createGalleryItem } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const includeInactive = searchParams.get('all') === 'true';
  const category = searchParams.get('category') || undefined;
  const items = await getGallery(category, includeInactive);
  return NextResponse.json(
    { items },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.imageUrl) {
      return NextResponse.json({ error: 'Judul foto dan file gambar wajib diisi.' }, { status: 400 });
    }

    const created = await createGalleryItem({
      title: body.title.trim(),
      category: body.category || 'Custom',
      imageUrl: body.imageUrl,
      caption: body.caption || '',
      order: Number(body.order) || 1,
      isActive: body.isActive ?? true,
    });

    revalidatePath('/');
    revalidatePath('/galeri');
    revalidatePath('/admin/galeri');

    return NextResponse.json({ success: true, item: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menyimpan foto galeri.' }, { status: 500 });
  }
}
