import { NextResponse } from 'next/server';
import { verifyAdminCredentials, setAdminSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi.' }, { status: 400 });
    }

    const isValid = verifyAdminCredentials(email, password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Email atau password salah. Silakan coba kembali.' },
        { status: 401 }
      );
    }

    await setAdminSession(email);

    return NextResponse.json({ success: true, message: 'Login berhasil.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
