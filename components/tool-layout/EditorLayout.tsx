"use client";

import React from 'react';
import { DynamicIcon } from '@/components/DynamicIcon';

interface EditorLayoutProps {
  toolName: string;
  toolIcon?: string;
  fileName?: string;
  topBarActions?: React.ReactNode;
  leftPanel?: React.ReactNode;
  mainCanvas: React.ReactNode;
  rightPanel?: React.ReactNode;
  onDownload?: () => void;
}

export default function EditorLayout({
  toolName,
  toolIcon,
  fileName,
  topBarActions,
  leftPanel,
  mainCanvas,
  rightPanel,
  onDownload
}: EditorLayoutProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-180px)] min-h-[600px] w-full bg-background overflow-hidden">
      {/* TOP BAR */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            {toolIcon && (
              <div className="text-primary">
                <DynamicIcon name={toolIcon} size={18} strokeWidth={2.5} />
              </div>
            )}
            <h2 className="text-sm font-black uppercase tracking-tight">{toolName}</h2>
          </div>
          {fileName && (
            <>
              <div className="h-4 w-px bg-border mx-1" />
              <span className="text-xs text-muted-foreground font-medium truncate max-w-[200px]">{fileName}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {topBarActions}
          {onDownload && (
            <button
              onClick={onDownload}
              className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Download
            </button>
          )}
        </div>
      </header>

      {/* WORKSPACE AREA */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* LEFT PANEL (Secondary Tools) */}
        {leftPanel && (
          <aside className="hidden lg:flex w-[240px] border-r border-border bg-card flex-col shrink overflow-y-auto z-20">
            <div className="p-4 space-y-6">
              {leftPanel}
            </div>
          </aside>
        )}

        {/* MAIN CANVAS (Primary Workspace - Flexible growth) */}
        <main className="flex-1 bg-muted/20 relative overflow-hidden flex flex-col h-full min-w-0">
          <div className="flex-1 overflow-auto flex items-center justify-center p-4">
            {mainCanvas}
          </div>
        </main>

        {/* RIGHT PANEL (Secondary Options) */}
        {rightPanel && (
          <aside className="hidden lg:flex w-[360px] border-l border-border bg-card flex-col shrink-0 overflow-y-auto z-20">
            <div className="p-6 space-y-8">
              {rightPanel}
            </div>
          </aside>
        )}
      </div>

      {/* MOBILE DRAWER/CONTROLS */}
      <div className="lg:hidden border-t border-border bg-card p-4 shrink-0 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex items-center gap-4">
          {leftPanel}
          {rightPanel}
        </div>
      </div>
    </div>
  );
}
