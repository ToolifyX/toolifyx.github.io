"use client";

/**
 * SEO Title: Online Dice Roller - Virtual 3D Dice for Games
 * Meta Description: Roll multiple virtual dice (D4, D6, D8, D10, D12, D20, D100). Animated rolling, history, and total calculations. Perfect for tabletop games and decisions.
 */

import React, { useState } from 'react';
import { Dices, RefreshCw, Trash2, History } from 'lucide-react';

type DieType = 4 | 6 | 8 | 10 | 12 | 20 | 100;

interface Roll {
  type: DieType;
  value: number;
  timestamp: number;
}

export default function DiceRoller() {
  const [activeDice, setActiveDice] = useState<DieType[]>([]);
  const [currentRolls, setCurrentRolls] = useState<Roll[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<Roll[][]>([]);

  const rollDie = (type: DieType): number => Math.floor(Math.random() * type) + 1;

  const handleRoll = () => {
    if (activeDice.length === 0) return;
    setIsRolling(true);

    setTimeout(() => {
      const rolls = activeDice.map(type => ({
        type,
        value: rollDie(type),
        timestamp: Date.now()
      }));
      setCurrentRolls(rolls);
      setHistory(prev => [rolls, ...prev].slice(0, 10));
      setIsRolling(false);
    }, 600);
  };

  const addDie = (type: DieType) => {
    if (activeDice.length < 20) setActiveDice([...activeDice, type]);
  };

  const removeDie = (index: number) => {
    setActiveDice(activeDice.filter((_, i) => i !== index));
  };

  const total = currentRolls.reduce((sum, r) => sum + r.value, 0);

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
           <div className="card border rounded-2xl p-8 bg-card shadow-sm space-y-8 min-h-[400px] flex flex-col">
              <div className="flex items-center justify-between">
                 <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Dices className="w-4 h-4" /> Dice Tray
                 </h3>
                 <button onClick={() => { setActiveDice([]); setCurrentRolls([]); }} className="text-[10px] font-black uppercase text-muted-foreground hover:text-destructive">Clear All</button>
              </div>

              <div className="flex-1 flex flex-wrap gap-4 items-center justify-center p-8 bg-muted/10 rounded-3xl border border-dashed border-border/50">
                 {activeDice.length === 0 ? (
                   <div className="text-center space-y-2 opacity-40 italic text-sm">
                      <p>Select dice from the right to start rolling</p>
                   </div>
                 ) : (
                   activeDice.map((type, i) => (
                     <div key={i} className="relative group">
                        <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center font-black text-xl shadow-lg transition-all ${isRolling ? 'animate-bounce' : 'bg-background border-primary text-primary'}`}>
                           {currentRolls[i]?.value || `D${type}`}
                        </div>
                        <button onClick={() => removeDie(i)} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Trash2 className="w-3 h-3" />
                        </button>
                     </div>
                   ))
                 )}
              </div>

              {currentRolls.length > 0 && !isRolling && (
                <div className="flex flex-col items-center justify-center space-y-1 animate-in zoom-in-95 duration-500">
                   <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Total Sum</div>
                   <div className="text-6xl font-black text-primary tracking-tighter">{total}</div>
                </div>
              )}

              <button
                onClick={handleRoll}
                disabled={activeDice.length === 0 || isRolling}
                className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black text-base uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isRolling ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Dices className="w-5 h-5" />}
                Roll {activeDice.length} Dice
              </button>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="card border rounded-xl p-6 bg-card shadow-sm space-y-4">
             <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Available Dice</h3>
             <div className="grid grid-cols-2 gap-2">
                {([4, 6, 8, 10, 12, 20, 100] as DieType[]).map(d => (
                  <button
                    key={d}
                    onClick={() => addDie(d)}
                    className="p-4 rounded-xl border border-border bg-muted/20 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all font-black text-lg"
                  >
                    D{d}
                  </button>
                ))}
             </div>
          </div>

          <div className="card border rounded-xl p-6 bg-card shadow-sm space-y-4 flex-1">
             <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <History className="w-3.5 h-3.5" /> Recent Rolls
             </h3>
             <div className="space-y-2">
                {history.length === 0 ? (
                  <p className="text-[10px] italic text-muted-foreground">No history yet</p>
                ) : (
                  history.map((rolls, i) => (
                    <div key={i} className="p-3 border rounded-lg bg-muted/5 flex items-center justify-between text-xs">
                       <div className="flex gap-1">
                          {rolls.map((r, ri) => <span key={ri} className="font-bold text-primary">{r.value}</span>)}
                       </div>
                       <span className="font-black text-muted-foreground">Total: {rolls.reduce((s, r) => s + r.value, 0)}</span>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
