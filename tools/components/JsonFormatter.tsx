"use client";

/**
 * SEO Title: JSON Formatter & Beautifier - Clean & Format JSON Online
 * Meta Description: Free online tool to format, beautify, and prettify JSON data. Make your JSON readable with custom indentation.
 *
 * FAQ 1: How do I format JSON?
 * Paste your minified or messy JSON into the input box and click "Format JSON".
 *
 * FAQ 2: Is my data safe?
 * Yes, all processing happens locally in your browser. No data is sent to any server.
 *
 * FAQ 3: Can it handle invalid JSON?
 * It will display a clear error message if the JSON is malformed, helping you debug.
 */

import React, { useState } from 'react';
import { formatJSON, copyToClipboard } from '@/lib/utils';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    setError('');
    try {
      if (!input.trim()) return;
      const formatted = formatJSON(input);
      setOutput(formatted);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Input JSON</label>
          <textarea
            className="w-full border rounded p-2 min-h-[120px] font-mono text-sm"
            placeholder='{"key": "value"}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleFormat}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Format JSON
          </button>
          <button
            onClick={() => { setInput(''); setOutput(''); setError(''); }}
            className="border px-4 py-2 rounded hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
            {error}
          </div>
        )}

        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Formatted Output</label>
              <button
                onClick={handleCopy}
                className="text-xs text-primary hover:underline"
              >
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
            <textarea
              readOnly
              className="w-full border rounded p-2 min-h-[200px] font-mono text-sm bg-gray-50"
              value={output}
            />
          </div>
        )}
      </div>
    </div>
  );
}
