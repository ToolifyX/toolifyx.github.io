"use client";

import React from 'react';

interface ToolSplitLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export default function ToolSplitLayout({ left, right }: ToolSplitLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="space-y-4">
        {left}
      </div>
      <div className="space-y-4 lg:sticky lg:top-20 self-start">
        {right}
      </div>
    </div>
  );
}
