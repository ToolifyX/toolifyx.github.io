"use client";

/**
 * SEO Title: Online Aspect Ratio Calculator - Simplify & Scale Dimensions
 * Meta Description: Calculate aspect ratios and scale image dimensions easily. Lock ratios, find missing width or height, and use common presets.
 */

import React, { useState, useEffect } from 'react';
import { Calculator, Lock, Unlock, ArrowRight } from 'lucide-react';

export default function AspectRatioCalculator() {
  const [width, setWidth] = useState<string>('1920');
  const [height, setHeight] = useState<string>('1080');
  const [lockRatio, setLockRatio] = useState(true);
  const [currentRatio, setCurrentRatio] = useState<number>(1920 / 1080);

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const getSimplifiedRatio = (w: number, h: number) => {
    if (!w || !h) return '0:0';
    const divisor = gcd(w, h);
    return `${w / divisor}:${h / divisor}`;
  };

  const handleWidthChange = (val: string) => {
    setWidth(val);
    const w = parseFloat(val);
    if (lockRatio && w && currentRatio) {
      setHeight(Math.round(w / currentRatio).toString());
    } else if (!lockRatio && w && parseFloat(height)) {
      setCurrentRatio(w / parseFloat(height));
    }
  };

  const handleHeightChange = (val: string) => {
    setHeight(val);
    const h = parseFloat(val);
    if (lockRatio && h && currentRatio) {
      setWidth(Math.round(h * currentRatio).toString());
    } else if (!lockRatio && h && parseFloat(width)) {
      setCurrentRatio(parseFloat(width) / h);
    }
  };

  const setPreset = (w: number, h: number) => {
    setWidth(w.toString());
    setHeight(h.toString());
    setCurrentRatio(w / h);
  };

  const presets = [
    { label: '1:1 (Square)', w: 1080, h: 1080 },
    { label: '16:9 (HD)', w: 1920, h: 1080 },
    { label: '4:3 (Classic)', w: 1024, h: 768 },
    { label: '21:9 (Ultrawide)', w: 3440, h: 1440 },
    { label: '9:16 (Story)', w: 1080, h: 1920 },
    { label: '3:2 (Photo)', w: 1080, h: 720 },
  ];

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="card border rounded-xl p-6 space-y-8 bg-card shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Width (px)</label>
            <input
              type="number"
              className="w-full border rounded-xl p-4 text-2xl font-black bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={width}
              onChange={(e) => handleWidthChange(e.target.value)}
            />
          </div>

          <div className="flex flex-col items-center justify-center pb-2">
            <button
              onClick={() => setLockRatio(!lockRatio)}
              className={`p-3 rounded-full transition-all ${lockRatio ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              title={lockRatio ? 'Unlock Ratio' : 'Lock Ratio'}
            >
              {lockRatio ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
            </button>
            <span className="text-[9px] font-black uppercase tracking-tighter mt-2 text-muted-foreground">
              {lockRatio ? 'Ratio Locked' : 'Ratio Unlocked'}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Height (px)</label>
            <input
              type="number"
              className="w-full border rounded-xl p-4 text-2xl font-black bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={height}
              onChange={(e) => handleHeightChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-primary/[0.03] border border-primary/10 rounded-2xl space-y-2">
           <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Current Ratio</div>
           <div className="text-5xl font-black text-primary tracking-tighter">
              {getSimplifiedRatio(parseFloat(width) || 0, parseFloat(height) || 0)}
           </div>
           <div className="text-xs font-bold text-muted-foreground">
              {(parseFloat(width) / parseFloat(height) || 0).toFixed(3)} decimal
           </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
             Common Presets
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => setPreset(p.w, p.h)}
                className="p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-primary/10 hover:border-primary/30 transition-all text-left space-y-1 group"
              >
                <div className="text-[10px] font-black uppercase tracking-tight text-muted-foreground group-hover:text-primary transition-colors">{p.label}</div>
                <div className="text-sm font-bold truncate">{p.w} x {p.h}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => { setWidth('1920'); setHeight('1080'); setCurrentRatio(1920/1080); }}
          className="border px-6 py-3 rounded-xl font-bold hover:bg-muted/50 transition-all w-full uppercase tracking-widest text-xs"
        >
          Reset Calculator
        </button>
      </div>
    </div>
  );
}
