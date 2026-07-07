"use client";

import React, { useEffect } from 'react';
import { toolRegistry } from '@/tools/registry';
import { Tool } from '@/tools/types';

interface ToolRendererProps {
  tool: Tool;
}

export default function ToolRenderer({ tool }: ToolRendererProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const recentlyUsed = JSON.parse(localStorage.getItem('recentlyUsedTools') || '[]');
        if (Array.isArray(recentlyUsed)) {
          const updated = [
            tool.slug,
            ...recentlyUsed.filter((slug: string) => slug !== tool.slug)
          ].slice(0, 10);
          localStorage.setItem('recentlyUsedTools', JSON.stringify(updated));
        } else {
          localStorage.setItem('recentlyUsedTools', JSON.stringify([tool.slug]));
        }
      } catch (e) {
        localStorage.setItem('recentlyUsedTools', JSON.stringify([tool.slug]));
      }
    }
  }, [tool.slug]);

  const Component = toolRegistry[tool.component];

  if (!Component) {
    return (
      <div className="p-8 text-center border-2 border-dashed rounded-lg">
        <p className="text-red-500">Tool component "{tool.component}" not found in registry.</p>
      </div>
    );
  }

  return <Component {...{ tool }} />;
}
