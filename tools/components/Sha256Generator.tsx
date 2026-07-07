"use client";

/**
 * SEO Title: SHA-256 Hash Generator - Online Encryption Tool
 * Meta Description: Securely generate SHA-256 hashes from text. Fast, private, and client-side hashing.
 *
 * FAQ 1: What is SHA-256?
 * Secure Hash Algorithm 256-bit is a cryptographic hash function that produces a unique 256-bit signature.
 *
 * FAQ 2: Is hashing reversible?
 * No, hashing is a one-way process. You cannot retrieve the original text from the hash.
 *
 * FAQ 3: Why use SHA-256?
 * It's widely used for verifying data integrity, storing passwords securely, and in blockchain technologies.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function Sha256Generator() {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [copied, setCopied] = useState(false);

  const generateHash = async () => {
    if (!input) {
      setHash('');
      return;
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setHash(hashHex);
  };

  const handleCopy = async () => {
    if (!hash) return;
    const success = await copyToClipboard(hash);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="card border rounded-xl p-6 space-y-6 bg-card shadow-sm">
        <textarea
          className="w-full border rounded-xl p-4 min-h-[200px] text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
          placeholder="Enter text to hash..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={generateHash}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
        >
          Generate SHA-256 Hash
        </button>

        {hash && (
          <div className="space-y-3 animate-in fade-in duration-500">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">SHA-256 Hash Output</span>
              <button onClick={handleCopy} className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
            <div className="w-full border rounded-xl p-4 font-mono text-base bg-muted/10 break-all">
              {hash}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
