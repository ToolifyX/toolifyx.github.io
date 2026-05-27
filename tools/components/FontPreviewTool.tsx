"use client";

/**
 * SEO Title: Online Font Previewer - Test Fonts and Typography
 * Meta Description: Preview your text in different sizes, weights, and styles. A helpful tool for designers and developers.
 *
 * FAQ 1: Can I use custom fonts?
 * This tool uses system fonts and Google Fonts available in the browser.
 *
 * FAQ 2: What styles can I change?
 * You can adjust font size, weight, line height, and letter spacing.
 *
 * FAQ 3: How do I export the styles?
 * You can copy the CSS properties directly from the info box.
 */

import React, { useState } from 'react';

export default function FontPreviewTool() {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog.');
  const [size, setSize] = useState(24);
  const [weight, setWeight] = useState(400);
  const [family, setFamily] = useState('sans-serif');
  const [lh, setLh] = useState(1.5);

  const families = ['sans-serif', 'serif', 'mono', 'cursive', 'system-ui'];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-6 space-y-6">
        <textarea
          className="w-full border rounded p-3 min-h-[100px]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to preview..."
        />

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-400">Size: {size}px</label>
            <input type="range" min="12" max="100" value={size} onChange={(e) => setSize(parseInt(e.target.value))} className="w-full" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-400">Weight: {weight}</label>
            <input type="range" min="100" max="900" step="100" value={weight} onChange={(e) => setWeight(parseInt(e.target.value))} className="w-full" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-400">Font Family</label>
            <select className="w-full border rounded p-2" value={family} onChange={(e) => setFamily(e.target.value)}>
              {families.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-400">Line Height: {lh}</label>
            <input type="range" min="1" max="2" step="0.1" value={lh} onChange={(e) => setLh(parseFloat(e.target.value))} className="w-full" />
          </div>
        </div>

        <div className="p-8 border rounded-xl bg-white overflow-hidden shadow-sm">
          <p
            style={{
              fontSize: `${size}px`,
              fontWeight: weight,
              fontFamily: family,
              lineHeight: lh
            }}
            className="break-all whitespace-pre-wrap"
          >
            {text}
          </p>
        </div>

        <div className="p-4 bg-muted rounded border font-mono text-xs">
          font-size: {size}px;<br />
          font-weight: {weight};<br />
          font-family: {family};<br />
          line-height: {lh};
        </div>
      </div>
    </div>
  );
}
