'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl, generateWhatsAppMessage } from '@/lib/whatsapp';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  whatsAppNumber?: string;
}

export function FloatingWhatsApp({ phoneNumber, whatsAppNumber = '6282298149440' }: FloatingWhatsAppProps) {
  const finalNumber = phoneNumber || whatsAppNumber;
  const waUrl = getWhatsAppUrl(
    finalNumber,
    generateWhatsAppMessage({ type: 'general' })
  );

  return (
    <aside aria-label="Bantuan WhatsApp" className="fixed bottom-5 right-5 z-40 flex items-center group">
      {/* Tooltip hint on hover (Desktop) */}
      <span className="hidden md:inline-block mr-2 px-3 py-1.5 bg-[#121212] text-white text-xs rounded-full shadow-md font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Konsultasi WhatsApp
      </span>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp Rumah Jahit ZAHRIS"
        className="flex items-center justify-center w-13 h-13 md:w-14 md:h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-7 h-7 fill-white text-transparent" />
      </a>
    </aside>
  );
}
