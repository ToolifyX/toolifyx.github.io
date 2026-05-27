"use client";

import React from 'react';
import { toolRegistry } from '@/tools/registry';
import { Tool } from '@/tools/types';

interface ToolRendererProps {
  tool: Tool;
}

export default function ToolRenderer({ tool }: ToolRendererProps) {
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
