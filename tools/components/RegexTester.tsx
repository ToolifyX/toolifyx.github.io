"use client";

/**
 * SEO Title: Online Regex Tester - Test Regular Expressions
 * Meta Description: Test your regular expressions in real-time. Highlights matches and supports various regex flags.
 *
 * FAQ 1: How do I use this regex tester?
 * Enter your pattern, select flags (g, i, m), and type some text to see highlights.
 *
 * FAQ 2: What flags are supported?
 * We support Global (g), Case-insensitive (i), and Multiline (m).
 *
 * FAQ 3: Why aren't my matches highlighted?
 * Ensure your pattern is valid and that the 'g' (global) flag is active if you expect multiple matches.
 */

import React, { useState, useMemo } from 'react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('gi');
  const [testString, setTestString] = useState('');
  const [error, setError] = useState('');

  const matches = useMemo(() => {
    setError('');
    if (!pattern) return [];
    try {
      const regex = new RegExp(pattern, flags);
      const results = Array.from(testString.matchAll(regex));
      return results;
    } catch (e: any) {
      setError(e.message);
      return [];
    }
  }, [pattern, flags, testString]);

  const renderHighlighted = () => {
    if (!pattern || error || matches.length === 0) return testString;

    let lastIndex = 0;
    const elements: React.ReactNode[] = [];

    matches.forEach((match, i) => {
      const start = match.index!;
      const end = start + match[0].length;

      // Text before match
      if (start > lastIndex) {
        elements.push(testString.substring(lastIndex, start));
      }

      // Highlighted match
      elements.push(
        <span key={i} className="bg-yellow-200 border-b border-yellow-400">
          {match[0]}
        </span>
      );

      lastIndex = end;
    });

    // Remaining text
    if (lastIndex < testString.length) {
      elements.push(testString.substring(lastIndex));
    }

    return elements;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3 space-y-2">
            <label className="block text-sm font-medium">Regex Pattern</label>
            <div className="flex items-center">
              <span className="text-gray-400 mr-1">/</span>
              <input
                className="w-full border rounded p-2 font-mono text-sm"
                placeholder="([a-z]+)"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
              />
              <span className="text-gray-400 ml-1">/</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Flags</label>
            <input
              className="w-full border rounded p-2 font-mono text-sm"
              placeholder="gi"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="p-2 bg-red-50 text-red-600 text-xs rounded border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium">Test String</label>
          <textarea
            className="w-full border rounded p-2 min-h-[120px] font-mono text-sm"
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Matches ({matches.length})</label>
          <div className="w-full border rounded p-3 min-h-[120px] font-mono text-sm bg-gray-50 whitespace-pre-wrap break-all">
            {renderHighlighted()}
          </div>
        </div>
      </div>
    </div>
  );
}
