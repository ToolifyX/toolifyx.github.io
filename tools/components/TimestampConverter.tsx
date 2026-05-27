"use client";

/**
 * SEO Title: Unix Timestamp Converter - Epoch Time Tool
 * Meta Description: Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds.
 *
 * FAQ 1: What is a Unix timestamp?
 * It's the number of seconds that have elapsed since January 1, 1970 (UTC).
 *
 * FAQ 2: How do I convert milliseconds?
 * Our tool automatically detects if the input is in seconds or milliseconds and converts accordingly.
 *
 * FAQ 3: Is UTC supported?
 * Yes, the tool displays the date in both your local time zone and UTC.
 */

import React, { useState, useEffect } from 'react';

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [results, setResults] = useState<{ local: string, utc: string } | null>(null);

  // Sync initial state with current time
  useEffect(() => {
    const now = Math.floor(Date.now() / 1000).toString();
    setTimestamp(now);
    handleTsToDate(now);
  }, []);

  const handleTsToDate = (val: string) => {
    if (!val) return;
    try {
      let ts = parseInt(val);
      if (val.length <= 11) ts *= 1000; // Assume seconds if short
      const d = new Date(ts);
      if (isNaN(d.getTime())) throw new Error();
      setResults({
        local: d.toLocaleString(),
        utc: d.toUTCString()
      });
    } catch (e) {
      setResults(null);
    }
  };

  const handleDateToTs = () => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) throw new Error();
      const ts = Math.floor(d.getTime() / 1000);
      setTimestamp(ts.toString());
      handleTsToDate(ts.toString());
    } catch (e) {
      // Error handling
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Unix Timestamp to Date</label>
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded p-2 font-mono"
              placeholder="e.g. 1712345678"
              value={timestamp}
              onChange={(e) => {
                setTimestamp(e.target.value);
                handleTsToDate(e.target.value);
              }}
            />
            <button
              onClick={() => {
                const now = Math.floor(Date.now() / 1000).toString();
                setTimestamp(now);
                handleTsToDate(now);
              }}
              className="text-xs border px-3 rounded hover:bg-gray-50"
            >
              Current Time
            </button>
          </div>
        </div>

        {results && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded border">
              <span className="text-[10px] uppercase font-bold text-gray-400">Local Time</span>
              <p className="text-sm font-medium">{results.local}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded border">
              <span className="text-[10px] uppercase font-bold text-gray-400">UTC</span>
              <p className="text-sm font-medium">{results.utc}</p>
            </div>
          </div>
        )}

        <hr className="border-gray-100" />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Date to Unix Timestamp</label>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              className="flex-1 border rounded p-2"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
            />
            <button
              onClick={handleDateToTs}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              Convert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
