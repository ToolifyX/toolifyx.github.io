"use client";

/**
 * SEO Title: CSS Border Radius Generator - Rounded Corners Tool
 * Meta Description: Create rounded corners for your UI elements. Preview and copy CSS border-radius code.
 *
 * FAQ 1: Can I set individual corners?
 * This tool sets a uniform border-radius for all four corners for clean, symmetrical designs.
 *
 * FAQ 2: What is the maximum radius?
 * You can go up to 100px or more, which often results in a circle for square elements.
 *
 * FAQ 3: Is it free to use?
 * Yes, all design tools on ToolifyX are 100% free.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function BorderRadiusGenerator() {
  const [radius, setRadius] = useState(12);
  const [copied, setCopied] = useState(false);

  const css = `border-radius: ${radius}px;`;

  const handleCopy = async () => {
    const success = await copyToClipboard(css);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-6 space-y-8">
        <div className="flex justify-center p-12 bg-gray-50 rounded-lg border">
          <div
            className="w-32 h-32 bg-primary flex items-center justify-center text-white font-bold"
            style={{ borderRadius: `${radius}px` }}
          >
            Preview
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Radius: {radius}px</label>
            <input type="range" min="0" max="150" value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} className="w-full" />
          </div>

          <div className="p-3 bg-gray-50 border rounded font-mono text-xs">
            {css}
          </div>
          <button onClick={handleCopy} className="bg-black text-white px-4 py-2 rounded w-full">
            {copied ? 'Copied!' : 'Copy CSS'}
          </button>
        </div>
      </div>
    </div>
  );
}
