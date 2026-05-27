"use client";

/**
 * SEO Title: Secure Password Generator - Create Strong Passwords
 * Meta Description: Generate secure, random passwords to protect your online accounts. Customize length and characters.
 *
 * FAQ 1: What makes a password strong?
 * A strong password is long and includes a mix of uppercase, lowercase, numbers, and symbols.
 *
 * FAQ 2: Is it safe to generate passwords here?
 * Yes, the generation happens entirely in your browser using local math functions.
 *
 * FAQ 3: How long should my password be?
 * Security experts recommend at least 12-16 characters for most accounts.
 */

import React, { useState } from 'react';
import { generateRandomString, copyToClipboard } from '@/lib/utils';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setPassword(generateRandomString(length, numbers, symbols));
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(password);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-6 space-y-6">
        <div className="relative">
          <input
            readOnly
            className="w-full border rounded-lg p-4 bg-gray-50 font-mono text-xl pr-24 tracking-wider shadow-inner"
            value={password}
            placeholder="Click Generate"
          />
          <button
            onClick={handleCopy}
            className="absolute right-2 top-2 bottom-2 bg-black text-white px-4 rounded-md text-sm font-bold"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-400">Password Length: {length}</label>
            <input type="range" min="8" max="64" value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="w-full" />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} />
              Numbers
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} />
              Symbols
            </label>
          </div>

          <button onClick={generate} className="bg-primary text-white px-4 py-3 rounded-xl w-full font-bold shadow-lg hover:brightness-110 transition-all">
            Generate Secure Password
          </button>
        </div>
      </div>
    </div>
  );
}
