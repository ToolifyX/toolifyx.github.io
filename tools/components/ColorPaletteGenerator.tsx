"use client";

/**
 * SEO Title: Color Palette Generator - Random Color Schemes
 * Meta Description: Generate beautiful, random color palettes for your next project. Copy hex codes with one click.
 *
 * FAQ 1: How do I generate a new palette?
 * Simply click the "Generate New Palette" button.
 *
 * FAQ 2: Can I copy individual colors?
 * Yes, click any color block to copy its hex code to your clipboard.
 *
 * FAQ 3: How are palettes generated?
 * We use a random HEX generator to create diverse and vibrant color combinations.
 */

import React, { useState, useEffect } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function ColorPaletteGenerator() {
  const [palette, setPalette] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const generate = () => {
    const newPalette = Array.from({ length: 5 }, () => `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`);
    setPalette(newPalette);
  };

  useEffect(() => {
    generate();
  }, []);

  const handleCopy = async (color: string) => {
    const success = await copyToClipboard(color);
    if (success) {
      setCopied(color);
      setTimeout(() => setCopied(null), 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-6 space-y-6">
        <div className="flex h-40 rounded-xl overflow-hidden shadow-lg border">
          {palette.map((color) => (
            <div
              key={color}
              className="flex-1 cursor-pointer group relative flex flex-col items-center justify-end pb-4 transition-all hover:flex-[1.5]"
              style={{ backgroundColor: color }}
              onClick={() => handleCopy(color)}
            >
              <span className="text-white text-[10px] font-bold bg-black/20 px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {copied === color ? 'COPIED' : color.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={generate}
          className="bg-black text-white px-4 py-2 rounded w-full font-bold tracking-wide"
        >
          Generate New Palette
        </button>

        <div className="grid grid-cols-5 gap-2">
           {palette.map(color => (
             <div key={color} className="text-center">
               <div className="w-full aspect-square rounded border" style={{ backgroundColor: color }} />
               <p className="text-[10px] mt-1 font-mono">{color.toUpperCase()}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
