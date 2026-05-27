import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="container mx-auto px-2 md:px-4 py-4 md:py-6">
            {children}
          </main>
          <footer className="border-t py-4 mt-auto">
            <div className="container mx-auto px-4 text-center text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
              © {new Date().getFullYear()} ToolifyX. All processing is local.
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
