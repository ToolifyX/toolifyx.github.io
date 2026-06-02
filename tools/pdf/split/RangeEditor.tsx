import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PageRange } from './pdfSplitUtils';

interface RangeEditorProps {
  ranges: PageRange[];
  mergeRanges: boolean;
  onAddRange: () => void;
  onRemoveRange: (index: number) => void;
  onUpdateRange: (index: number, field: 'from' | 'to', value: number) => void;
  onMergeRangesChange: (value: boolean) => void;
}

export default function RangeEditor({
  ranges,
  mergeRanges,
  onAddRange,
  onRemoveRange,
  onUpdateRange,
  onMergeRangesChange,
}: RangeEditorProps) {
  return (
    <div className="space-y-3">
      {ranges.map((range, index) => (
        <div key={index} className="rounded-lg border border-border p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase text-muted-foreground">Range {index + 1}</p>
            {ranges.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveRange(index)}
                className="text-destructive hover:opacity-80"
                aria-label={`Remove range ${index + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min={1}
              value={range.from}
              onChange={(event) => onUpdateRange(index, 'from', Number(event.target.value) || 1)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              placeholder="From"
            />
            <input
              type="number"
              min={1}
              value={range.to}
              onChange={(event) => onUpdateRange(index, 'to', Number(event.target.value) || 1)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              placeholder="To"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={onAddRange}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted"
      >
        <Plus className="w-4 h-4" />
        Add Range
      </button>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={mergeRanges}
          onChange={(event) => onMergeRangesChange(event.target.checked)}
          className="h-4 w-4"
        />
        Merge all ranges
      </label>
    </div>
  );
}
