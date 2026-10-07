import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getBusinessSettings, updateBusinessSettings } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const settings = await getBusinessSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const updates = await req.json();
  const updated = await updateBusinessSettings(updates);

  revalidatePath('/', 'layout');
  revalidatePath('/admin/pengaturan');

  return NextResponse.json({ success: true, settings: updated });
}
