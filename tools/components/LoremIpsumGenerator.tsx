"use client";

/**
 * SEO Title: Lorem Ipsum Generator - Placeholder Text Generator
 * Meta Description: Generate custom Lorem Ipsum placeholder text for your designs and layouts. Choose number of paragraphs and word count.
 *
 * FAQ 1: What is Lorem Ipsum?
 * It is a pseudo-Latin text used in the printing and typesetting industry as standard dummy text.
 *
 * FAQ 2: Can I customize the length?
 * Yes, you can specify the number of paragraphs and words per paragraph.
 *
 * FAQ 3: Why use placeholder text?
 * It helps designers visualize the layout without being distracted by readable content.
 */

import React, { useState } from 'react';
import { generateLoremIpsum, copyToClipboard } from '@/lib/utils';

export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [words, setWords] = useState(50);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setResult(generateLoremIpsum(paragraphs, words));
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(result);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Paragraphs</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={paragraphs}
              onChange={(e) => setParagraphs(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Words per Paragraph</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={words}
              onChange={(e) => setWords(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>

        <button onClick={handleGenerate} className="bg-black text-white px-4 py-2 rounded w-full">Generate Lorem Ipsum</button>

        {result && (
          <div className="space-y-2">
            <textarea
              readOnly
              className="w-full border rounded p-2 min-h-[200px] bg-gray-50 text-sm"
              value={result}
            />
            <button onClick={handleCopy} className="border px-4 py-2 rounded w-full">
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
