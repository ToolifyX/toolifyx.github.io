"use client";

/**
 * SEO Title: JSON Validator - Online JSON Syntax Checker
 * Meta Description: Validate your JSON data instantly. Check for syntax errors and ensure your JSON is RFC 8259 compliant.
 *
 * FAQ 1: How does JSON validation work?
 * It uses the built-in browser JSON parser to verify if the string follows the correct JSON structure.
 *
 * FAQ 2: What happens if my JSON is invalid?
 * The tool will show exactly where the error is (if provided by the engine) so you can fix it.
 *
 * FAQ 3: Can I validate large JSON files?
 * Yes, as long as it fits in your browser's memory, this tool can validate it.
 */

import React, { useState } from 'react';

export default function JsonValidator() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [message, setMessage] = useState('');

  const validate = () => {
    if (!input.trim()) {
      setStatus('idle');
      setMessage('');
      return;
    }
    try {
      JSON.parse(input);
      setStatus('valid');
      setMessage('Valid JSON');
    } catch (e: any) {
      setStatus('invalid');
      setMessage(e.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">JSON to Validate</label>
          <textarea
            className="w-full border rounded p-2 min-h-[200px] font-mono text-sm"
            placeholder='{"key": "value"}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <button
          onClick={validate}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Validate JSON
        </button>

        {status !== 'idle' && (
          <div className={`p-4 rounded-md border ${
            status === 'valid' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <p className="font-bold uppercase text-xs mb-1">{status}</p>
            <p className="text-sm">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
