"use client";

/**
 * SEO Title: CSS Gradient Generator - Create Beautiful Gradients
 * Meta Description: Design custom linear gradients for your website. Preview and copy CSS code instantly.
 *
 * FAQ 1: How do I change the direction?
 * Use the degree slider to rotate the gradient direction from 0° to 360°.
 *
 * FAQ 2: Can I add more colors?
 * This tool currently supports two-color linear gradients, which are standard for most designs.
 *
 * FAQ 3: Is the CSS cross-browser compatible?
 * Yes, it generates standard CSS background-image properties.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function GradientGenerator() {
  const [color1, setColor1] = useState('#3b82f6');
  const [color2, setColor2] = useState('#8b5cf6');
  const [deg, setDeg] = useState(90);
  const [copied, setCopied] = useState(false);

  const css = `linear-gradient(${deg}deg, ${color1}, ${color2})`;

  const handleCopy = async () => {
    const success = await copyToClipboard(`background: ${css};`);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-6">
        <div
          className="w-full h-40 rounded-lg shadow-inner border"
          style={{ background: css }}
        />

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-400">Color 1</label>
            <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-full h-10 border rounded p-1" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-400">Color 2</label>
            <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-full h-10 border rounded p-1" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-400">Angle: {deg}°</label>
            <input type="range" min="0" max="360" value={deg} onChange={(e) => setDeg(parseInt(e.target.value))} className="w-full h-10" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">CSS Output</label>
          <div className="p-3 bg-gray-50 border rounded font-mono text-xs break-all">
            background: {css};
          </div>
          <button onClick={handleCopy} className="bg-black text-white px-4 py-2 rounded w-full">
            {copied ? 'Copied!' : 'Copy CSS Code'}
          </button>
        </div>
      </div>
    </div>
  );
}
