"use client";

/**
 * SEO Title: Online Coin Flip - Virtual Coin Tosser
 * Meta Description: Flip a virtual coin for quick decisions. Single or multiple flips with detailed statistics (heads/tails percentage) and history. Fast and secure.
 */

import React, { useState } from 'react';
import { Coins, RefreshCw, History, Trash2 } from 'lucide-react';

type Side = 'Heads' | 'Tails';

export default function CoinFlip() {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<Side | null>(null);
  const [stats, setStats] = useState({ heads: 0, tails: 0, total: 0 });
  const [history, setHistory] = useState<Side[]>([]);

  const handleFlip = (count: number = 1) => {
    setIsFlipping(true);

    setTimeout(() => {
      let h = 0, t = 0;
      const newSides: Side[] = [];

      for (let i = 0; i < count; i++) {
        const side: Side = Math.random() > 0.5 ? 'Heads' : 'Tails';
        if (side === 'Heads') h++; else t++;
        newSides.push(side);
      }

      setResult(newSides[0]);
      setStats(prev => ({
        heads: prev.heads + h,
        tails: prev.tails + t,
        total: prev.total + count
      }));
      setHistory(prev => [...newSides, ...prev].slice(0, 30));
      setIsFlipping(false);
    }, 600);
  };

  const resetStats = () => {
    setStats({ heads: 0, tails: 0, total: 0 });
    setHistory([]);
    setResult(null);
  };

  const headsPercent = stats.total > 0 ? Math.round((stats.heads / stats.total) * 100) : 0;
  const tailsPercent = stats.total > 0 ? Math.round((stats.tails / stats.total) * 100) : 0;

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
           <div className="card border rounded-2xl p-8 bg-card shadow-sm flex flex-col items-center justify-center min-h-[450px] space-y-12">
              <div className="relative">
                 <div className={`w-40 h-40 rounded-full border-8 border-yellow-500 bg-yellow-400 flex items-center justify-center shadow-2xl transition-all duration-500 transform ${isFlipping ? 'scale-110 rotate-[720deg]' : 'scale-100 rotate-0'}`}>
                    <div className="w-32 h-32 rounded-full border-4 border-yellow-600/30 flex items-center justify-center">
                       <span className="text-2xl font-black text-yellow-800 uppercase tracking-widest">{isFlipping ? '?' : (result || 'Flip')}</span>
                    </div>
                 </div>
                 <div className="absolute -inset-4 bg-yellow-500/10 rounded-full blur-2xl -z-10 animate-pulse" />
              </div>

              <div className="flex gap-3 w-full max-w-sm">
                 <button
                    onClick={() => handleFlip(1)}
                    disabled={isFlipping}
                    className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                 >
                    Flip Once
                 </button>
                 <button
                    onClick={() => handleFlip(100)}
                    disabled={isFlipping}
                    className="px-6 border border-border rounded-xl font-bold text-xs hover:bg-muted/50"
                 >
                    Flip 100x
                 </button>
              </div>
           </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
           <div className="card border rounded-xl p-6 bg-card shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Coins className="w-4 h-4" /> Statistics
                 </h3>
                 <button onClick={resetStats} className="text-[10px] font-black uppercase text-muted-foreground hover:text-destructive">Reset</button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <StatBox label="Heads" value={stats.heads} percent={headsPercent} theme="blue" />
                 <StatBox label="Tails" value={stats.tails} percent={tailsPercent} theme="orange" />
              </div>

              <div className="space-y-4 pt-4 border-t">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recent History</h4>
                 <div className="flex flex-wrap gap-1">
                    {history.map((s, i) => (
                      <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${s === 'Heads' ? 'bg-blue-500/20 text-blue-600' : 'bg-orange-500/20 text-orange-600'}`}>
                         {s[0]}
                      </div>
                    ))}
                    {history.length === 0 && <p className="text-[10px] italic text-muted-foreground">No flips yet</p>}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, percent, theme }: { label: string, value: number, percent: number, theme: string }) {
  return (
    <div className={`p-4 rounded-xl border border-${theme}-500/20 bg-${theme}-500/[0.03] space-y-2`}>
       <div className="flex justify-between items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
          <span className={`text-xl font-black text-${theme}-600`}>{value}</span>
       </div>
       <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div className={`h-full bg-${theme}-500 transition-all duration-1000`} style={{ width: `${percent}%` }} />
       </div>
       <div className="text-[10px] font-bold text-right opacity-40">{percent}%</div>
    </div>
  );
}
