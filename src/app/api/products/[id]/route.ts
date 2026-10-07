import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updateProduct, deleteProduct, getProductById } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return NextResponse.json({ error: 'Produk tidak ditemukan.' }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const updates = await req.json();

  const updated = await updateProduct(id, updates);
  if (!updated) {
    return NextResponse.json({ error: 'Produk tidak ditemukan.' }, { status: 404 });
  }

  revalidatePath('/');
  revalidatePath('/katalog');
  revalidatePath(`/katalog/${updated.slug}`);
  revalidatePath('/admin/produk');

  return NextResponse.json({ success: true, product: updated });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteProduct(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Produk tidak ditemukan.' }, { status: 404 });
  }

  revalidatePath('/');
  revalidatePath('/katalog');
  revalidatePath('/admin/produk');

  return NextResponse.json({ success: true });
}
