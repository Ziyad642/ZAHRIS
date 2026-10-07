import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Rumah Jahit ZAHRIS | Jasa Jahit Custom, PO & Borongan',
  description:
    'Rumah Jahit ZAHRIS (Salamah Zahris, sejak 2018) melayani jasa jahit custom bawa kain sendiri, pre-order pakaian sample, pesanan borongan seragam sekolah & kantor, serta vermak pakaian dengan hasil rapi dan nyaman dipakai.',
  keywords: [
    'Rumah Jahit ZAHRIS',
    'Salamah Zahris',
    'Jasa Jahit Jakarta',
    'Jahit Custom',
    'Pre Order Gamis',
    'Jahit Borongan Seragam',
    'Vermak Pakaian',
    'Penjahit Keluarga',
  ],
  authors: [{ name: 'Rumah Jahit ZAHRIS' }],
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    title: 'Rumah Jahit ZAHRIS | Jahit Sesuai Keinginan, Hasil Rapi, Nyaman Dipakai',
    description:
      'Jasa jahit custom, Pre-Order model pakaian, pesanan borongan seragam, dan vermak pakaian keluarga terpercaya sejak 2018.',
    url: 'https://rumahjahitzahris.com',
    siteName: 'Rumah Jahit ZAHRIS',
    images: [
      {
        url: '/logo.jpg',
        width: 800,
        height: 800,
        alt: 'Logo Resmi Rumah Jahit Salamah ZAHRIS',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#faf7f2] text-[#1c1917] selection:bg-[#c29d59]/20 selection:text-[#121212]">
        {children}
      </body>
    </html>
  );
}
