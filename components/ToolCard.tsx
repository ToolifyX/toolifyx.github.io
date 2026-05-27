import React from 'react';
import Link from 'next/link';
import { Tool } from '@/tools/types';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/tools/${tool.slug}`} className="group">
      <div className="h-full p-6 border rounded-xl bg-card hover:border-primary transition-colors flex flex-col">
        <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">
          {tool.category}
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {tool.title}
        </h3>
        <p className="text-muted-foreground text-sm flex-grow">
          {tool.description}
        </p>
        <div className="mt-4 text-primary font-medium text-sm flex items-center">
          Open Tool
          <svg
            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
