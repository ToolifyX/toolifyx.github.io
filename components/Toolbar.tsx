"use client";

import React from 'react';
import {
  Type,
  Highlighter,
  Pencil,
  Image as ImageIcon,
  Trash2,
  Undo,
  Redo,
  Download,
  Plus
} from 'lucide-react';

interface ToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  onDeleteSelected: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function Toolbar({
  selectedTool,
  onToolSelect,
  onUndo,
  onRedo,
  onExport,
  onDeleteSelected,
  canUndo,
  canRedo
}: ToolbarProps) {
  const tools = [
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'highlight', icon: Highlighter, label: 'Highlight' },
    { id: 'draw', icon: Pencil, label: 'Draw' },
    { id: 'image', icon: ImageIcon, label: 'Image' },
  ];

  return (
    <div className="flex items-center justify-between bg-card border-b px-4 py-2 sticky top-0 z-50">
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolSelect(tool.id)}
            className={`p-2 rounded-lg transition-all ${
              selectedTool === tool.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'hover:bg-muted text-muted-foreground'
            }`}
            title={tool.label}
          >
            <tool.icon className="w-5 h-5" />
          </button>
        ))}

        <div className="w-[1px] h-6 bg-border mx-2" />

        <button
          onClick={onDeleteSelected}
          className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
          title="Delete selected"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-30 transition-all"
          title="Undo"
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-30 transition-all"
          title="Redo"
        >
          <Redo className="w-5 h-5" />
        </button>

        <div className="w-[1px] h-6 bg-border mx-2" />

        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
}
