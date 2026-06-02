import React from 'react';

export type SplitMode = 'range' | 'extract' | 'fixed';

interface SplitModeTabsProps {
  mode: SplitMode;
  onChange: (mode: SplitMode) => void;
}

const TABS: { value: SplitMode; label: string }[] = [
  { value: 'range', label: 'Range' },
  { value: 'extract', label: 'Extract' },
  { value: 'fixed', label: 'Fixed' },
];

export default function SplitModeTabs({ mode, onChange }: SplitModeTabsProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
            mode === tab.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
