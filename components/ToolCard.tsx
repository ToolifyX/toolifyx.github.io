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
      <div className="h-full p-5 border rounded-2xl bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col group">
        <div className="flex items-start gap-4">
          <div className="text-primary shrink-0 pt-1">
            <DynamicIcon name={tool.icon || 'HelpCircle'} size={24} strokeWidth={2.5} />
          </div>
          <div className="space-y-1.5 min-w-0">
            <h3 className="text-lg font-bold group-hover:text-primary transition-colors leading-tight">
              {tool.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {tool.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4">
          <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest ml-10">
            {tool.category}
          </span>
          <div className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
