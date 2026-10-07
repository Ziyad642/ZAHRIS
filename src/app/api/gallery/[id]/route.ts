import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updateGalleryItem, deleteGalleryItem } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const updates = await req.json();

    const updated = await updateGalleryItem(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Foto galeri tidak ditemukan.' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/galeri');
    revalidatePath('/admin/galeri');

    return NextResponse.json({ success: true, item: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal mengubah foto galeri.' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteGalleryItem(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Foto galeri tidak ditemukan.' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/galeri');
    revalidatePath('/admin/galeri');

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menghapus foto galeri.' }, { status: 500 });
  }
}
