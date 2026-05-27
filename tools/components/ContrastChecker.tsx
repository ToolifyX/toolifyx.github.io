"use client";

/**
 * SEO Title: Color Contrast Checker - WCAG Accessibility Tool
 * Meta Description: Check if your foreground and background colors meet WCAG 2.1 accessibility standards.
 *
 * FAQ 1: What is the target ratio?
 * For standard text, WCAG AA requires 4.5:1, and AAA requires 7:1.
 *
 * FAQ 2: Does it check large text?
 * Yes, large text (18pt or 14pt bold) has more relaxed requirements (3:1 for AA).
 *
 * FAQ 3: Why is accessibility important?
 * High contrast ensures your content is readable by people with visual impairments.
 */

import React, { useState } from 'react';

export default function ContrastChecker() {
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');

  const getLuminance = (hex: string) => {
    const rgb = hex.slice(1).match(/.{2}/g)!.map(x => parseInt(x, 16) / 255);
    const [r, g, b] = rgb.map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(fg);
  const lum2 = getLuminance(bg);
  const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);

  const Status = ({ req, val }: { req: number, val: number }) => (
    <span className={`px-2 py-1 rounded text-xs font-bold ${val >= req ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {val >= req ? 'PASS' : 'FAIL'}
    </span>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-6 space-y-6">
        <div
          className="w-full p-12 rounded-lg border text-center transition-colors"
          style={{ backgroundColor: bg, color: fg }}
        >
          <h2 className="text-3xl font-bold mb-2">Example Heading</h2>
          <p>This is a preview of how your text looks with the selected colors.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-400">Foreground (Text)</label>
            <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-full h-10 border rounded" />
            <input type="text" value={fg} onChange={(e) => setFg(e.target.value)} className="w-full border rounded p-2 font-mono text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-400">Background</label>
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-full h-10 border rounded" />
            <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} className="w-full border rounded p-2 font-mono text-sm" />
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl space-y-4 border">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Contrast Ratio</span>
            <span className="text-2xl font-bold">{ratio.toFixed(2)}:1</span>
          </div>
          <hr />
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span>AA (Normal Text)</span> <div className="text-right"><Status req={4.5} val={ratio} /></div>
            <span>AA (Large Text)</span> <div className="text-right"><Status req={3} val={ratio} /></div>
            <span>AAA (Normal Text)</span> <div className="text-right"><Status req={7} val={ratio} /></div>
            <span>AAA (Large Text)</span> <div className="text-right"><Status req={4.5} val={ratio} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
