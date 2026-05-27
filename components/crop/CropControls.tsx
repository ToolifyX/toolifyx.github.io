"use client";

import React from 'react';
import { Crop, Download, RotateCcw } from 'lucide-react';

interface CropControlsProps {
  onCrop: () => void;
  onReset: () => void;
  status: 'idle' | 'ready' | 'cropping' | 'done';
}

export default function CropControls({ onCrop, onReset, status }: CropControlsProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onReset}
        className="flex-1 px-4 py-3 rounded-xl border border-border bg-card font-bold text-sm uppercase tracking-tighter hover:bg-muted transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
      <button
        onClick={onCrop}
        disabled={status !== 'ready'}
        className="flex-[2] px-4 py-3 rounded-xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
      >
        <Crop className="w-4 h-4" />
        Apply Crop
      </button>
    </div>
  );
}
