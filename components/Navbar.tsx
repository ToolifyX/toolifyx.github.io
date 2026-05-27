import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tighter text-primary">
          TOOLIFY<span className="text-foreground">X</span>
        </Link>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-md hover:bg-muted" aria-label="Toggle theme">
            {/* Placeholder for theme toggle */}
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
