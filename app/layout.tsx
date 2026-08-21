import type { Metadata, Viewport } from 'next';
import './globals.css';
import { GameProvider } from '@/lib/gameContext';
import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'Dungeon & Crown: Web Chronicles',
  description: 'O RPG Idle Medieval definitivo com Caça, Masmorras, Repetição Automática, Crafting e Pets.',
  manifest: '/manifest.json'
};

export const viewport: Viewport = {
  themeColor: '#150f08',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#060403] text-[#d4c59a] antialiased selection:bg-[#c8972a] selection:text-black">
        <GameProvider>
          <div className="min-h-screen flex flex-col pb-20">
            <Navbar />
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6">{children}</main>
            <BottomNav />
          </div>
        </GameProvider>
      </body>
    </html>
  );
}
