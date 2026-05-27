"use client";

import React from 'react';

interface ToolSplitLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export default function ToolSplitLayout({ left, right }: ToolSplitLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* LEFT PANEL (Secondary/Controls) - Max 25% on desktop */}
      <aside className="w-full lg:w-[300px] shrink-0 space-y-4">
        {left}
      </aside>

      {/* RIGHT PANEL (Primary Workspace) - flex-grow to take majority space */}
      <main className="flex-1 min-w-0 space-y-4">
        {right}
      </main>
    </div>
  );
}
