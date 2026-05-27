import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-tighter text-primary">
          TOOLIFY<span className="text-foreground">X</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
