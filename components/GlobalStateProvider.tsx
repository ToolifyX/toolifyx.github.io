"use client";

import React, { useState, useEffect } from 'react';
import CommandPalette from './CommandPalette';

export default function GlobalStateProvider({ children }: { children: React.ReactNode }) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle both lowercase 'k' and potential uppercase 'K'
      const isK = e.key.toLowerCase() === 'k';
      const isModifier = e.metaKey || e.ctrlKey;

      if (isModifier && isK) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }

      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {children}
      {isMounted && (
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
        />
      )}
    </>
  );
}
