import React from 'react';

interface ExtractEditorProps {
  pageInput: string;
  onChange: (value: string) => void;
}

export default function ExtractEditor({ pageInput, onChange }: ExtractEditorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase text-muted-foreground">Pages</label>
      <input
        type="text"
        value={pageInput}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        placeholder="1,3,5-8"
      />
      <p className="text-xs text-muted-foreground">Use comma-separated values and ranges (example: 1,3,5-8).</p>
    </div>
  );
}
