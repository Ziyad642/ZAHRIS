import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSiteContent, updateSiteContent } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json({ content });
}

export async function PUT(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await req.json();
    const updated = await updateSiteContent(updates);

    revalidatePath('/');
    revalidatePath('/admin/konten');

    return NextResponse.json({ success: true, content: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menyimpan konten' }, { status: 500 });
  }
}
