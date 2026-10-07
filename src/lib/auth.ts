import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'zahris_admin_session';

export async function setAdminSession(email: string) {
  const cookieStore = await cookies();
  const token = Buffer.from(JSON.stringify({ email, timestamp: Date.now() })).toString('base64');
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function getAdminSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  if (!sessionCookie?.value) return null;

  try {
    const decoded = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString('utf-8'));
    if (decoded?.email) {
      return { email: decoded.email };
    }
  } catch {
    return null;
  }
  return null;
}

export function verifyAdminCredentials(email: string, pass: string): boolean {
  const configuredEmail = process.env.ADMIN_EMAIL || 'admin@zahris.com';
  const configuredPass = process.env.ADMIN_PASSWORD || 'adminzahris2026';
  return email.trim().toLowerCase() === configuredEmail.toLowerCase() && pass === configuredPass;
}
