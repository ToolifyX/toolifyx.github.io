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
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="card border rounded-xl p-6 space-y-6 bg-card shadow-sm">
        <div className="space-y-3">
          <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground">JSON to Validate</label>
          <textarea
            className="w-full border rounded-xl p-4 min-h-[400px] font-mono text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
            placeholder='{"key": "value"}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <button
          onClick={validate}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
        >
          Validate JSON
        </button>

        {status !== 'idle' && (
          <div className={`p-4 rounded-xl border animate-in fade-in duration-300 ${
            status === 'valid' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <p className="font-black uppercase text-[10px] tracking-widest mb-1">{status}</p>
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
