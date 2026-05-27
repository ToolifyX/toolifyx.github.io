"use client";

/**
 * SEO Title: UUID Generator - Generate Version 4 UUIDs Online
 * Meta Description: Quick and easy UUID (v4) generator. Generate multiple unique identifiers for your projects instantly.
 *
 * FAQ 1: What is a UUID?
 * A Universally Unique Identifier is a 128-bit number used to identify information in computer systems.
 *
 * FAQ 2: Are these UUIDs unique?
 * While collision is theoretically possible, the probability of a collision for v4 UUIDs is extremely low.
 *
 * FAQ 3: How many can I generate at once?
 * You can generate up to 50 UUIDs at a time with this tool.
 */

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function UuidGenerator() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = () => {
    const newUuids = Array.from({ length: Math.min(count, 50) }, () => crypto.randomUUID());
    setUuids(newUuids);
  };

  const handleCopyOne = async (text: string, index: number) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const handleCopyAll = async () => {
    const success = await copyToClipboard(uuids.join('\n'));
    if (success) {
      // Temporary state for "Copy All" would be nice too
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <div className="flex items-end gap-4">
          <div className="flex-1 space-y-2">
            <label className="block text-sm font-medium">Number of UUIDs</label>
            <input
              type="number"
              min="1"
              max="50"
              className="w-full border rounded p-2"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            />
          </div>
          <button
            onClick={generate}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors h-[42px]"
          >
            Generate
          </button>
        </div>

        {uuids.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold uppercase text-gray-500">Generated UUIDs</h3>
              <button onClick={handleCopyAll} className="text-sm text-primary hover:underline font-medium">
                Copy All
              </button>
            </div>
            <div className="space-y-2">
              {uuids.map((uuid, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-gray-50 border rounded text-sm font-mono">
                  <span>{uuid}</span>
                  <button
                    onClick={() => handleCopyOne(uuid, i)}
                    className="text-xs text-gray-500 hover:text-black"
                  >
                    {copiedIndex === i ? 'Copied' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
