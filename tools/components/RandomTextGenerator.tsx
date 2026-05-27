"use client";

/**
 * SEO Title: Random Text Generator - Generate Secure Strings
 * Meta Description: Create random strings of any length. Customize with numbers and special symbols. Perfect for passwords and testing.
 *
 * FAQ 1: Can I use this for passwords?
 * Yes, by including numbers and symbols, it generates high-entropy strings suitable for passwords.
 *
 * FAQ 2: Is the generation secure?
 * It uses Math.random() which is sufficient for most non-cryptographic purposes.
 *
 * FAQ 3: What is the maximum length?
 * You can generate strings up to 10,000 characters long.
 */

import React, { useState } from 'react';
import { generateRandomString, copyToClipboard } from '@/lib/utils';

export default function RandomTextGenerator() {
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setResult(generateRandomString(length, includeNumbers, includeSymbols));
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Length</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="flex items-center space-x-2 h-full pt-6">
            <input
              type="checkbox"
              id="numbers"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
            />
            <label htmlFor="numbers" className="text-sm">Include Numbers</label>
          </div>
          <div className="flex items-center space-x-2 h-full pt-6">
            <input
              type="checkbox"
              id="symbols"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
            />
            <label htmlFor="symbols" className="text-sm">Include Symbols</label>
          </div>
        </div>

        <button onClick={handleGenerate} className="bg-black text-white px-4 py-2 rounded w-full">Generate Random Text</button>

        {result && (
          <div className="space-y-2">
            <textarea
              readOnly
              className="w-full border rounded p-2 min-h-[100px] bg-gray-50 font-mono break-all"
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
