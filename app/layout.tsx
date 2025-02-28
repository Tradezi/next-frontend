import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata, ViewportConfig } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import './globals.css';
import { auth } from '@/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tradezi',
  description: 'Trade Easy, Risk Free',
  other: {
    'umami-analytics': [
      'https://umami-analytics-personal.vercel.app/script.js',
      '74a2b786-a212-47bf-a088-f120a6e3a0fc'
    ]
  }
};

export const viewport: ViewportConfig = {
  width: 'device-width',
  initialScale: 1
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${inter.className} overflow-hidden `}
        suppressHydrationWarning={true}
      >
        <NextTopLoader showSpinner={false} />
        <Providers session={session}>
          <Toaster />
          {children}
        </Providers>
        <script
          defer
          src="https://umami-analytics-personal.vercel.app/script.js"
          data-website-id="74a2b786-a212-47bf-a088-f120a6e3a0fc"
        />
      </body>
    </html>
  );
}
