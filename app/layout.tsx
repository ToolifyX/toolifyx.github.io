import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ToolifyX - Scalable Tool Platform',
  description: '50+ browser-based tools for developers and creators.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t py-8 mt-auto">
          <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} ToolifyX. Built with Next.js.
          </div>
        </footer>
      </body>
    </html>
  );
}
