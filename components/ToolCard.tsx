import React from 'react';
import Link from 'next/link';
import { Tool } from '@/tools/types';
import { DynamicIcon } from './DynamicIcon';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/tools/${tool.slug}`} title={tool.title}>
      <div className="h-full p-3 border rounded-lg bg-card hover:border-primary hover:shadow-sm transition-all flex flex-col justify-between space-y-2 group">
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <DynamicIcon name={tool.icon || 'HelpCircle'} size={16} strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
              {tool.title}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {tool.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-1">
           <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
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
