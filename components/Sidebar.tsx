"use client";

import React from 'react';
import { FileText, Layers, Settings, Info } from 'lucide-react';
import { Annotation } from '@/lib/pdfEngine';

interface SidebarProps {
  annotations: Annotation[];
  pageCount: number;
  fileName: string;
  onRemoveAnnotation: (id: string) => void;
}

export default function Sidebar({
  annotations,
  pageCount,
  fileName,
  onRemoveAnnotation
}: SidebarProps) {
  return (
    <div className="w-64 bg-card border-l flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-black uppercase tracking-widest truncate">{fileName || 'Document'}</h2>
        </div>
        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase">
          <span>{pageCount} Pages</span>
          <span>{annotations.length} Annotations</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Layers</h3>
        </div>

        <div className="space-y-2">
          {annotations.length === 0 ? (
            <div className="text-center py-8 px-4 border border-dashed rounded-xl opacity-40">
              <p className="text-[10px] font-bold uppercase tracking-widest">No annotations yet</p>
            </div>
          ) : (
            annotations.map((ann) => (
              <div
                key={ann.id}
                className="group flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-transparent hover:border-border transition-all"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-2 h-2 rounded-full ${
                    ann.type === 'text' ? 'bg-blue-500' :
                    ann.type === 'highlight' ? 'bg-yellow-400' : 'bg-primary'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold truncate uppercase">{ann.type}</p>
                    <p className="text-[9px] text-muted-foreground truncate uppercase">Page {ann.page + 1}</p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveAnnotation(ann.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 text-destructive rounded transition-all"
                >
                  <Settings className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-4 bg-muted/30 border-t">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <Info className="w-3 h-3" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Editor Info</span>
        </div>
        <p className="text-[9px] leading-relaxed text-muted-foreground/80 font-medium">
          Annotations are stored locally and will be merged with the PDF upon export.
        </p>
      </div>
    </div>
  );
}
