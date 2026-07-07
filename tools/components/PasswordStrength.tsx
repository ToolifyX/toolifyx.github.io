"use client";

/**
 * SEO Title: Password Strength Checker - Analyze Password Security Online
 * Meta Description: Check your password strength locally. Get detailed analysis on entropy, crack time, and security suggestions. 100% private and secure.
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, Zap, Clock, AlertTriangle } from 'lucide-react';

export default function PasswordStrength() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [zxcvbn, setZxcvbn] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    // Load zxcvbn from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.2/zxcvbn.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      setZxcvbn(() => window.zxcvbn);
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (zxcvbn && password) {
      setAnalysis(zxcvbn(password));
    } else {
      setAnalysis(null);
    }
  }, [password, zxcvbn]);

  const getScoreColor = (score: number) => {
    switch (score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-500';
      case 4: return 'bg-emerald-500';
      default: return 'bg-muted';
    }
  };

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Strong';
      case 4: return 'Excellent';
      default: return 'No Data';
    }
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      {!zxcvbn && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3 text-primary">
           <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><path fill="currentColor" d="M12,4V2A8,8 0 0,0 4,10H6A6,6 0 0,1 12,4Z"/></svg>
           <span className="text-xs font-bold uppercase tracking-widest">Loading Security Engine...</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
           <div className="card border rounded-2xl p-8 bg-card shadow-sm space-y-8">
              <div className="space-y-4">
                 <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Test Password</label>
                    <button onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-primary transition-colors">
                       {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                 </div>
                 <div className="relative">
                    <input
                       type={showPassword ? 'text' : 'password'}
                       className="w-full border rounded-2xl p-5 text-2xl font-black bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none transition-all tracking-[0.2em]"
                       placeholder="••••••••••••"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 right-5 text-muted-foreground/20">
                       <Lock className="w-8 h-8" />
                    </div>
                 </div>
              </div>

              {analysis && (
                <div className="space-y-6 animate-in fade-in duration-500">
                   <div className="space-y-3">
                      <div className="flex justify-between items-end px-1">
                         <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Strength Score</span>
                         <span className={`text-sm font-black uppercase ${getScoreColor(analysis.score).replace('bg-', 'text-')}`}>{getScoreLabel(analysis.score)}</span>
                      </div>
                      <div className="flex gap-1.5 h-3">
                         {[0, 1, 2, 3].map(i => (
                           <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${analysis.score > i ? getScoreColor(analysis.score) : 'bg-muted'}`} />
                         ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border bg-muted/5 space-y-1">
                         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" /> Crack Time
                         </div>
                         <div className="text-xl font-black text-foreground">{analysis.crack_times_display.offline_fast_hashing_1e10_per_second}</div>
                         <div className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">Offline Fast Attack</div>
                      </div>
                      <div className="p-4 rounded-xl border bg-muted/5 space-y-1">
                         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <Zap className="w-3.5 h-3.5 text-yellow-500" /> Entropy
                         </div>
                         <div className="text-xl font-black text-foreground">{analysis.guesses_log10.toFixed(2)} bits</div>
                         <div className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">Guesses (log10)</div>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
           <div className="card border rounded-xl p-6 bg-card shadow-sm space-y-6 h-full">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                 <AlertTriangle className="w-4 h-4" /> Security Suggestions
              </div>

              <div className="space-y-4">
                 {analysis?.feedback?.warning && (
                   <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl">
                      <p className="text-xs font-bold leading-relaxed">{analysis.feedback.warning}</p>
                   </div>
                 )}

                 <div className="space-y-2">
                    {analysis?.feedback?.suggestions?.length > 0 ? (
                       analysis.feedback.suggestions.map((s: string, i: number) => (
                         <div key={i} className="flex gap-3 p-3 bg-muted/10 rounded-lg border border-border/50">
                            <div className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</div>
                            <p className="text-xs font-medium text-muted-foreground">{s}</p>
                         </div>
                       ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic p-4 text-center bg-muted/10 rounded-xl">
                         {password ? 'This password looks secure!' : 'Enter a password to receive suggestions'}
                      </p>
                    )}
                 </div>
              </div>

              <div className="pt-6 border-t border-border mt-auto">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/60">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side
                 </div>
                 <p className="text-[10px] text-muted-foreground mt-1">Your password never leaves your browser. All analysis is done locally.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
