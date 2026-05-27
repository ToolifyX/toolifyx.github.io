"use client";

import React from 'react';
import { toolRegistry } from '@/tools/registry';

interface ToolRendererProps {
  componentName: string;
}

export default function ToolRenderer({ componentName }: ToolRendererProps) {
  const Component = toolRegistry[componentName];

  if (!Component) {
    return (
      <div className="p-8 text-center border-2 border-dashed rounded-lg">
        <p className="text-red-500">Tool component "{componentName}" not found in registry.</p>
      </div>
    );
  }

  return <Component />;
}
