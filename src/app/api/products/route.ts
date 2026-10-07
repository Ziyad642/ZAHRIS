import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getProducts, createProduct } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const includeInactive = searchParams.get('all') === 'true';
  const products = await getProducts(includeInactive);
  return NextResponse.json(
    { products },
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
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'Nama produk wajib diisi.' }, { status: 400 });
    }

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newProduct = await createProduct({
      name: body.name.trim(),
      slug,
      categoryId: body.categoryId || 'cat-1',
      categoryName: body.categoryName || 'Gamis & Dress',
      description: body.description || '',
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : ['/logo.jpg'],
      isActive: body.isActive !== false,
      order: Number(body.order) || 1,
      badge: body.badge || undefined,
      caption: body.caption || undefined,
      priceNote: body.priceNote || 'Konsultasi via WhatsApp',
    });

    revalidatePath('/');
    revalidatePath('/katalog');
    revalidatePath('/admin/produk');

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal membuat produk.' }, { status: 500 });
  }
}
