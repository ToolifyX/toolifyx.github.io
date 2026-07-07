"use client";

/**
 * SEO Title: HTML Heading Analyzer - Analyze H1-H6 SEO Structure
 * Meta Description: Check your website's heading hierarchy (H1 to H6). Identify missing H1s, duplicate headings, and skipped levels to improve SEO structure.
 */

import React, { useState, useMemo } from 'react';
import { LayoutList, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export default function HeadingAnalyzer() {
  const [input, setInput] = useState('<h1>Main Title</h1>\n<p>Content</p>\n<h2>Section 1</h2>\n<h3>Subsection</h3>\n<h2>Section 2</h2>');

  const analysis = useMemo(() => {
    if (!input.trim()) return { headings: [], errors: [] };

    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'text/html');
    const headings: { level: number, text: string }[] = [];
    const errors: string[] = [];

    doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
      headings.push({
        level: parseInt(h.tagName[1]),
        text: h.textContent || ''
      });
    });

    if (headings.length === 0) {
      errors.push("No headings found in the HTML snippet.");
      return { headings, errors };
    }

    const h1Count = headings.filter(h => h.level === 1).length;
    if (h1Count === 0) errors.push("Missing H1 heading. Every page should have exactly one H1.");
    if (h1Count > 1) errors.push(`Multiple H1 headings found (${h1Count}). It's recommended to have only one.`);

    let prevLevel = 0;
    headings.forEach((h, i) => {
      if (i === 0 && h.level !== 1) errors.push(`The first heading is H${h.level}. It should ideally be H1.`);
      if (prevLevel > 0 && h.level > prevLevel + 1) {
        errors.push(`Skipped heading level: H${prevLevel} to H${h.level} at "${h.text.slice(0, 20)}..."`);
      }
      prevLevel = h.level;
    });

    return { headings, errors };
  }, [input]);

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-6">
           <div className="card border rounded-xl p-6 bg-card shadow-sm h-full flex flex-col min-h-[400px]">
              <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Source HTML</span>
                <button onClick={() => setInput('')} className="text-[10px] font-bold text-muted-foreground hover:text-foreground">Clear</button>
              </div>
              <textarea
                className="flex-1 p-6 font-mono text-xs bg-transparent outline-none resize-none leading-relaxed"
                placeholder="Paste HTML source code to analyze headings..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
           </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
           <div className="card border rounded-xl bg-card shadow-sm h-full flex flex-col p-6 space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <LayoutList className="w-4 h-4" /> Heading Structure
                 </h3>
                 <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded">{analysis.headings.length} Total</span>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-auto pr-2 custom-scrollbar">
                 {analysis.headings.map((h, i) => (
                   <div key={i} className="flex gap-4 group">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${h.level === 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                         H{h.level}
                      </span>
                      <div className="pt-1 flex-1">
                         <p className={`text-sm font-bold ${h.level === 1 ? 'text-foreground' : 'text-muted-foreground'}`}>{h.text}</p>
                         <div className="h-px w-full bg-border/30 mt-3 group-last:hidden" />
                      </div>
                   </div>
                 ))}
                 {analysis.headings.length === 0 && (
                   <div className="text-center py-10 opacity-30 italic text-xs">No headings detected</div>
                 )}
              </div>

              <div className="space-y-3 pt-6 border-t">
                 <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" /> Analysis Report
                 </div>
                 {analysis.errors.length > 0 ? analysis.errors.map((err, i) => (
                   <div key={i} className="flex gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p className="text-[11px] font-bold leading-relaxed">{err}</p>
                   </div>
                 )) : (
                   <div className="flex gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <p className="text-[11px] font-bold leading-relaxed">Hierarchy looks clean and well-structured.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
