import React from 'react';
import Link from 'next/link';
import { Tool } from '@/tools/types';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/tools/${tool.slug}`} title={tool.title}>
      <div className="h-full p-3 border rounded-lg bg-card hover:border-primary hover:shadow-sm transition-all flex flex-col justify-between space-y-1">
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
            {tool.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {tool.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-1">
           <span className="text-[10px] font-medium text-primary uppercase tracking-tighter opacity-70">
            {tool.category}
          </span>
          <svg
            className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
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
