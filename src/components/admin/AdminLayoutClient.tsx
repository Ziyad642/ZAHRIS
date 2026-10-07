'use client';

import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#faf7f2]">
      {/* Sidebar (Desktop persistent + Mobile drawer) */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area - padded on desktop by sidebar width (w-64) */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        <AdminHeader
          title="Panel Pengelola Rumah Jahit ZAHRIS"
          subtitle="CMS Pengelola Konten & Katalog Website"
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
