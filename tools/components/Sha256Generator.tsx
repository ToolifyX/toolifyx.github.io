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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Input Text</label>
          <textarea
            className="w-full border rounded p-2 min-h-[120px]"
            placeholder="Enter text to hash..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <button
          onClick={generateHash}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Generate SHA-256 Hash
        </button>

        {hash && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">SHA-256 Hash Output</label>
              <button onClick={handleCopy} className="text-xs text-primary hover:underline">
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
            <div className="w-full border rounded p-3 font-mono text-sm bg-gray-50 break-all">
              {hash}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
