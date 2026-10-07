import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getWhatsAppSettings, updateWhatsAppSettings } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const settings = await getWhatsAppSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await req.json();
    if (!updates.phoneNumber || !updates.phoneNumber.trim()) {
      return NextResponse.json({ error: 'Nomor WhatsApp wajib diisi.' }, { status: 400 });
    }

    const updated = await updateWhatsAppSettings(updates);

    revalidatePath('/', 'layout');
    revalidatePath('/admin/whatsapp');

    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menyimpan pengaturan WhatsApp.' }, { status: 500 });
  }
}
