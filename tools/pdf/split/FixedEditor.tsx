import React from 'react';

interface FixedEditorProps {
  pagesPerSplit: number;
  onChange: (value: number) => void;
}

export default function FixedEditor({ pagesPerSplit, onChange }: FixedEditorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase text-muted-foreground">Split every</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={pagesPerSplit}
          onChange={(event) => onChange(Number(event.target.value) || 1)}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        />
        <span className="text-sm text-muted-foreground whitespace-nowrap">pages</span>
      </div>
    </div>
  );
}
