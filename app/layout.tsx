import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';
import GlobalStateProvider from '@/components/GlobalStateProvider';
import AnalyticsInitializer from '@/analytics/AnalyticsInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ToolifyX - Every tool for everyone',
  description: '50+ browser-based tools for developers and creators.',
};

import Link from 'next/link';
import { Mail, Send } from 'lucide-react';

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
          <AnalyticsInitializer>
            <GlobalStateProvider>
              <Navbar />
              <main className="max-w-screen-xl mx-auto px-3 py-3">
                {children}
              </main>
            </GlobalStateProvider>
          </AnalyticsInitializer>
          <footer className="border-t py-12 mt-auto">
            <div className="container mx-auto px-4 text-center space-y-6">
              <div className="flex justify-center gap-6 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <Link href="/apps" className="hover:text-primary transition-colors">Apps</Link>
                <Link href="/about" className="hover:text-primary transition-colors">About</Link>
              </div>

              <div className="flex justify-center gap-4">
                <a
                  href="mailto:ssolstice216@gmail.com"
                  className="p-2 rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
                  title="Email Support"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href="https://t.me/S2olstice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
                  title="Telegram Support"
                >
                  <Send className="w-4 h-4" />
                </a>
              </div>

              <p className="text-[11px] text-muted-foreground/40 font-medium tracking-tight uppercase">
                © {new Date().getFullYear()} ToolifyX • Private & Secure • All processing is local
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
