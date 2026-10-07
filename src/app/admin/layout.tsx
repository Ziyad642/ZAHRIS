import React from 'react';
import { getAdminSession } from '@/lib/auth';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // If there's no session, let the children render (e.g. login page)
  // Protected pages will verify or redirect internally
  if (!session) {
    return <>{children}</>;
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
