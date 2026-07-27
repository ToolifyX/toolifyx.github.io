import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import GlobalStateProvider from '@/components/GlobalStateProvider';
import AnalyticsInitializer from '@/analytics/AnalyticsInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PhungX - Every tool for everyone',
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
          <AnalyticsInitializer>
            <GlobalStateProvider>
              {children}
            </GlobalStateProvider>
          </AnalyticsInitializer>
        </ThemeProvider>
      </body>
    </html>
  );
}
