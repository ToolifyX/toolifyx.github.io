import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Mail, Send } from 'lucide-react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-3 py-3">
        {children}
      </main>
      <footer className="border-t py-12 mt-auto">
        <div className="container mx-auto px-4 text-center space-y-6">
          <div className="flex justify-center gap-6 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
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
            © {new Date().getFullYear()} PhungX • Private & Secure • All processing is local
          </p>
        </div>
      </footer>
    </>
  );
}
