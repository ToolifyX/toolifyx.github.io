"use client";

/**
 * SEO Title: CSS Box Shadow Generator - Design Shadows Online
 * Meta Description: Create custom CSS box shadows with live preview. Adjust blur, spread, and color.
 *
 * FAQ 1: What is spread?
 * Spread increases or decreases the size of the shadow relative to the element.
 *
 * FAQ 2: Can I make inset shadows?
 * This tool focuses on standard outer shadows for clean UI designs.
 *
 * FAQ 3: How do I copy the code?
 * Click the "Copy CSS" button to copy the property to your clipboard.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function BoxShadowGenerator() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(10);
  const [blur, setBlur] = useState(20);
  const [spread, setSpread] = useState(0);
  const [opacity, setOpacity] = useState(0.2);
  const [copied, setCopied] = useState(false);

  const shadow = `${x}px ${y}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity})`;

  const handleCopy = async () => {
    const success = await copyToClipboard(`box-shadow: ${shadow};`);
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
            className="w-32 h-32 bg-white rounded-lg border border-gray-100"
            style={{ boxShadow: shadow }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-400">Horizontal Offset: {x}px</label>
            <input type="range" min="-50" max="50" value={x} onChange={(e) => setX(parseInt(e.target.value))} className="w-full" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-400">Vertical Offset: {y}px</label>
            <input type="range" min="-50" max="50" value={y} onChange={(e) => setY(parseInt(e.target.value))} className="w-full" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-400">Blur Radius: {blur}px</label>
            <input type="range" min="0" max="100" value={blur} onChange={(e) => setBlur(parseInt(e.target.value))} className="w-full" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-400">Spread Radius: {spread}px</label>
            <input type="range" min="-50" max="50" value={spread} onChange={(e) => setSpread(parseInt(e.target.value))} className="w-full" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold uppercase text-gray-400">Opacity: {Math.round(opacity * 100)}%</label>
            <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-full" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="p-3 bg-gray-50 border rounded font-mono text-xs break-all">
            box-shadow: {shadow};
          </div>
          <button onClick={handleCopy} className="bg-black text-white px-4 py-2 rounded w-full">
            {copied ? 'Copied!' : 'Copy CSS Shadow'}
          </button>
        </div>
      </div>
    </div>
  );
}
