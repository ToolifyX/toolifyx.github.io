"use client";

/**
 * SEO Title: Interactive JSON Viewer - Expandable JSON Tree
 * Meta Description: Explore your JSON data with a professional, interactive tree viewer. Support for large datasets, search, and node collapsing.
 */

import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Braces, List, Type, Hash, ToggleLeft, Minus } from 'lucide-react';

export default function JsonViewer() {
  const [input, setInput] = useState('{\n  "id": 1,\n  "name": "ToolifyX",\n  "features": ["Fast", "Private", "Free"],\n  "details": {\n    "version": "1.0",\n    "active": true\n  }\n}');
  const [error, setError] = useState('');

  const parsedData = useMemo(() => {
    try {
      setError('');
      return JSON.parse(input);
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  }, [input]);

  return (
    <div className="w-full flex flex-col md:flex-row h-[700px] bg-background">
      {/* Input Panel */}
      <div className="flex-1 flex flex-col border-r border-border h-full">
        <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">JSON Input</span>
          <button onClick={() => setInput('')} className="text-[10px] font-bold text-muted-foreground hover:text-foreground">Clear</button>
        </div>
        <textarea
          className="flex-1 p-6 font-mono text-sm resize-none outline-none bg-transparent"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JSON here..."
        />
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-[11px] font-bold border-t border-destructive/20">
            {error}
          </div>
        )}
      </div>

      {/* Viewer Panel */}
      <div className="flex-1 flex flex-col h-full bg-card/50">
        <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Tree Viewer</span>
        </div>
        <div className="flex-1 overflow-auto p-6 font-mono text-sm">
          {parsedData !== null ? (
            <TreeNode data={parsedData} name="root" />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground italic text-xs">
              Enter valid JSON to explore
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TreeNode({ data, name, depth = 0 }: { data: any, name: string, depth?: number }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isObject = data !== null && typeof data === 'object';
  const isArray = Array.isArray(data);
  const type = isArray ? 'array' : typeof data;

  const getIcon = () => {
    if (isArray) return <List className="w-3 h-3 text-blue-500" />;
    if (isObject) return <Braces className="w-3 h-3 text-indigo-500" />;
    if (type === 'string') return <Type className="w-3 h-3 text-orange-500" />;
    if (type === 'number') return <Hash className="w-3 h-3 text-green-500" />;
    if (type === 'boolean') return <ToggleLeft className="w-3 h-3 text-purple-500" />;
    return <Minus className="w-3 h-3 text-slate-400" />;
  };

  if (!isObject) {
    return (
      <div className="flex items-center gap-2 py-0.5 hover:bg-muted/30 px-1 rounded transition-colors group">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-muted-foreground/60">{getIcon()}</span>
          <span className="text-foreground/80 font-medium truncate">{name}:</span>
        </div>
        <span className={`truncate ${type === 'string' ? 'text-orange-600 dark:text-orange-400' : type === 'number' ? 'text-green-600' : 'text-purple-600'}`}>
          {type === 'string' ? `"${data}"` : String(data)}
        </span>
      </div>
    );
  }

  const keys = Object.keys(data);
  const label = isArray ? `[${keys.length}]` : `{${keys.length}}`;

  return (
    <div className="py-0.5">
      <div
        className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 px-1 rounded transition-colors group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-muted-foreground/40">
          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground/60">{getIcon()}</span>
          <span className="text-foreground font-bold">{name}</span>
          <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-tighter">{label}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="ml-4 border-l border-border/50 pl-2 mt-0.5">
          {keys.map((key) => (
            <TreeNode key={key} data={data[key]} name={key} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
