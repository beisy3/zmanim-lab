import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Alos Hashachar Calculator - Dawn Times by All Methods',
  description:
    'Calculate Alos Hashachar (dawn) times according to all halachic opinions and calculation methods. Supports 18+ different methods including fixed times, proportional hours, and solar depression angles.',
  keywords: [
    'Alos Hashachar',
    'dawn',
    'zmanim',
    'Jewish times',
    'halachic times',
    'kosher times',
    'prayer times',
    'sunrise',
  ],
  authors: [{ name: 'Zmanim Lab' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#667eea',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌅</text></svg>" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
