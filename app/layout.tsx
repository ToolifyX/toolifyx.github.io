import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';
import GlobalStateProvider from '@/components/GlobalStateProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ToolifyX - Every tool for everyone',
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
          <GlobalStateProvider>
            <Navbar />
            <main className="max-w-screen-xl mx-auto px-3 py-3">
              {children}
            </main>
          </GlobalStateProvider>
          <footer className="border-t py-8 mt-auto">
            <div className="container mx-auto px-4 text-center">
              <p className="text-[12px] text-muted-foreground font-medium tracking-tight uppercase">
                © {new Date().getFullYear()} ToolifyX • Private & Secure • All processing is local
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
