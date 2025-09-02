import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BIBO - Two Korean Students Building the Future',
  description: 'Two passionate Korean college students on a journey to build revolutionary platforms that connect dreams with reality. Join us as we craft the future.',
  keywords: ['BIBO', 'Korean students', 'startup', 'innovation', 'technology', 'future'],
  authors: [{ name: 'BIBO Team' }],
  openGraph: {
    title: 'BIBO - Two Korean Students Building the Future',
    description: 'Two passionate Korean college students on a journey to build revolutionary platforms that connect dreams with reality.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BIBO - Two Korean Students Building the Future',
    description: 'Two passionate Korean college students on a journey to build revolutionary platforms that connect dreams with reality.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
