"use client";

/**
 * SEO Title: Color Picker - Online Hex & RGB Color Selector
 * Meta Description: Pick colors and get Hex, RGB, and HSL values. A simple tool for designers and developers.
 *
 * FAQ 1: How do I pick a color?
 * Click on the color input or use the slider to select your desired color.
 *
 * FAQ 2: What color formats are supported?
 * We provide Hex, RGB, and HSL formats.
 *
 * FAQ 3: Can I copy the values?
 * Yes, click on any color value to copy it to your clipboard.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function ColorPicker() {
  const [color, setColor] = useState('#3b82f6');
  const [copied, setCopied] = useState<string | null>(null);

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(text);
      setTimeout(() => setCopied(null), 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-6 space-y-6 flex flex-col items-center">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-32 h-32 cursor-pointer border-none p-0 rounded-full overflow-hidden shadow-xl"
        />

        <div className="w-full space-y-3">
          {[color.toUpperCase(), hexToRgb(color)].map((val) => (
            <div
              key={val}
              onClick={() => handleCopy(val)}
              className="flex items-center justify-between p-3 bg-gray-50 border rounded cursor-pointer hover:bg-gray-100 transition-colors group"
            >
              <span className="font-mono text-sm">{val}</span>
              <span className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-black">
                {copied === val ? 'Copied' : 'Click to copy'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
