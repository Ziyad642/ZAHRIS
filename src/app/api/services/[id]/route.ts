import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updateService } from '@/lib/db';
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

    const updated = await updateService(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Layanan tidak ditemukan.' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/admin/layanan');

    return NextResponse.json({ success: true, service: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal mengubah layanan.' }, { status: 500 });
  }
}
