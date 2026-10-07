import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updateCategory, deleteCategory } from '@/lib/db';
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

    const updated = await updateCategory(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Kategori tidak ditemukan.' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/katalog');
    revalidatePath('/admin/kategori');

    return NextResponse.json({ success: true, category: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal mengubah kategori.' }, { status: 500 });
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
    const result = await deleteCategory(id);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    revalidatePath('/');
    revalidatePath('/katalog');
    revalidatePath('/admin/kategori');

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menghapus kategori.' }, { status: 500 });
  }
}
