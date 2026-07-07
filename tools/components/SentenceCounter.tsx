"use client";

/**
 * SEO Title: Online Sentence Counter - Paragraphs & Speaking Time
 * Meta Description: Count sentences, paragraphs, and calculate estimated speaking time. Perfect for writers and public speakers.
 */

import React, { useState, useMemo } from 'react';

export default function SentenceCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    if (!text.trim()) return { sentences: 0, paragraphs: 0, longest: 0, shortest: 0, avg: 0, speaking: '0s' };

    const paragraphs = text.split(/\n+/).filter(p => p.trim() !== '').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim() !== '');
    const sentenceCount = sentences.length;

    let longest = 0;
    let shortest = sentenceCount > 0 ? sentences[0].trim().length : 0;
    let totalLen = 0;

    sentences.forEach(s => {
      const len = s.trim().length;
      if (len > longest) longest = len;
      if (len < shortest) shortest = len;
      totalLen += len;
    });

    // Avg speaking time: ~130 words per minute
    const words = text.trim().split(/\s+/).length;
    const speakingSeconds = Math.ceil((words / 130) * 60);
    const speakingTime = speakingSeconds > 60
      ? `${Math.floor(speakingSeconds / 60)}m ${speakingSeconds % 60}s`
      : `${speakingSeconds}s`;

    return {
      sentences: sentenceCount,
      paragraphs,
      longest,
      shortest: sentenceCount > 0 ? shortest : 0,
      avg: sentenceCount > 0 ? Math.round(totalLen / sentenceCount) : 0,
      speaking: speakingTime
    };
  }, [text]);

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="card border rounded-xl p-6 space-y-6 bg-card shadow-sm">
        <textarea
          className="w-full border rounded-xl p-4 min-h-[350px] text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-muted/20"
          placeholder="Paste your text here to count sentences and paragraphs..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatBox value={stats.sentences} label="Sentences" theme="yellow" />
          <StatBox value={stats.paragraphs} label="Paragraphs" theme="amber" />
          <StatBox value={stats.speaking} label="Speaking Time" theme="orange" />
          <StatBox value={stats.longest} label="Longest Sentence (Chars)" theme="yellow" />
          <StatBox value={stats.shortest} label="Shortest Sentence (Chars)" theme="amber" />
          <StatBox value={stats.avg} label="Avg Sentence length" theme="orange" />
        </div>

        <button
          onClick={() => setText('')}
          className="border px-6 py-3 rounded-xl font-bold hover:bg-muted/50 transition-all w-full uppercase tracking-widest text-xs"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

function StatBox({ value, label, theme }: { value: number | string, label: string, theme: string }) {
  return (
    <div className={`p-6 rounded-2xl border bg-card shadow-sm transition-all hover:scale-[1.02] border-${theme}-500/20 bg-${theme}-500/[0.03]`}>
      <div className={`text-3xl font-black text-${theme}-600 dark:text-${theme}-400 mb-1`}>{value}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}
