import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCategories, createCategory } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const categories = await getCategories(true);
  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Nama kategori wajib diisi.' }, { status: 400 });
    }

    const created = await createCategory(name.trim());

    revalidatePath('/');
    revalidatePath('/katalog');
    revalidatePath('/admin/kategori');

    return NextResponse.json({ success: true, category: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menambahkan kategori.' }, { status: 500 });
  }
}
