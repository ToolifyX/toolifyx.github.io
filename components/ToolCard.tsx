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
      <div className="h-full p-5 border-2 rounded-2xl bg-card hover:border-primary hover:shadow-md transition-all flex flex-col space-y-4 group">
        <div className="flex flex-col space-y-3">
          <div className="p-3 w-fit rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <DynamicIcon name={tool.icon || 'HelpCircle'} size={28} strokeWidth={2.5} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black group-hover:text-primary transition-colors leading-tight">
              {tool.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tool.description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2">
           <span className="text-[11px] font-black text-muted-foreground/60 uppercase tracking-widest">
            {tool.category}
          </span>
          <div className="p-1.5 rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
